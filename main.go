package main

import (
    "os"
    "io"
    "fmt"
    "log"
    "strconv"
    "net/http"
    "github.com/joho/godotenv"
    "github.com/gin-gonic/gin"
    "database/sql"
    _ "github.com/lib/pq"
    
)

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


    //get list of bible versions
    //get list of books
    //get list of chapters
    //get range of verses
        //limit to # of verses

    router.POST("/verse/add", func(c *gin.Context) {
        bible_name := c.PostForm("bible_name")
        book_name := c.PostForm("book_name")
        chapter_num, err1 :=  strconv.Atoi(c.PostForm("chapter_num"))
        verse_num, err2 :=  strconv.Atoi(c.PostForm("verse_num"))
        verse_text := c.PostForm("verse_text")
	if err1 != nil || err2 != nil {
	    panic("Could not convert to integer")
	}
	
	fmt.Printf("TEST: %s %s %d %d %s\n", bible_name, book_name, chapter_num, verse_num, verse_text )
	result, err := db.Exec("EXECUTE insert_verse($1, $2, $3, $4, $5)", bible_name, book_name,chapter_num, verse_num, verse_text )
	if err != nil {
	    log.Fatal("Error calling stored procedure:", err)
	}
	fmt.Println(result)

    })
    router.POST("/verse/update", func(c *gin.Context) {
	name := c.PostForm("name")
	fmt.Println(name)
    })
    router.POST("/verse/delete", func(c *gin.Context) {
	name := c.PostForm("name")
	fmt.Println(name)
    })
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
