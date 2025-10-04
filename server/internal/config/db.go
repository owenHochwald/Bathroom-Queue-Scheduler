package config

import (
	"context"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
)

func ConnectDB() (*redis.Client, error) {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dbPassword := os.Getenv("REDIS_PASSWORD")

	client := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: dbPassword,
		DB:       0,
		Protocol: 2,
	})

	ctx := context.Background()
	err = client.Set(ctx, "foo", "bar", 0).Err()
	if err != nil {
		panic(err)
	}

	_, err = client.Get(ctx, "foo").Result()
	if err != nil {
		panic(err)
	}
	client.Del(ctx, "foo")
	return client, nil
}
