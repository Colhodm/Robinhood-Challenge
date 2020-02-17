package middleware

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
    "reflect"
	"go-to-do-app/server/models"
    "github.com/gorilla/mux"
    "time"
    "github.com/google/uuid"
    "golang.org/x/crypto/bcrypt"
    "go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
    "github.com/gomodule/redigo/redis"
	"io/ioutil"
	"os"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/sheets/v4"
    "net/smtp"
)

// DB connection string
// const connectionString = "mongodb://localhost:27017"
const connectionString = "mongodb+srv://arjun:mishra@cluster0-9jlvf.mongodb.net/admin?retryWrites=true&w=majority"

// Database Name
const dbName = "test"

// Collection name
const collName = "users"
const emailColName = "emails"
const bundlesCollName = "bundles"

// collection object/instance
var collection *mongo.Collection
var emailCollection *mongo.Collection
var bundleCollection *mongo.Collection
var cache redis.Conn
var  srv *sheets.Service
// smtpServer data to smtp server
type smtpServer struct {
 host string
 port string
}
// Address URI to smtp server
func (s *smtpServer) Address() string {
 return s.host + ":" + s.port
} 
func initCache() {
    // Initialize the redis connection to a redis instance running on your local machine
    conn, err := redis.DialURL("redis://localhost")
    if err != nil {
        panic(err)
    }
    // Assign the connection to the package level `cache` variable
    cache = conn
}
// Retrieve a token, saves the token, then returns the generated client.
func getClient(config *oauth2.Config) *http.Client {
        // The file token.json stores the user's access and refresh tokens, and is
        // created automatically when the authorization flow completes for the first
        // time.
        tokFile := "token.json"
        tok, err := tokenFromFile(tokFile)
        if err != nil {
                tok = getTokenFromWeb(config)
                saveToken(tokFile, tok)
        }
        return config.Client(context.Background(), tok)
}
// Request a token from the web, then returns the retrieved token.
func getTokenFromWeb(config *oauth2.Config) *oauth2.Token {
        authURL := config.AuthCodeURL("state-token", oauth2.AccessTypeOffline)
        fmt.Printf("Go to the following link in your browser then type the "+
                "authorization code: \n%v\n", authURL)

        var authCode string
        if _, err := fmt.Scan(&authCode); err != nil {
                log.Fatalf("Unable to read authorization code: %v", err)
        }

        tok, err := config.Exchange(context.TODO(), authCode)
        if err != nil {
                log.Fatalf("Unable to retrieve token from web: %v", err)
        }
        return tok
}
// Retrieves a token from a local file.
func tokenFromFile(file string) (*oauth2.Token, error) {
        f, err := os.Open(file)
        if err != nil {
                return nil, err
        }
        defer f.Close()
        tok := &oauth2.Token{}
        err = json.NewDecoder(f).Decode(tok)
        return tok, err
}
// Saves a token to a file path.
func saveToken(path string, token *oauth2.Token) {
        fmt.Printf("Saving credential file to: %s\n", path)
        f, err := os.OpenFile(path, os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0600)
        if err != nil {
                log.Fatalf("Unable to cache oauth token: %v", err)
        }
        defer f.Close()
        json.NewEncoder(f).Encode(token)
}

