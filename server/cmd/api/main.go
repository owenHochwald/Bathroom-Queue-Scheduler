package main

import (
	"context"

	"github.com/gin-gonic/gin"
	"github.com/owenHochwald/bathroomQueueScheduler/internal/config"
	"github.com/owenHochwald/bathroomQueueScheduler/internal/server"
)

func main() {
	router := gin.Default()

	db, err := config.ConnectDB()

	if err != nil {
		panic(err)
	}

	app := server.NewApplication(db)

	ctx := context.Background()
	go app.WsManager.ListenPubSub(ctx)

	server.SetupRoutes(router, app)

	router.Run()
}
