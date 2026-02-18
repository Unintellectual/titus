package server

import (
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"log"
	"net/http"
	"titus/internal/utils"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.Logger)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Get("/api/health", s.healthHandler)

	r.Get("/api/ticket", s.TicketIdHandler)

	// Serve React static files (MUST be last)
	r.Handle("/*", http.FileServer(http.Dir("./frontend/dist")))
	return r
}

func (s *Server) healthHandler(w http.ResponseWriter, r *http.Request) {
	jsonResp, _ := json.Marshal(s.db.Health())
	_, _ = w.Write(jsonResp)
}

func (s *Server) TicketIdHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id, err := utils.GenerateID(8)
	if err != nil {
		http.Error(w, "failed to generate ticket ID", http.StatusInternalServerError)
		return
	}

	// Save ticket in DB
	err = s.db.CreateTicket(id)
	if err != nil {
		http.Error(w, "failed to save ticket", http.StatusInternalServerError)
		return
	}

	resp := map[string]string{
		"ticket": id,
		"status": "open",
	}

	json.NewEncoder(w).Encode(resp)
}

func (s *Server) GetTicketStatusHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	id := chi.URLParam(r, "id")

	status, err := s.db.GetTicketStatus(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	resp := map[string]string{
		"ticket": id,
		"status": status,
	}

	json.NewEncoder(w).Encode(resp)
}

func (s *Server) defaultHandler(w http.ResponseWriter, r *http.Request) {
	resp := make(map[string]string)
	resp["message"] = "Hello"

	jsonResp, err := json.Marshal(resp)
	if err != nil {
		log.Fatalf("error handling JSON marshal. Err: %v", err)
	}

	_, _ = w.Write(jsonResp)
}
