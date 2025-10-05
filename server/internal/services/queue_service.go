package services

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

type QueuePosition struct {
	UserID      string `json:"user_id"`
	Position    int    `json:"position"`
	IsEmergency bool   `json:"is_emergency"`
	JoinedAt    int64  `json:"joined_at"`
}

type QueueStatus struct {
	IsOccupied  bool            `json:"is_occupied"`
	CurrentUser string          `json:"current_user"`
	Queue       []QueuePosition `json:"queue"`
}

type SessionHistory struct {
	UserID    string `json:"user_id"`
	Duration  int    `json:"duration"`
	Timestamp int64  `json:"timestamp"`
}

type QueueServiceInterface interface {
	JoinQueue(userID string, isEmergency bool) error
	LeaveQueue(userID string) error
	GetPosition(userID string) (int, error)
	GetQueuePositions() ([]QueuePosition, error)
	EstimateWaitTime(userID string) (int, error)
	GetStatus() (*QueueStatus, error)
}

type QueueService struct {
	redis     *redis.Client
	publisher Publisher
}

func NewQueueService(redis *redis.Client) QueueServiceInterface {
	return &QueueService{
		redis:     redis,
		publisher: NewRedisPublisher(redis),
	}
}

func (q QueueService) JoinQueue(userID string, isEmergency bool) error {
	ctx := context.Background()
	count, _ := q.redis.ZCard(ctx, "bathroom:queue").Result()
	var score float64

	if isEmergency {
		if count > 0 {
			score = 1
		} else {
			score = 0
		}
	} else {
		score = float64(time.Now().Unix())
	}

	_, err := q.redis.ZAdd(ctx, "bathroom:queue",
		redis.Z{Member: userID, Score: score}).Result()

	if err != nil {
		return fmt.Errorf("failed to add user to queue: %w", err)
	}

	q.publisher.Publish(fmt.Sprintf(`{"type":"join","user":"%s"}`, userID))

	// start counter when first user joins
	if count == 0 {
		q.publisher.Publish(fmt.Sprintf(`{"type":"next_up","user":"%s"}`, userID))

		q.redis.Set(ctx, fmt.Sprintf("user:%s:current_session", userID),
			time.Now().Unix(), time.Hour*1)
	}
	return nil
}

func (q QueueService) LeaveQueue(userID string) error {
	ctx := context.Background()

	position, err := q.GetPosition(userID)

	var duration int
	if position == 0 {
		startTime, err := q.redis.Get(ctx, fmt.Sprintf("user:%s:current_session", userID)).Int()

		if err == nil {
			duration = int(time.Now().Unix()) - startTime

			q.UpdateUserStats(userID, duration)
			q.AddHistory(userID, duration)
		}
		q.redis.Del(ctx, fmt.Sprintf("user:%s:current_session", userID))
	}

	_, err = q.redis.ZRem(ctx, "bathroom:queue", userID).Result()

	q.publisher.Publish(fmt.Sprintf(`{"type":"leave","user":"%s"}`, userID))

	if err != nil {
		return fmt.Errorf("failed to remove user from queue: %w", err)
	}

	// start time of next user and publish notification
	nextUsers, _ := q.redis.ZRange(ctx, "bathroom:queue", 0, 0).Result()
	if len(nextUsers) > 0 {
		nextUser := nextUsers[0]
		q.redis.Set(ctx, fmt.Sprintf("user:%s:current_session", nextUser),
			time.Now().Unix(), 1*time.Hour)

		q.publisher.Publish(fmt.Sprintf(`{"type":"next_up","user":"%s"}`, nextUser))
	}

	return nil
}

func (q QueueService) GetPosition(userID string) (int, error) {
	ctx := context.Background()

	position, err := q.redis.ZRank(ctx, "bathroom:queue", userID).Result()

	if err != nil {
		return -1, fmt.Errorf("failed to get user position: %w", err)
	}

	return int(position), nil
}

func (q QueueService) GetQueuePositions() ([]QueuePosition, error) {
	ctx := context.Background()

	res, err := q.redis.ZRangeWithScores(ctx, "bathroom:queue", 0, -1).Result()

	if err != nil {
		return nil, fmt.Errorf("failed to get queue status: %w", err)
	}

	var queue []QueuePosition
	for i, item := range res {
		userID := item.Member.(string)
		joinedTime := item.Score
		pos := QueuePosition{
			UserID:      userID,
			Position:    i,
			IsEmergency: i == 0,
			JoinedAt:    int64(joinedTime),
		}
		queue = append(queue, pos)
	}

	return queue, nil
}

func (q QueueService) EstimateWaitTime(userID string) (int, error) {
	//TODO: Use an average to estimate wait time * position in queue
	pos, err := q.GetPosition(userID)

	if err != nil {
		return -1, fmt.Errorf("failed to get user position: %w", err)
	}

	// 15 minutes per position
	return pos * 60 * 15, nil
}

func (q QueueService) GetStatus() (*QueueStatus, error) {
	queue, err := q.GetQueuePositions()

	if err != nil {
		return nil, fmt.Errorf("failed to get queue status: %w", err)
	}

	first, err := q.redis.ZRange(context.Background(), "bathroom:queue", 0, 0).Result()

	if err != nil {
		return nil, fmt.Errorf("failed to get queue status: %w", err)
	}

	return &QueueStatus{
		IsOccupied:  len(queue) > 0,
		CurrentUser: first[0],
		Queue:       queue,
	}, nil
}

func (q QueueService) GetHistory() ([]SessionHistory, error) {
	var history []SessionHistory

	items, err := q.redis.LRange(context.Background(), "bathroom:history", 0, -1).Result()
	if err != nil {
		return nil, fmt.Errorf("failed to get history: %w", err)
	}

	for _, item := range items {
		var session SessionHistory
		json.Unmarshal([]byte(item), &session)
		history = append(history, session)
	}
	return history, nil
}

func (q QueueService) AddHistory(userID string, duration int) error {
	ctx := context.Background()

	session := SessionHistory{
		UserID:    userID,
		Duration:  duration,
		Timestamp: time.Now().Unix(),
	}

	sessionJSON, _ := json.Marshal(session)
	q.redis.LPush(ctx, "bathroom:history", string(sessionJSON)).Result()

	q.redis.LTrim(ctx, "bathroom:history", 0, 99)

	return nil
}

func (q QueueService) UpdateUserStats(id string, duration int) {

}

func (q QueueService) GetUserStats(userID string) (map[string]string, error) {
	ctx := context.Background()
	stats, err := q.redis.HGetAll(ctx, fmt.Sprintf("user:%s:stats", userID)).Result()

	if err != nil {
		return nil, fmt.Errorf("failed to get user stats: %w", err)
	}

	return stats, err
}
