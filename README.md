# Throne Tracker - Bathroom Queue Scheduler
A real-time bathroom queue management for roomates. No more akward door kocking. Ever.

## Features
- **Real-time queue management** - Live position updates via WebSockets
- **Auto-promotion** - Next person notified when bathroom is ready
- **Stats tracking** - Personal stats and leaderboards for time competitions
- **Emergency mode** - Jump the queue! (limited use)
- **Timeout warnings** - Auto-kick bathroom hogs after 1 hour

## Tech Stack
**Backend:** Go + Gin + Redis + WebSockets

**Frontend:** React + Tailwind

## Quickstart
```aiignore
# Start Redis
docker compose up -d

# Backend
cd server
go run main.go

# Frontend
cd client
npm install && npm run dev
```