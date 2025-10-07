package main

import (
	"context"

    "github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/owenHochwald/bathroomQueueScheduler/internal/config"
	"github.com/owenHochwald/bathroomQueueScheduler/internal/server"
)

func main() {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

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
