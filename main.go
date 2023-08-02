package main

import (
	"os"
	"io"
	"fmt"
	"net/http"
	"github.com/joho/godotenv"
	"github.com/gin-gonic/gin"
)



func main() {
	//create log
	f, _ := os.Create("gin.log")
	err := godotenv.Load(".env")
	if err != nil {
		panic(err)
	}

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
		//limit to # of versesi


	//post bible
	router.POST("/bible", func(c *gin.Context) {
		name := c.PostForm("name")
		fmt.Println(name)
	})
	//post book
	//post chapter
	//post verse

	err = router.Run(os.Getenv("URL") + ":" + os.Getenv("PORT"))
	if err != nil {
		panic(err)
	}
}
