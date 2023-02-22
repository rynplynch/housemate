package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	r, err := setupRouter()
	if err != nil {
		log.Fatalln(err)
	}

	server := &http.Server{
		Addr:    ":8080",
		Handler: r,
	}
	go func() {
		err := server.ListenAndServe()
		if err != nil && err != http.ErrServerClosed {
			log.Fatalln(err)
		}
	}()

	quit := make(chan os.Signal)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	if err := server.Shutdown(context.Background()); err != nil {
		log.Fatalln(err)
	}
	log.Println("Server closed")
}
