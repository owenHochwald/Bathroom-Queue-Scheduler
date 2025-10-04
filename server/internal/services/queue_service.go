package services

import (
	"context"
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

type QueueServiceInterface interface {
	JoinQueue(userID string, isEmergency bool) error
	LeaveQueue(userID string) error
	GetPosition(userID string) (int, error)
	GetQueueStatus() ([]QueuePosition, error)
	EstimateWaitTime(userID string) (int, error)
}

type QueueService struct {
	redis *redis.Client
}

func NewQueueService(redis *redis.Client) QueueServiceInterface {
	return &QueueService{
		redis: redis,
	}
}

func (q QueueService) JoinQueue(userID string, isEmergency bool) error {
	ctx := context.Background()
	var score float64
	if isEmergency {
		score = 0
	} else {
		score = float64(time.Now().Unix())

	}

	_, err := q.redis.ZAdd(ctx, "bathroom:queue",
		redis.Z{Member: userID, Score: score}).Result()

	if err != nil {
		return fmt.Errorf("failed to add user to queue: %w", err)
	}
	return nil
}

func (q QueueService) LeaveQueue(userID string) error {
	ctx := context.Background()

	_, err := q.redis.ZRem(ctx, "bathroom:queue", userID).Result()

	if err != nil {
		return fmt.Errorf("failed to remove user from queue: %w", err)
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

func (q QueueService) GetQueueStatus() ([]QueuePosition, error) {
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

// Returns the estimated wait time in seconds
func (q QueueService) EstimateWaitTime(userID string) (int, error) {
	//TODO: Use an average to estimate wait time * position in queue
	pos, err := q.GetPosition(userID)

	if err != nil {
		return -1, fmt.Errorf("failed to get user position: %w", err)
	}

	// 15 minutes per position
	return pos * 60 * 15, nil
}
