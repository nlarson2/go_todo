package main

import (
	// "os"
	// "io"
	// "fmt"
	// "net/http"
	// "github.com/joho/godotenv"
	// "github.com/gin-gonic/gin"
	"database/sql"
    "fmt"
    // _ "github.com/lib/pq"
)

func connectDB() (*sql.DB, error) {
    // Replace with your actual database connection string
    connectionString := "user=nlarson password=password dbname=bible_db host=localhost port=5432 sslmode=disable"
	fmt.Println(connectionString)
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

	db, err := connectDB()
    if err != nil {
        fmt.Println("Error connecting to the database:", err)
        return
    }
	fmt.Println("CONNECTED")
    defer db.Close()

    // Query data from the database
    rows, err := db.Query("SELECT * FROM your_table_name")
    if err != nil {
        fmt.Println("Error executing query:", err)
        return
    }
    defer rows.Close()

    // Process the query results
    for rows.Next() {
        var id int
        var name string
        var age int

        if err := rows.Scan(&id, &name, &age); err != nil {
            fmt.Println("Error scanning row:", err)
            return
        }

        fmt.Printf("ID: %d, Name: %s, Age: %d\n", id, name, age)
    }

    if err = rows.Err(); err != nil {
        fmt.Println("Error retrieving query results:", err)
        return
    }


	// //create log
	// f, _ := os.Create("gin.log")
	// err := godotenv.Load(".env")
	// if err != nil {
	// 	panic(err)
	// }

	// gin.DefaultWriter = io.MultiWriter(f)
	// router := gin.Default()

	// router.GET("/", func(c *gin.Context) {

	// 	c.SecureJSON(http.StatusOK, gin.H{
	// 		"message":"pong",
	// 	})
	// })


	// //get list of bible versions
	// //get list of books
	// //get list of chapters
	// //get range of verses
	// 	//limit to # of verses

	// router.POST("/verse/add", func(c *gin.Context) {
	// 	bible_name := c.PostForm("bible_name")
	// 	book_name := c.PostForm("book_name")
	// 	chapter_num := c.PostForm("chapter_num")
	// 	verse_num := c.PostForm("verse_num")
	// 	verse_text := c.PostForm("verse_text")

		

	// })
	// router.POST("/verse/update", func(c *gin.Context) {
	// 	name := c.PostForm("name")
	// 	fmt.Println(name)
	// })
	// router.POST("/verse/delete", func(c *gin.Context) {
	// 	name := c.PostForm("name")
	// 	fmt.Println(name)
	// })

	// err = router.Run(os.Getenv("URL") + ":" + os.Getenv("PORT"))
	// if err != nil {
	// 	panic(err)
	// }
}
