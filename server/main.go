package main

import (
	"Ozone-Dev/server/router"
	"fmt"
	"log"
	"net/http"
)

func main() {
	r := router.Router()
	// fs := http.FileServer(http.Dir("build"))
	// http.Handle("/", fs)
	fmt.Println("Starting server on the port 8080...")
	//log.Fatal(http.ListenAndServeTLS(":8080", "/etc/letsencrypt/live/lumberio.com/fullchain.pem", "/etc/letsencrypt/live/lumberio.com/privkey.pem", r))
	log.Fatal(http.ListenAndServe(":8080", r))
}
