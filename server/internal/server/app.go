package server

import (
	"github.com/owenHochwald/bathroomQueueScheduler/internal/services"
	"github.com/redis/go-redis/v9"
)

type Application struct {
	DB              *redis.Client
	BathroomService services.BathroomServiceInterface
}

func NewApplication(db *redis.Client) *Application {
	application := &Application{
		DB: db,
	}
	initServices(application)
	return application
}

func initServices(app *Application) {
	app.BathroomService = services.NewBathroomService()
}
