package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/redis/go-redis/v9"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins in dev (restrict in production!)
	},
}

type WSManager struct {
	clients map[*websocket.Conn]bool
	mu      sync.RWMutex
	redis   *redis.Client
}

func NewWSManager(rdb *redis.Client) *WSManager {
	return &WSManager{
		clients: make(map[*websocket.Conn]bool),
		redis:   rdb,
	}
}

func (m *WSManager) AddClient(conn *websocket.Conn) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.clients[conn] = true
	log.Printf("Client connected. Total clients: %d", len(m.clients))
}

func (m *WSManager) RemoveClient(conn *websocket.Conn) {
	m.mu.Lock()
	defer m.mu.Unlock()
	delete(m.clients, conn)
	conn.Close()
	log.Printf("Client disconnected. Total clients: %d", len(m.clients))
}

func (m *WSManager) Broadcast(message interface{}) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	for client := range m.clients {
		err := client.WriteJSON(message)
		if err != nil {
			log.Printf("Error broadcasting to client: %v", err)
			client.Close()
			delete(m.clients, client)
		}
	}
}

func (m *WSManager) ListenPubSub(ctx context.Context) {
	pubsub := m.redis.Subscribe(ctx, "bathroom:events")
	defer pubsub.Close()

	_, err := pubsub.Receive(ctx)
	if err != nil {
		log.Printf("Error subscribing to Redis: %v", err)
		return
	}

	ch := pubsub.Channel()

	for msg := range ch {

		var event map[string]interface{}
		if err := json.Unmarshal([]byte(msg.Payload), &event); err != nil {
			log.Printf("Error parsing message: %v", err)
			continue
		}

		m.Broadcast(event)
	}
}

func (m *WSManager) HandleWebSocket(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("WebSocket upgrade error:", err)
		return
	}

	m.AddClient(conn)
	defer m.RemoveClient(conn)

	for {
		var msg map[string]interface{}
		err := conn.ReadJSON(&msg)
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("WebSocket error: %v", err)
			}
			break
		}
	}
}
