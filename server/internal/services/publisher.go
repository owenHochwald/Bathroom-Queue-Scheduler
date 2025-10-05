package services

import (
	"context"
	"fmt"

	"github.com/redis/go-redis/v9"
)

type Publisher interface {
	Publish(message string)
}

type RedisPublisher struct {
	rdb *redis.Client
}

func NewRedisPublisher(redis *redis.Client) Publisher {
	return &RedisPublisher{
		rdb: redis,
	}
}

func (r RedisPublisher) Publish(message string) {
	ctx := context.Background()

	err := r.rdb.Publish(ctx, "bathroom:queue", message).Err()
	if err != nil {
		fmt.Println("Publish failed:", err)
	}
}
