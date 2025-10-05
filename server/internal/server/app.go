package server

import (
	"github.com/owenHochwald/bathroomQueueScheduler/internal/handlers"
	"github.com/owenHochwald/bathroomQueueScheduler/internal/services"
	"github.com/redis/go-redis/v9"
)

type Application struct {
	DB *redis.Client

	QueueService services.QueueServiceInterface

	QueueHandler *handlers.QueueHandler
	WsManager    *handlers.WSManager
}

func NewApplication(db *redis.Client) *Application {
	application := &Application{
		DB: db,
	}
	initServices(application)
	initHandlers(application)
	return application
}

func initServices(app *Application) {
	app.QueueService = services.NewQueueService(app.DB)
}

func initHandlers(app *Application) {
	app.QueueHandler = handlers.NewQueueHandler(app.QueueService)
	app.WsManager = handlers.NewWSManager(app.DB)

}
