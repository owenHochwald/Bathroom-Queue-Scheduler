package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine, app *Application) {
	api := r.Group("/api")

	queue := api.Group("/queue")
	queue.POST("/join", app.QueueHandler.HandleJoin)
	queue.DELETE("/leave", app.QueueHandler.HandleLeave)
	queue.GET("/status", app.QueueHandler.HandleStatus)
	queue.GET("/position", app.QueueHandler.HandleGetPosition)

	api.GET("/stats/:user_id", app.QueueHandler.HandleGetUserStats)
	api.GET("/history", app.QueueHandler.HandleGetHistory)

	api.GET("/status")
	api.GET("/leaderboards")

	r.GET("/ws", app.WsManager.HandleWebSocket)

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(
			http.StatusOK,
			gin.H{
				"message": "you have pinged the server!",
			})
	})
}
