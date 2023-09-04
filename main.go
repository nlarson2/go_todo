package main

import (
    "os"
    "io"
    "fmt"
    "net/http"

    
    "github.com/joho/godotenv"
    "github.com/gin-gonic/gin"
    "github.com/nlarson2/verse_search/routes"
    _ "github.com/lib/pq"
    
)







func main() {


    err := godotenv.Load(".env")
    if err != nil {
    	panic(err)
    }

    //create log
    f, _ := os.Create("gin.log")
    
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
