package routes


import (
    "fmt"
    "strconv"
    "strings"
    "net/http"
    "encoding/json"

    "github.com/gin-gonic/gin"
	"github.com/nlarson2/verse_search/db"
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


func InitVerseRoutes(r *gin.Engine) {
	r.GET("/bibles", getAllBibles)
	r.GET("/books", getAllBooks)
	r.GET("/verse", queryVerse)
	r.POST("/verse/add", addVerse)
}


//get list of bible versions
func getAllBibles(c *gin.Context) {
	conn, err := db.ConnectDB()
    if err != nil {
	    fmt.Println("Error connecting to the database:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error connecting to the database:"})
	    return
    }
	defer conn.Close()

	rows, err := conn.Query("select * from bible_versions")
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
	conn, err := db.ConnectDB()
    if err != nil {
	    fmt.Println("Error connecting to the database:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error connecting to the database:"})
	    return
    }
	defer conn.Close()

	rows, err := conn.Query("select * from books")
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

	version := c.Query("bible")
	if version == "" {
		version = "ENGLISHESV"
	}
	book := c.Query("book")
	chapter := c.Query("chapter")
	verse := c.Query("verse")
	
	var verse_range []string

	fmt.Printf("TEST: %s %s %s %s\n", version, book, chapter, verse )
	if book == "" || chapter == "" || verse == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Not a valid request"})
		return
	}

	
	if strings.Contains(verse, "-") {
		verse_range = strings.Split(verse, "-")
		if len(verse_range) != 2 {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create JSON response"})
			return
		}
		fmt.Printf("%d\n", len(verse_range))
	}

	conn, err := db.ConnectDB()
    if err != nil {
	    fmt.Println("Error connecting to the database:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error connecting to the database:"})
	    return
    }
	defer conn.Close()

	if len(verse_range) > 1 {
		first_v, err1 := strconv.Atoi(verse_range[0])
		last_v, err2 := strconv.Atoi(verse_range[1])
		if err1 != nil || err2 != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create JSON response"})
			return
		}
		
		verse_count := last_v - first_v
		if verse_count < 0 || verse_count > 50 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Not a valid request"})
			return
		}

		rows, err := conn.Query( 
			"select * from get_range_of_verses($1, $2, $3, $4, $5)", 
			version, book, chapter, first_v, last_v, 
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		var result []struct {
			BookName      string
			ChapterNumber int
			VerseNumber   int
			Scripture     string
		}
	
		// Iterate through the result set and scan rows into the result slice
		for rows.Next() {
			var verse struct {
				BookName      string
				ChapterNumber int
				VerseNumber   int
				Scripture     string
			}
			if err := rows.Scan(
				&verse.BookName,
				&verse.ChapterNumber,
				&verse.VerseNumber,
				&verse.Scripture,
			); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			result = append(result, verse)
		}
	
		// Handle any errors that may have occurred during iteration
		if err := rows.Err(); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	
		// Return the result as JSON
		c.JSON(http.StatusOK, result)
		return


	} else {
		
		rows, err := conn.Query( 
			"select * from get_single_verse($1, $2, $3, $4)", 
			version, book, chapter, verse,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		
		var result []struct {
			BookName      string
			ChapterNumber int
			VerseNumber   int
			Scripture     string
		}	

		// Iterate through the result set and scan rows into the result slice
		for rows.Next() {
			var verse struct {
				BookName      string
				ChapterNumber int
				VerseNumber   int
				Scripture     string
			}
			if err := rows.Scan(
				&verse.BookName,
				&verse.ChapterNumber,
				&verse.VerseNumber,
				&verse.Scripture,
			); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			result = append(result, verse)
		}

		// Handle any errors that may have occurred during iteration
		if err := rows.Err(); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Return the result as JSON
		c.JSON(http.StatusOK, result)
		return

		
	}
	
	
	c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create JSON response"})
	return
	
}

func addVerse(c *gin.Context) {

	conn, err := db.ConnectDB()
    if err != nil {
	    fmt.Println("Error connecting to the database:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error connecting to the database:"})
	    return
    }
	defer conn.Close()

	bible_name := c.PostForm("bible_name")
	book_name := c.PostForm("book_name")
	chapter_num, err1 :=  strconv.Atoi(c.PostForm("chapter_num"))
	verse_num, err2 :=  strconv.Atoi(c.PostForm("verse_num"))
	verse_text := c.PostForm("verse_text")
	if err1 != nil || err2 != nil {
		panic("Could not convert to integer")
	}
	
	fmt.Printf("TEST: %s %s %d %d %s\n", bible_name, book_name, chapter_num, verse_num, verse_text )
	result, err := conn.Exec("CALL insert_verse($1, $2, $3, $4, $5)", bible_name, book_name, chapter_num, verse_num, verse_text )
	if err != nil {
		fmt.Println("Error calling stored procedure:", err)
	}
	fmt.Println(result)

}
// router.POST("/verse/update", func(c *gin.Context) {
// 	name := c.PostForm("name")
// 	fmt.Println(name)
// })
// router.POST("/verse/delete", func(c *gin.Context) {
// 	name := c.PostForm("name")
// 	fmt.Println(name)
// })




