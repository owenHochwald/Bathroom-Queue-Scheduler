package services

type Session struct{}

type BathroomServiceInterface interface {
	Occupy(userID string) error
	Vacate(UserID string) (int, error)
	IsOccupied() (bool, error)
	GetCurrentSession() (*Session, error)
	CheckTimeout() error
}

type BathromService struct {
}

func (b BathromService) Occupy(userID string) error {
	//TODO implement me
	panic("implement me")
}

func (b BathromService) Vacate(UserID string) (int, error) {
	//TODO implement me
	panic("implement me")
}

func (b BathromService) IsOccupied() (bool, error) {
	//TODO implement me
	panic("implement me")
}

func (b BathromService) GetCurrentSession() (*Session, error) {
	//TODO implement me
	panic("implement me")
}

func (b BathromService) CheckTimeout() error {
	//TODO implement me
	panic("implement me")
}

func NewBathroomService() BathroomServiceInterface {
	return &BathromService{}
}
