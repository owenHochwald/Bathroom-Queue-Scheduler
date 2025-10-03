package main

import (
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

	server.SetupRoutes(router, app)

	router.Run()
}
