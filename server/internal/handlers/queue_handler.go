package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/owenHochwald/bathroomQueueScheduler/internal/services"
)

type QueueHandler struct {
	QueueService services.QueueServiceInterface
}

type JoinQueueRequest struct {
	UserID      string `json:"user_id" validate:"required,min=3,max=20"`
	IsEmergency bool   `json:"is_emergency" validate:"required"`
}

type LeaveQueueRequest struct {
	UserID string `json:"user_id" validate:"required,min=3,max=20"`
}

type GetPositionRequest struct {
	UserID string `json:"user_id" validate:"required,min=3,max=20"`
}

func NewQueueHandler(serviceInterface services.QueueServiceInterface) *QueueHandler {
	return &QueueHandler{
		QueueService: serviceInterface,
	}
}

func (q *QueueHandler) HandleJoin(c *gin.Context) {
	var request JoinQueueRequest

	if err := c.ShouldBind(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	validate := validator.New()

	if err := validate.Struct(request); err != nil {
		errors := err.(validator.ValidationErrors)
		c.JSON(http.StatusBadRequest, gin.H{"errors": errors})
		return
	}

	if err := q.QueueService.JoinQueue(request.UserID, request.IsEmergency); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "success"})
}

func (q *QueueHandler) HandleLeave(c *gin.Context) {
	var request LeaveQueueRequest

	if err := c.ShouldBind(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	validate := validator.New()
	if err := validate.Struct(request); err != nil {
		errors := err.(validator.ValidationErrors)
		c.JSON(http.StatusBadRequest, gin.H{"errors": errors})
		return
	}

	if err := q.QueueService.LeaveQueue(request.UserID); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "success"})
}

func (q *QueueHandler) HandleStatus(c *gin.Context) {
	queue, err := q.QueueService.GetStatus()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, queue)
}

func (q *QueueHandler) HandleGetPosition(c *gin.Context) {
	var request GetPositionRequest

	if err := c.ShouldBind(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	position, err := q.QueueService.GetPosition(request.UserID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	waitTime, err := q.QueueService.EstimateWaitTime(request.UserID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"userID":    request.UserID,
		"position":  position,
		"wait_time": waitTime,
	})
}

func (q *QueueHandler) HandleGetUserStats(c *gin.Context) {
	userID := c.Param("user_id")

	stats, err := q.QueueService.GetUserStats(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, stats)
}

func (q *QueueHandler) HandleGetHistory(c *gin.Context) {
	history, err := q.QueueService.GetHistory()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, history)
}
