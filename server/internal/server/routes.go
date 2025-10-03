package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")
	api.POST("/queue/join")
	api.GET("/queue/status")
	api.POST("bathroom/occupy")
	api.POST("bathroom/vacate")

	r.GET("/ws")
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(
			http.StatusOK,
			gin.H{
				"message": "you have pinged the server!",
			})
	})
}
