package services

import "github.com/redis/go-redis/v9"

type QueuePosition struct {
	UserID   string
	Position int
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
	//TODO implement me
	panic("implement me")
}

func (q QueueService) LeaveQueue(userID string) error {
	//TODO implement me
	panic("implement me")
}

func (q QueueService) GetPosition(userID string) (int, error) {
	//TODO implement me
	panic("implement me")
}

func (q QueueService) GetQueueStatus() ([]QueuePosition, error) {
	//TODO implement me
	panic("implement me")
}

func (q QueueService) EstimateWaitTime(userID string) (int, error) {
	//TODO implement me
	panic("implement me")
}