func Bundles(w http.ResponseWriter, r *http.Request) {
	  // Prints the names and majors of students in a sample spreadsheet:
        // https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
        w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
        w.Header().Set("Access-Control-Allow-Credentials", "true")
        fmt.Println("Routed.")
        spreadsheetId := "1MnZd3zfxfq0pA1UeZ7Jv-7XsI4lDaCCgUqSxSeBbf8U"
        readRange := "A2:N4"
        resp, err := srv.Spreadsheets.Values.Get(spreadsheetId, readRange).Do()
        if err != nil {
                log.Fatalf("Unable to retrieve data from sheet: %v", err)
        }

        if len(resp.Values) == 0 {
                fmt.Println("No data found.")
        } else {
                fmt.Println("Bundle Printed")
                bundles := make([]models.Bundle, len(resp.Values))
                for index, row := range resp.Values {
                        // Print columns A and E, which correspond to indices 0 and 4.
                        fmt.Println(row)
                        var bundle models.Bundle
                        bundle.Name = row[0].(string) 
                        bundle.Price = row[1].(string)
                        bundle.Traits =  []string{row[2].(string), row[3].(string), row[4].(string)}
                        bundle.Location = row[5].(string)
                        bundle.Owner = row[6].(string)
                        bundle.Date = row[7].(string)
                        bundle.ItemCost = row[8].(string)
                        bundle.ShipCost = row[9].(string)
                        bundle.PreTax = row[10].(string)
                        bundle.GST = row[11].(string)
                        bundle.PST = row[12].(string)
                        bundle.Saving = row[13].(string)
                        bundles[index] = bundle
                }
                fmt.Println(json.NewEncoder(w).Encode(bundles))
        }
}
func initGoogleSheets() {
// this function deals with google sheets intialization
        b, err := ioutil.ReadFile("credentials.json")
        if err != nil {
                log.Fatalf("Unable to read client secret file: %v", err)
        }
        // If modifying these scopes, delete your previously saved token.json.
        config, err := google.ConfigFromJSON(b, "https://www.googleapis.com/auth/spreadsheets.readonly")
        if err != nil {
                log.Fatalf("Unable to parse client secret file to config: %v", err)
        }
        client := getClient(config)

        srv, err = sheets.New(client)
        if err != nil {
                log.Fatalf("Unable to retrieve Sheets client: %v", err)
        }
}
// create connection with mongo db
func init() {
	initGoogleSheets() 
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

	collection = client.Database(dbName).Collection(collName)
	emailCollection = client.Database(dbName).Collection(emailColName)
    bundleCollection = client.Database(dbName).Collection(bundlesCollName)

	fmt.Println("Collection instance created!")
}
func AuthMiddle(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    log.Println("Executing Auth")
   // We can obtain the session token from the requests cookies, which come with every request
       c, err := r.Cookie("session_token")
       if err != nil {
           if err == http.ErrNoCookie {
               // If the cookie is not set, return an unauthorized status
               log.Println(err)
               w.WriteHeader(http.StatusUnauthorized)
               return
           }
           // For any other type of error, return a bad request status
           w.WriteHeader(http.StatusUnauthorized)
           return
       }
       sessionToken := c.Value
       // We then get the name of the user from our cache, where we set the session token
       response, err := cache.Do("GET", sessionToken)
       if err != nil {
           // If there is an error fetching from cache, return an internal server error status
           w.WriteHeader(http.StatusInternalServerError)
           return
       }
       if response == nil {
           // If the session token is not present in cache, return an unauthorized error
           w.WriteHeader(http.StatusUnauthorized)
           return
                   }
        ctx := context.WithValue(r.Context(), "user_id", response)
        next.ServeHTTP(w, r.WithContext(ctx))
        fmt.Println(string(response.([]uint8)),"CACHE ACCESS")
        log.Println("Finishing Auth")
    })

}
func GetBundle(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
    // TODO later we will build some filtering on server side which is why we have this
    fetched := getAllBundles()
	//TODO loop through mongo and convert them to our json for safety?
    if (fetched == nil){
        fmt.Println(6)
    }
    //TODO add logic to hash the password and give the user some unique token so we ensure hes logged in
	fmt.Println("Fetched the card")
	json.NewEncoder(w).Encode(fetched)
}
func Order(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
        w.Header().Set("Access-Control-Allow-Credentials", "true")
        fmt.Println("Routed.")
        spreadsheetId := "1MnZd3zfxfq0pA1UeZ7Jv-7XsI4lDaCCgUqSxSeBbf8U"
        readRange := "Orders!A2:G4"
        resp, err := srv.Spreadsheets.Values.Get(spreadsheetId, readRange).Do()
        if err != nil {
                log.Fatalf("Unable to retrieve data from sheet: %v", err)
        }

        if len(resp.Values) == 0 {
                fmt.Println("No data found.")
        } else {
                fmt.Println("Order Printed")
                var orders [3] models.Order
                for index, row := range resp.Values {
                        // Print columns A and E, which correspond to indices 0 and 4.
                        if len(row) != 7{
                            fmt.Println("Error")
                            continue
                            // THROW Error
                        }
                        fmt.Printf("%s\n", row)
                        var order models.Order
                        order.Name = row[0].(string) 
                        order.Total = row[1].(string)
                        order.Date = row[2].(string)
                        order.Location = row[3].(string)
                        order.Buyer =  row[4].(string)
                        order.Seller = row[5].(string)
                        order.Status = row[6].(string)
                        orders[index] = order 
                }
                fmt.Println(json.NewEncoder(w).Encode(orders))
        }
    }
