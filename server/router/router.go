package router

import (
	"go-to-do-app/server/middleware"
	"github.com/gorilla/mux"
)

// Router is exported and used in main.go
func Router() *mux.Router {
	router := mux.NewRouter()
	router.HandleFunc("/api/joinnow", middleware.AddEmail).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/register", middleware.AddUser).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/login", middleware.Login).Methods("POST", "OPTIONS")
    
    s := router.PathPrefix("/auth").Methods("GET","POST", "OPTIONS").Subrouter()
    s.Use(middleware.AuthMiddle)	
    s.HandleFunc("/api/lumberbundles", middleware.Bundles).Methods("GET", "OPTIONS")
	s.HandleFunc("/api/orders", middleware.Order).Methods("GET", "OPTIONS")
    
	// Profile Routes
    s.HandleFunc("/api/profilefetch", middleware.GetProfile).Methods("GET", "OPTIONS")
    s.HandleFunc("/api/profileupdate", middleware.UpdateProfile).Methods("POST", "OPTIONS")
	
    // Checkout Route, we send an email to them
    s.HandleFunc("/api/checkout", middleware.DoCheckout).Methods("POST", "OPTIONS")
    s.HandleFunc("/api/address", middleware.GetAddress).Methods("GET", "OPTIONS")
    return router
}
