package helpers

import (
	"context"
	"fmt"

	"github.com/redis/go-redis/v9"
)

func ping(client redis.Client) error {
	ctx := context.Background()

	fmt.Println(client.Ping(ctx))

	info, err := client.ClientInfo(ctx).Result()
	if err != nil {
		return fmt.Errorf("method ClientInfo failed: %w", err)
	}

	fmt.Printf("%#v\n", info)
	return nil
}