func Login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
    w.Header().Set("Access-Control-Allow-Credentials", "true")
    //w.Header().Set("Access-Control-Allow-Origin", "http://localhost:8080/api/login")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	//w.Header().Set("Access-Control-Allow-Credentials", "true")
	var user models.User
    err := json.NewDecoder(r.Body).Decode(&user)
    if err != nil{
        fmt.Println(err)
    }
     fetched,err := findOneUser(user)
     if (err != nil){
	    http.Redirect(w, r,"http://35.233.168.169:3000" , http.StatusSeeOther)
	    fmt.Println("Error0")
        w.WriteHeader(http.StatusForbidden)
        w.Write([]byte("500 - Something bad happened!"))
        return
    }
    //var temp models.User
    //TODO extract the password from fetched
    //fetched[3].Value
    if (len(fetched) < 3){
	    fmt.Println("Error1")
        w.WriteHeader(http.StatusUnauthorized)
        return
    }
    fmt.Println("FETCHED SUCCESFULLY",fetched)
    password := []byte(fmt.Sprintf("%v", fetched[3].Value.(interface{})))
    if err = bcrypt.CompareHashAndPassword(password, []byte(user.Password)); err != nil {
        // If the two passwords don't match, return a 401 status
	    fmt.Println("Error1")
        w.WriteHeader(http.StatusUnauthorized)
        return
    }
    // FROM tutorial at https://www.sohamkamani.com/blog/2018/03/25/golang-session-authentication/
    // Create a new random session token
    sessionToken := uuid.Must(uuid.NewRandom()).String()
    // Set the token in the cache, along with the user whom it represents
    // The token has an expiry time of 120 seconds
    //fetched[0] has the id of the user we just validated
    _, err = cache.Do("SETEX", sessionToken, "1200", fetched[0].Value.(primitive.ObjectID).Hex())
    if err != nil {
        // If there is an error in setting the cache, return an internal server error
	    fmt.Println("Error2")
        w.WriteHeader(http.StatusInternalServerError)
        return
    }
    // Finally, we set the client cookie for "session_token" as the session token we just generated
    // we also set an expiry time of 120 seconds, the same as the cache
    http.SetCookie(w, &http.Cookie{
        Name:    "session_token",
        Value:   sessionToken,
        HttpOnly: false,
        Path: "/",
        Expires: time.Now().Add(1200 * time.Second),
    })
    //TODO add logic to hash the password and give the user some unique token so we ensure hes logged in
	fmt.Println("Login User to Lumber",sessionToken,user.ID)
    w.WriteHeader(http.StatusOK)
    //http.Redirect(w, r, "/", http.StatusFound)
    //json.NewEncoder(w).Encode(fetched)
}
// Create create task route
func AddEmail(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
    var user models.Email
    err := json.NewDecoder(r.Body).Decode(&user)
    if err != nil{
        fmt.Println(err)
    }
     fmt.Println(6,user, r.Body)
	insertOneEmail(user)
    //TODO add logic to hash the password and give the user some unique token so we ensure hes logged in
	fmt.Println("User joined now")
	json.NewEncoder(w).Encode(user)
}

