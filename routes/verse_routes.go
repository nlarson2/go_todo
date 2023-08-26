package routes


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
    _ "github.com/lib/pq"
    
)

funct InitVerseRoutes(r *gin.Engine) {
	verseGroup := r.Group("/verse")
	{
		verseGroup.GET("/bibles", getAllBibles)
		verseGroup.GET("/books", getAllBooks)
		verseGroup.GET("/verse/:version/:book/:chapter/:verse?", queryVerse)
	}
}




//get list of bible versions
func getAllBibles(c *gin.Context) {
	rows, err := db.Query("select * from bible_versions")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to execute DB operation"})
		return
	}
	defer rows.Close()
	var bibles []Bible

	// Iterate through the query results
	for rows.Next() {
		var bible Bible
		err := rows.Scan(&bible.ID, &bible.Name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan row"})
			return
		}
		bibles = append(bibles, bible)
	}

	// Convert the slice to JSON
	responseJSON, err := json.Marshal(bibles)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create JSON response"})
		return
	}

	c.Data(http.StatusOK, "application/json", responseJSON)
	
}


//get list of books
func getAllBooks(c *gin.Context) {
	rows, err := db.Query("select * from books")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to execute DB operation"})
		return
	}
	defer rows.Close()
	var books []Book
	
	// Iterate through the query results
	for rows.Next() {
		var book Book
		err := rows.Scan(&book.ID, &book.Name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan row"})
			return
		}
		books = append(books, book)
	}

	// Convert the slice to JSON
	responseJSON, err := json.Marshal(books)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create JSON response"})
		return
	}

	c.Data(http.StatusOK, "application/json", responseJSON)
	
}

//get range of verses
func queryVerse(c *gin.Context) {
	version := c.Param("version")
	book := c.Param("book")
	chapter := c.Param("chapter")
	verse := c.Param("verse")
	var values []string

	
	if strings.Contains(verse, "-") {
		values = strings.Split(verse, "-")
		if len(values) != 2 {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create JSON response"})
			return
		}
		fmt.Printf("%d\n", len(values))
	}
	
	fmt.Printf("TEST: %s %s %s %s\n", version, book, chapter, verse )
	if len(values) > 1 {
		first_id, err1 := strconv.Atoi(values[0])
		last_id, err2 := strconv.Atoi(values[1])
		if err1 != nil || err2 != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create JSON response"})
			return
		}
		fmt.Printf("%d-%d\n", first_id, last_id)
	}

	
	c.JSON(http.StatusOK, gin.H{"test": "test"})
	return

	
}

// router.POST("/verse/add", func(c *gin.Context) {
// 	bible_name := c.PostForm("bible_name")
// 	book_name := c.PostForm("book_name")
// 	chapter_num, err1 :=  strconv.Atoi(c.PostForm("chapter_num"))
// 	verse_num, err2 :=  strconv.Atoi(c.PostForm("verse_num"))
// 	verse_text := c.PostForm("verse_text")
// 	if err1 != nil || err2 != nil {
// 		panic("Could not convert to integer")
// 	}
	
// 	fmt.Printf("TEST: %s %s %d %d %s\n", bible_name, book_name, chapter_num, verse_num, verse_text )
// 	result, err := db.Exec("CALL insert_verse($1, $2, $3, $4, $5)", bible_name, book_name, chapter_num, verse_num, verse_text )
// 	if err != nil {
// 		log.Fatal("Error calling stored procedure:", err)
// 	}
// 	fmt.Println(result)

// })
// router.POST("/verse/update", func(c *gin.Context) {
// 	name := c.PostForm("name")
// 	fmt.Println(name)
// })
// router.POST("/verse/delete", func(c *gin.Context) {
// 	name := c.PostForm("name")
// 	fmt.Println(name)
// })




