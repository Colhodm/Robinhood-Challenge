package middleware

import (
	"Ozone-Dev/server/models"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"

	"github.com/gomodule/redigo/redis"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"google.golang.org/api/gmail/v1"
	"google.golang.org/api/sheets/v4"
)

// DB connection string
// const connectionString = "mongodb://localhost:27017"
const connectionString = "mongodb+srv://arjun:mishra@cluster0-9jlvf.mongodb.net/admin?retryWrites=true&w=majority"

// Database Name
const dbName = "stock"

// Collection name
const stockCollName = "stocks"

// collection object/instance
var stockCollection *mongo.Collection
var cache redis.Conn
var srv *sheets.Service
var email *gmail.Service

func initCache() {
	// Initialize the redis connection to a redis instance running on your local machine
	conn, err := redis.DialURL("redis://localhost")
	if err != nil {
		panic(err)
	}
	// Assign the connection to the package level `cache` variable
	cache = conn
}

// create connection with mongo db
func init() {
	initCache()
	// Set client options
	clientOptions := options.Client().ApplyURI(connectionString)

	// connect to MongoDB
	client, err := mongo.Connect(context.TODO(), clientOptions)

	if err != nil {
		log.Fatal(err)
	}

	// Check the connection
	err = client.Ping(context.TODO(), nil)

	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to MongoDB!")

	stockCollection = client.Database(dbName).Collection(stockCollName)

	fmt.Println("Collection instance created!")
}

// Grab all the stocks last price
func Watch(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "http://35.227.147.196:3000")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	updateCount()
	var performance_id models.Stocks
	err := json.NewDecoder(r.Body).Decode(&performance_id)
	if err != nil {
		//fmt.Println(err)
	}
	metadata := getWatch()
	for _, ch := range metadata {
		tmp := ch["Price"].(primitive.A)
		ch["Price"] = tmp[len(tmp)-1]
	}
	json.NewEncoder(w).Encode(metadata)
}

//Handler function to grab the history of a stock
func WatchStock(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "http://35.227.147.196:3000")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	updateCount()
	var performance_id models.Name
	err := json.NewDecoder(r.Body).Decode(&performance_id)
	if err != nil {
		//fmt.Println(err)
	}
	metadata := getStock(performance_id).Map()["Price"]
	json.NewEncoder(w).Encode(metadata)
}
func getStock(performance_id models.Name) primitive.D {
	result := bson.D{}
	query := &bson.M{"Name": performance_id.Stock}
	err := stockCollection.FindOne(context.Background(), query).Decode(&result)
	if err != nil {
		fmt.Println("Werd ERROR", err)
		return nil
	}
	return result
}

// get all Stocks from the DB and return them
func getWatch() []primitive.M {
	projectQuery := bson.M{}
	cur, err := stockCollection.Find(context.Background(), projectQuery)
	if err != nil {
		fmt.Println(err)
	}
	var projectResults []primitive.M
	for cur.Next(context.Background()) {
		var temp bson.M
		e := cur.Decode(&temp)
		if e != nil {
		}
		projectResults = append(projectResults, temp)
	}

	if err := cur.Err(); err != nil {
	}
	cur.Close(context.Background())
	return projectResults
}

// Generate a new random price, we need to equalize rate of negative & positive occurances +
func generatePrice(basePrice float32) float32 {
	tmp := rand.Intn(1000)
	if tmp < 500 {
		tmp = tmp * -1
	} else {
		tmp = tmp - 500
	}
	conv := float32(tmp)/10000*basePrice + basePrice
	return conv
}

// Update DB with new prices
func updateCount() error {
	tmp := rand.Intn(10)
	if tmp%5 != 0 {
		return nil
	}
	generatedTSLAPrice := generatePrice(1208.66)
	generatedGOOGLPrice := generatePrice(1469.93)
	generatedCOPPrice := generatePrice(41.78)
	generatedBOXPrice := generatePrice(20.68)
	generatedAAPLPrice := generatePrice(364.11)

	filter := bson.M{"Name": "TSLA"}
	update := bson.M{"$push": bson.M{"Price": generatedTSLAPrice}}
	_, _ = stockCollection.UpdateOne(
		context.Background(),
		filter,
		update,
	)
	filter = bson.M{"Name": "GOOGL"}
	update = bson.M{"$push": bson.M{"Price": generatedGOOGLPrice}}
	_, _ = stockCollection.UpdateOne(
		context.Background(),
		filter,
		update,
	)
	filter = bson.M{"Name": "AAPL"}
	update = bson.M{"$push": bson.M{"Price": generatedAAPLPrice}}
	_, _ = stockCollection.UpdateOne(
		context.Background(),
		filter,
		update,
	)
	filter = bson.M{"Name": "COP"}
	update = bson.M{"$push": bson.M{"Price": generatedCOPPrice}}
	_, _ = stockCollection.UpdateOne(
		context.Background(),
		filter,
		update,
	)
	filter = bson.M{"Name": "BOX"}
	update = bson.M{"$push": bson.M{"Price": generatedBOXPrice}}
	_, _ = stockCollection.UpdateOne(
		context.Background(),
		filter,
		update,
	)
	return nil
}