// Create create task route
func AddUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	fmt.Println(3)
    var user models.User
    err := json.NewDecoder(r.Body).Decode(&user)
	fmt.Println(user.Lumber)
    if err != nil{
        fmt.Println(err)
    }
    _,err = findOneUser(user)
    if (err == nil){
        w.WriteHeader(http.StatusUnauthorized)
        fmt.Println(err)
        return
    }
    fmt.Println(user, r.Body)
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 8)
	user.Password = string(hashedPassword)
    insertOneUser(user)
    //TODO add logic to hash the password and give the user some unique token so we ensure hes logged in
	fmt.Println("Creating User")
	json.NewEncoder(w).Encode(user)
}
func GetAddress(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
    w.Header().Set("Access-Control-Allow-Credentials", "true")
    w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
    w.Header().Set("Access-Control-Allow-Methods", "GET")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
    user_id := string(r.Context().Value("user_id").([]uint8))
    result,err := findUserByID(user_id)
    if (err != nil){
        w.WriteHeader(http.StatusUnauthorized)
        fmt.Println(err)
        return
    }
    fmt.Println(result[len(result)-1].Value)
    // we also want to update our users addresses if we need to
    json.NewEncoder(w).Encode(result[len(result)-1].Value)
}
func DoCheckout(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
    w.Header().Set("Access-Control-Allow-Credentials", "true")
    w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
    w.Header().Set("Access-Control-Allow-Methods", "POST")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
    user_id := string(r.Context().Value("user_id").([]uint8))
    result,err := findUserByID(user_id)
    if (err != nil){
        w.WriteHeader(http.StatusUnauthorized)
        fmt.Println(err)
        return
    }
    // we also want to update our users addresses if we need to
    var addy models.Address
    err = json.NewDecoder(r.Body).Decode(&addy)
    if (err != nil){
        w.WriteHeader(http.StatusUnauthorized)
        fmt.Println(err)
        return
    }
    err = updateUserAddress(user_id,addy)
    if (err != nil){
        w.WriteHeader(http.StatusUnauthorized)
        fmt.Println(err)
        return
    }
    fmt.Println(result)
    email := result[1].Value.(string)
	// Sender data.
    // TODO 
	from := "colhodm@gmail.com"
    password := "foolishidiot"
	// smtp server configuration.^
	smtpServer := smtpServer{host: "smtp.gmail.com", port: "587"}
 // Message.
    message := []byte("This is a really unimaginative message, I know.")
    auth := smtp.PlainAuth("", from, password, smtpServer.host)
	// Receiver email address.
    to := []string{
        email,
    }
 // Sending email.
    err = smtp.SendMail(smtpServer.Address(), auth, from, to, message)
    if err != nil {
        fmt.Println(err)
        return
    }
    fmt.Println("Email Sent!")    
	json.NewEncoder(w).Encode(result)

}
func UpdateProfile(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
    w.Header().Set("Access-Control-Allow-Credentials", "true")
    w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
    w.Header().Set("Access-Control-Allow-Methods", "POST")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
    user_id := string(r.Context().Value("user_id").([]uint8))
    // We first need to fetch the current user_record to validate the password

    // Then we can update the current_user record
    var user models.User
    err := json.NewDecoder(r.Body).Decode(&user)
    fmt.Println(3333333,user.Lumber)
    result,err := updateProfileUser(user,user_id)
    if (err != nil){
	    http.Redirect(w, r,"http://35.233.168.169:3000" , http.StatusSeeOther)
	    fmt.Println("Error0")
        w.WriteHeader(http.StatusForbidden)
        w.Write([]byte("500 - Something bad happened!"))
        return
    }
    json.NewEncoder(w).Encode(result)

}
func GetProfile(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
    w.Header().Set("Access-Control-Allow-Credentials", "true")
    w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
    w.Header().Set("Access-Control-Allow-Methods", "GET")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
    user_id := string(r.Context().Value("user_id").([]uint8))
    result,err := fetchProfileUser(user_id)
    if (err != nil){
	    http.Redirect(w, r,"http://35.233.168.169:3000" , http.StatusSeeOther)
	    fmt.Println("Error0")
        w.WriteHeader(http.StatusForbidden)
        w.Write([]byte("500 - Something bad happened!"))
        return
    }
    json.NewEncoder(w).Encode(result)

}
// TaskComplete update task route
func TaskComplete(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "PUT")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	params := mux.Vars(r)
	taskComplete(params["id"])
	json.NewEncoder(w).Encode(params["id"])
}

// UndoTask undo the complete task route
func UndoTask(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "PUT")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	params := mux.Vars(r)
	undoTask(params["id"])
	json.NewEncoder(w).Encode(params["id"])
}

// DeleteTask delete one task route
func DeleteTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	params := mux.Vars(r)
	deleteOneCar(params["id"])
	json.NewEncoder(w).Encode(params["id"])
	// json.NewEncoder(w).Encode("Task not found")

}
func fetchProfileUser(user_id string) (primitive.D,error) {
    result := bson.D{}
    id, err := primitive.ObjectIDFromHex(user_id)
    if err != nil {
                fmt.Println("ObjectIDFromHex ERROR", err)
    }
    query := &bson.M{"_id": id}
    err = collection.FindOne(context.Background(), query).Decode(&result)
	if err != nil {
        fmt.Println(err)
        return result,err
        //log.Fatal(err)
	}
	fmt.Println("Found a Single User Profile Woot Woot", result)
    return result,nil
}
func updateUserAddress(user_id string, address models.Address) (error) {
    result := bson.D{}
    id, err := primitive.ObjectIDFromHex(user_id)
    if err != nil {
        fmt.Println(err)
        return err
    }
    filter := bson.M{"_id": id}
    update := bson.M{"$set": bson.M{"address": address}}
    _, err = collection.UpdateOne(
        context.Background(),
        filter,
        update,
    )
    if err != nil {
        fmt.Println(err)
        return err
        //log.Fatal(err)
	}
	fmt.Println("Updated a Single User Address  Woot Woot", result)
    return nil
}
func updateProfileUser(userData models.User,user_id string) (primitive.D,error) {
    result := bson.D{}
    id, err := primitive.ObjectIDFromHex(user_id)
    if err != nil {
                fmt.Println("ObjectIDFromHex ERROR", err)
    }
    filter := bson.M{"_id": id}
    update := bson.M{"$set": bson.M{"lumber": userData.Lumber,"length": userData.Length}}
    _, err = collection.UpdateOne(
        context.Background(),
        filter,
        update,
    )
    if err != nil {
        fmt.Println(err)
        return result,err
        //log.Fatal(err)
	}
	fmt.Println("Updated a Single User Profile Woot Woot", result)
    return result,nil
}

