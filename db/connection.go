package db


import (
    "os"
    "fmt"
    "database/sql"

    "github.com/joho/godotenv"
    _ "github.com/lib/pq"
    
)

func connectDB() (*sql.DB, error) {
    // Replace with your actual database connection string
    err := godotenv.Load(".env")
    if err != nil {
    	panic(err)
    }

    username := os.Getenv("DB_USER")
    password := os.Getenv("DB_PASSWORD")
    db_name := os.Getenv("DB_NAME")
    db_host := os.Getenv("DB_HOST")
	db_port := os.Getenv("DB_PORT")
    connectionString := fmt.Sprintf("user=%s password=%s dbname=%s host=%s port=%d sslmode=disable", username, password, db_name, db_host, db_port)
    // fmt.Println(connectionString)
    // Open the database connection
    db, err := sql.Open("postgres", connectionString)
    if err != nil {
	return nil, err
    }

    // Check if the connection is successful
    if err = db.Ping(); err != nil {
	return nil, err
    }

    fmt.Println("Connected to PostgreSQL!")
    return db, nil
}
