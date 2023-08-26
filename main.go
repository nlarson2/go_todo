package main

import (
    "os"
    "io"
    "fmt"
    "log"
    "strconv"
    "strings"
    "net/http"
    "encoding/json"
    "database/sql"

    "github.com/joho/godotenv"
    "github.com/gin-gonic/gin"
    "github.com/nlarson2/verse_search/routes"
    _ "github.com/lib/pq"
    
)


type Bible struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type Book struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type Verse struct {
    Scripture string `json:"scripture"`
}




func connectDB( username string, password string, db_host string, db_name string, port int) (*sql.DB, error) {
    // Replace with your actual database connection string
    
    connectionString := fmt.Sprintf("user=%s password=%s dbname=%s host=%s port=%d sslmode=disable", username, password, db_name, db_host, port)
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




func main() {

    //create log
    f, _ := os.Create("gin.log")
    err := godotenv.Load(".env")
    if err != nil {
    	panic(err)
    }

    username := os.Getenv("DB_USER")
    password := os.Getenv("DB_PASSWORD")
    dbname := os.Getenv("DB_NAME")
    dbhost := os.Getenv("DB_HOST")

    db, err := connectDB(username, password, dbhost, dbname, 5432)
    if err != nil {
	    fmt.Println("Error connecting to the database:", err)
	    return
    }
    fmt.Println("CONNECTED")
    defer db.Close()


    gin.DefaultWriter = io.MultiWriter(f)
    router := gin.Default()

    router.GET("/", func(c *gin.Context) {

        c.SecureJSON(http.StatusOK, gin.H{
            "message":"pong",
        })
    })

    
    routes.InitVerseRoutes(router)


    fmt.Println(os.Getenv("PORT"))
    err = router.Run(":" + os.Getenv("PORT"))
    if err != nil {
        panic(err)
    }


}


// // Query data from the database
// rows, err := db.Query("SELECT name FROM bibles")
// if err != nil {
// 	log.Fatal("Error executing query:", err)
// }
// defer rows.Close()

// // Store the table names in a slice
// var tableNames []string
// for rows.Next() {
// 	var tableName string
// 	if err := rows.Scan(&tableName); err != nil {
// 		log.Fatal("Error scanning row:", err)
// 	}
// 	tableNames = append(tableNames, tableName)
// }

// if err = rows.Err(); err != nil {
// 	log.Fatal("Error retrieving query results:", err)
// }

// // Print the table names
// fmt.Println("Table Names:")
// for _, tableName := range tableNames {
// 	fmt.Println(tableName)
// }
