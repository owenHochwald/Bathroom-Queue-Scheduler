package server

import "github.com/owenHochwald/bathroomQueueScheduler/internal/services"

type Application struct {
	BathroomService services.BathroomServiceInterface
}

func NewApplication() *Application {
	application := &Application{}
	initServices(application)
	return application
}

func initServices(app *Application) {
	app.BathroomService = services.NewBathroomService()
}