// DeleteAllTask delete all tasks route
func DeleteAllTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	count := deleteAllTask()
	json.NewEncoder(w).Encode(count)
	// json.NewEncoder(w).Encode("Task not found")

}
// get all cars from the DB and return them
func getMyOrders() []primitive.M {
    // How do we fetch data about our current user? to get his current order_ids
    // TODO figure out by looking at the docs
    // Prior to fetching the orders from the orders collections we get the proper query_ids
    cur, err := bundleCollection.Find(context.Background(), bson.D{{}})
	if err != nil {
		log.Fatal(err)
	}

	var results []primitive.M
	for cur.Next(context.Background()) {
		var result bson.M
		e := cur.Decode(&result)
		if e != nil {
			log.Fatal(e)
		}
		fmt.Println("cur..>", cur, "result", reflect.TypeOf(result), reflect.TypeOf(result["_id"]))
		results = append(results, result)
	}

	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}
	fmt.Println("private method got called to fetch drivers")
	cur.Close(context.Background())
	return results
}

// get all cars from the DB and return them
func getAllBundles() []primitive.M {
    cur, err := bundleCollection.Find(context.Background(), bson.D{{}})
	if err != nil {
		log.Fatal(err)
	}

	var results []primitive.M
	for cur.Next(context.Background()) {
		var result bson.M
		e := cur.Decode(&result)
		if e != nil {
			log.Fatal(e)
		}
		fmt.Println("cur..>", cur, "result", reflect.TypeOf(result), reflect.TypeOf(result["_id"]))
		results = append(results, result)
	}

	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}
	fmt.Println("private method got called to fetch drivers")
	cur.Close(context.Background())
	return results
}
func findUserByID(user_id string)(primitive.D,error) {
	id, err := primitive.ObjectIDFromHex(user_id)
    if (err != nil){
        fmt.Println(err)
        return nil,err
    }
    result := bson.D{}
    query := &bson.M{"_id": id} 
    err = collection.FindOne(context.Background(), query).Decode(&result)
	if err != nil {
		return result,err
        //log.Fatal(err)
	}
    //TODO we might need check to ensure that a username is unique when you register
	fmt.Println("Found a Single User", result)
    return result,nil
}

func findOneUser(user models.User)(primitive.D,error) {
    result := bson.D{}
    query := &bson.M{"email": user.Email} 
    err := collection.FindOne(context.Background(), query).Decode(&result)
	if err != nil {
		return result,err
        //log.Fatal(err)
	}
    //TODO we might need check to ensure that a username is unique when you register
	fmt.Println("Found a Single User", result)
    return result,nil
}
// Insert one task in the DB
func insertOneEmail(user models.Email) {
	fmt.Println(user)
    insertResult, err := emailCollection.InsertOne(context.Background(), user)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Inserted a Single Email", insertResult.InsertedID)
}
// Insert one task in the DB
func insertOneUser(user models.User) {
	fmt.Println(user)
    insertResult, err := collection.InsertOne(context.Background(), user)

	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Inserted a Single User", insertResult.InsertedID)
}
// task complete method, update task's status to true
func taskComplete(task string) {
	fmt.Println(task)
	id, _ := primitive.ObjectIDFromHex(task)
	filter := bson.M{"_id": id}
	update := bson.M{"$set": bson.M{"status": true}}
	result, err := collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("modified count: ", result.ModifiedCount)
}

// task undo method, update task's status to false
func undoTask(task string) {
	fmt.Println(task)
	id, _ := primitive.ObjectIDFromHex(task)
	filter := bson.M{"_id": id}
	update := bson.M{"$set": bson.M{"status": false}}
	result, err := collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("modified count: ", result.ModifiedCount)
}

// delete one task from the DB, delete by ID
func deleteOneCar(car string) {
	fmt.Println(car)
	id, _ := primitive.ObjectIDFromHex(car)
	filter := bson.M{"_id": id}
	d, err := collection.DeleteOne(context.Background(), filter)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Deleted Document", d.DeletedCount)
}

// delete all the tasks from the DB
func deleteAllTask() int64 {
	d, err := collection.DeleteMany(context.Background(), bson.D{{}}, nil)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Deleted Document", d.DeletedCount)
	return d.DeletedCount
}
