package main

import (
	"github.com/gin-gonic/gin"
	"github.com/owenHochwald/bathroomQueueScheduler/internal/server"
)

func main() {
	router := gin.Default()
	server.SetupRoutes(router)

	router.Run()
}
