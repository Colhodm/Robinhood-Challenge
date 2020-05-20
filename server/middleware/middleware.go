package middleware

import (
	"Ozone-Dev/server/models"
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"reflect"
	"time"

	"github.com/gomodule/redigo/redis"
	"github.com/google/uuid"
	"github.com/tealeg/xlsx"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/gmail/v1"
	"google.golang.org/api/sheets/v4"
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
const entryCollName = "entries"
const customerCollName = "customer"

// collection object/instance
var collection *mongo.Collection
var entryCollection *mongo.Collection
var emailCollection *mongo.Collection
var bundleCollection *mongo.Collection
var customerCollection *mongo.Collection
var cache redis.Conn
var srv *sheets.Service
var email *gmail.Service

// smtpServer data to smtp server
type smtpServer struct {
	host string
	port string
}

// holds a data entry for a given 2x4 term
type size struct {
	lengths []length
}

// holds a data entry for a given length
type length struct {
	length string
	tally  int
	USD    int
	CDN    int
}

var globRow int
var globCol int

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
	w.Header().Set("Access-Control-Allow-Origin", "http://35.227.147.196:3000")

	w.Header().Set("Access-Control-Allow-Credentials", "true")
	fmt.Println("Routed.")
	spreadsheetId := "1lPOGUVrbVUc0W2gdXbG7DdFSgBiSMvIZbz9vhOloxfA"
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
			bundle.Traits = []string{row[2].(string), row[3].(string), row[4].(string)}
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
	config, err := google.ConfigFromJSON(b, "https://www.googleapis.com/auth/spreadsheets.readonly"+" "+gmail.GmailComposeScope)
	if err != nil {
		log.Fatalf("Unable to parse client secret file to config: %v", err)
	}
	client := getClient(config)
	email, err = gmail.New(client)
	if err != nil {
		log.Fatalf("Unable to retrieve Gmail client: %v", err)
	}

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
	entryCollection = client.Database(dbName).Collection(entryCollName)
	customerCollection = client.Database(dbName).Collection(customerCollName)
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
		fmt.Println(string(response.([]uint8)), "CACHE ACCESS")
		log.Println("Finishing Auth")
	})

}
func GetBundle(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	// TODO later we will build some filtering on server side which is why we have this
	fetched := getAllBundles()
	//TODO loop through mongo and convert them to our json for safety?
	if fetched == nil {
		fmt.Println(6)
	}
	//TODO add logic to hash the password and give the user some unique token so we ensure hes logged in
	fmt.Println("Fetched the card")
	json.NewEncoder(w).Encode(fetched)
}
func Order(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "https://www.lumberio.com")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	fmt.Println("Routed.")
	spreadsheetId := "1lPOGUVrbVUc0W2gdXbG7DdFSgBiSMvIZbz9vhOloxfA"
	readRange := "Orders!A2:H"
	resp, err := srv.Spreadsheets.Values.Get(spreadsheetId, readRange).Do()
	if err != nil {
		log.Fatalf("Unable to retrieve data from sheet: %v", err)
	}
	user_id := string(r.Context().Value("user_id").([]uint8))
	result, err := findUserByID(user_id)
	if err != nil {
		log.Fatalf("Unable to retrieve data from mongo: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
	}
	fmt.Println(result[1].Value)
	fetchedemail := result[1].Value
	fmt.Println(688888, fetchedemail)
	if len(resp.Values) == 0 {
		fmt.Println("No data found.")
	} else {
		fmt.Println("Order Printed")
		orders := make([]models.Order, len(resp.Values))
		for index, row := range resp.Values {
			// Print columns A and E, which correspond to indices 0 and 4.
			fmt.Println(row)
			if len(row) != 8 {
				fmt.Println("Error")
				continue
				// THROW Error
			}
			temp_email := row[7].(string)
			if temp_email != fetchedemail {
				continue
			}
			var order models.Order
			order.Name = row[0].(string)
			order.Total = row[1].(string)
			order.Date = row[2].(string)
			order.Location = row[3].(string)
			order.Buyer = row[4].(string)
			order.Seller = row[5].(string)
			order.Status = row[6].(string)
			orders[index] = order
		}
		fmt.Println(json.NewEncoder(w).Encode(orders))
	}
}
func Login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "http://35.227.147.196:3000")
	//w.Header().Set("Access-Control-Allow-Origin", "https://lumberio.com")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	//w.Header().Set("Access-Control-Allow-Origin", "http://localhost:8080/api/login")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	//w.Header().Set("Access-Control-Allow-Credentials", "true")
	var user models.User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		fmt.Println(err)
	}
	fetched, err := findOneUser(user)
	if err != nil {
		fmt.Println("Error0", err)
		w.WriteHeader(http.StatusForbidden)
		w.Write([]byte("500 - Something bad happened!"))
		return
	}
	//var temp models.User
	//TODO extract the password from fetched
	//fetched[3].Value
	if len(fetched) < 3 {
		fmt.Println("Error1")
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	fmt.Println("FETCHED SUCCESFULLY", fetched)
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
	_, err = cache.Do("SETEX", sessionToken, "3600", fetched[0].Value.(primitive.ObjectID).Hex())
	if err != nil {
		// If there is an error in setting the cache, return an internal server error
		fmt.Println("Error2")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	// Finally, we set the client cookie for "session_token" as the session token we just generated
	// we also set an expiry time of 120 seconds, the same as the cache
	http.SetCookie(w, &http.Cookie{
		Name:     "session_token",
		Value:    sessionToken,
		HttpOnly: false,
		Path:     "/",
		Expires:  time.Now().Add(1200 * time.Second),
	})
	//TODO add logic to hash the password and give the user some unique token so we ensure hes logged in
	fmt.Println("Login User to Lumber", sessionToken, user.ID)
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
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(6, user, r.Body)
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
	if err != nil {
		fmt.Println(err)
	}
	_, err = findOneUser(user)
	if err == nil {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Println(err)
		return
	}
	fmt.Println(user, r.Body)
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 8)
	user.Password = string(hashedPassword)
	insertOneUser(user)
	var message gmail.Message
	messageStr := []byte(
		"From: hello@lumberio.com\r\n" + "To: " + user.Email + "\r\n" + "Subject: Welcome from Lumber.io\r\n\r\n" + "We have received a Lumber Bundle Order from you. We will reach out promptly to determine payment and logistics. ")
	message.Raw = base64.URLEncoding.EncodeToString(messageStr)
	_, err = email.Users.Messages.Send("me", &message).Do()
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Println(err)
		return
	}
	//TODO add logic to hash the password and give the user some unique token so we ensure hes logged in
	fmt.Println("Creating User")
	json.NewEncoder(w).Encode(user)
}
func GetAddress(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://35.227.147.196:3000")

	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	user_id := string(r.Context().Value("user_id").([]uint8))
	result, err := findUserByID(user_id)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Println(err)
		return
	}
	if result[len(result)-1].Key != "address" {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Println("schema error")
		return
	}
	fmt.Println(result[len(result)-1].Value, 9999999999, result[len(result)-1].Key)
	// we also want to update our users addresses if we need to
	json.NewEncoder(w).Encode(result[len(result)-1].Value)
}
func AddCustomer(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	fmt.Println(3)
	var customer models.Customer
	err := json.NewDecoder(r.Body).Decode(&customer)
	if err != nil {
		fmt.Println(err)
	}
	insertOneCustomer(customer)
	fmt.Println("Creating Customer")
	json.NewEncoder(w).Encode(customer)
}
func GetCustomers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	customers := getCustomers()
	fmt.Println("Creating Customers", customers)
	json.NewEncoder(w).Encode(customers)
}
func GetEmails(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	customers := getEmails()
	fmt.Println("Getting emails", customers)
	json.NewEncoder(w).Encode(customers)
}
func DoCheckout(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "https://www.lumberio.com")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	user_id := string(r.Context().Value("user_id").([]uint8))
	result, err := findUserByID(user_id)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Println(err)
		return
	}
	// we also want to update our users addresses if we need to
	var checkout models.Checkout
	err = json.NewDecoder(r.Body).Decode(&checkout)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	fmt.Println(3333333, checkout.Addy, checkout.Bundle)
	err = updateUserAddress(user_id, checkout.Addy)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	fmt.Println(result)
	tempEmail := result[1].Value.(string)
	var message gmail.Message
	messageStr := []byte(
		"From: hello@lumberio.com\r\n" +
			"To: " + tempEmail + "\r\n" +
			"Subject: Checkout from Lumber.io\r\n\r\n" +
			"You checked out from Lumber.io! You purchased a " + checkout.Bundle["type"].(string) + " from " + checkout.Bundle["owner"].(string) + " for a price of " + checkout.Bundle["price"].(string) + ". Please enjoy the other bundles we have on offer!" + " We are shipping it to " + checkout.Addy.Unit + " " + checkout.Addy.Street + " " + checkout.Addy.City + " " + checkout.Addy.State + ". If needed, we can reach you at " + checkout.Addy.Phone)
	message.Raw = base64.URLEncoding.EncodeToString(messageStr)
	_, err = email.Users.Messages.Send("me", &message).Do()
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	fmt.Println("Email Sent!")
	w.WriteHeader(http.StatusOK)

}
func UpdateProfile(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://35.227.147.196:3000")

	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	user_id := string(r.Context().Value("user_id").([]uint8))
	// We first need to fetch the current user_record to validate the password

	// Then we can update the current_user record
	var user models.User
	err := json.NewDecoder(r.Body).Decode(&user)
	fmt.Println(3333333, user.Lumber, user.Length)
	result, err := updateProfileUser(user, user_id)
	if err != nil {
		http.Redirect(w, r, "http://35.233.168.169:3000", http.StatusSeeOther)
		fmt.Println("Error0")
		w.WriteHeader(http.StatusForbidden)
		w.Write([]byte("500 - Something bad happened!"))
		return
	}
	json.NewEncoder(w).Encode(result)

}
func GetProfile(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://35.227.147.196:3000")

	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	user_id := string(r.Context().Value("user_id").([]uint8))
	result, err := fetchProfileUser(user_id)
	if err != nil {
		http.Redirect(w, r, "http://35.233.168.169:3000", http.StatusSeeOther)
		fmt.Println("Error0")
		w.WriteHeader(http.StatusForbidden)
		w.Write([]byte("500 - Something bad happened!"))
		return
	}
	json.NewEncoder(w).Encode(result)

}
func storeData(cell *xlsx.Cell) {
	value, _ := cell.FormattedValue()
	if cell.GetStyle().Font.Bold && value == "2&btr" {
		fmt.Println("I found a special one ", value, " at position ", globRow, globCol)
		// I now located the Header for the Type of the Lumber, now I want to populate the rest of my data
		// We can assume the column width is always 5 but sometimes we get the headers and sometimes we do not
		// We should iterate through the rows from this position untill we reach the black borderline
		tempCell, _ := cell.Row.Sheet.Cell(globRow+1, globCol+4)
		tempValue, _ := tempCell.FormattedValue()
		fmt.Println(tempValue, tempCell.GetStyle().Border)
		rowIterator := globRow
		//colIterator := globCol
		if tempValue == "Cdn$" {
			rowIterator += 2
		}
		// We are now aligned with the data portion of the entry
		//var tempSize size
	}
}
func processCell(cell *xlsx.Cell) error {
	storeData(cell)
	globCol += 1
	return nil
}
func processRow(row *xlsx.Row) error {
	row.ForEachCell(processCell)
	globRow += 1
	globCol = 0
	return nil
}
func AddProjectEntries(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://35.227.147.196:3000")
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Methods", "POST,OPTIONS,PUT")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	fmt.Println("FINISH UPLOAD TO CLOUD")
	fmt.Println(r.Body)
	var entries []models.Entry
	err := json.NewDecoder(r.Body).Decode(&entries)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	err = insertEntries(entries)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	w.WriteHeader(http.StatusOK)
}
func AddProjectFile(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://35.227.147.196:3000")
	//w.Header().Set("Access-Control-Allow-Origin", "https://lumberio.com")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Methods", "POST,OPTIONS,PUT")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	globRow = 0
	globCol = 0
	read_form, err := r.MultipartReader()
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	buf := new(bytes.Buffer)
	for {
		part, err_part := read_form.NextPart()
		if err_part == io.EOF {
			break
		}
		if part.FormName() == "file" {
			buf.ReadFrom(part)
			fmt.Println("LOOP")
		}
		fmt.Println("Creating Project Upload PART 1 XSLX")
		xlsxFile, err := xlsx.OpenBinary(buf.Bytes())
		if err != nil {
			fmt.Println(err)
			w.WriteHeader(http.StatusUnauthorized)
		}
		xlsxFile.Sheets[0].ForEachRow(processRow)
	}
	fmt.Println("FINISH UPLOAD TO CLOUD")
	w.WriteHeader(http.StatusOK)
}
func fetchProfileUser(user_id string) (primitive.D, error) {
	result := bson.D{}
	id, err := primitive.ObjectIDFromHex(user_id)
	if err != nil {
		fmt.Println("ObjectIDFromHex ERROR", err)
	}
	query := &bson.M{"_id": id}
	err = collection.FindOne(context.Background(), query).Decode(&result)
	if err != nil {
		fmt.Println(err)
		return result, err
		//log.Fatal(err)
	}
	fmt.Println("Found a Single User Profile Woot Woot", result)
	return result, nil
}
func updateUserAddress(user_id string, address models.Address) error {
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
func updateProfileUser(userData models.User, user_id string) (primitive.D, error) {
	result := bson.D{}
	id, err := primitive.ObjectIDFromHex(user_id)
	if err != nil {
		fmt.Println("ObjectIDFromHex ERROR", err)
	}
	filter := bson.M{"_id": id}
	update := bson.M{"$set": bson.M{"lumber": userData.Lumber, "length": userData.Length}}
	_, err = collection.UpdateOne(
		context.Background(),
		filter,
		update,
	)
	if err != nil {
		fmt.Println(err)
		return result, err
		//log.Fatal(err)
	}
	fmt.Println("Updated a Single User Profile Woot Woot", result)
	return result, nil
}
func getCustomers() []primitive.M {
	cur, err := customerCollection.Find(context.Background(), bson.D{{}})
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
	fmt.Println("private method got called to fetch customerss")
	cur.Close(context.Background())
	return results
}

// this function returns our entries so we can iterate through them
func getEntries() []primitive.M {
	cur, err := entryCollection.Find(context.Background(), bson.D{{}})
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
	return results
}

// GENERAL TODO we need to figure out a way to track which one we matched with so we dont need to iterate over everything again
func checkEqualData(customerData interface{}, entryData interface{}) bool {
	tempEntryDataArray := entryData.(primitive.A)
	tempCustData := customerData.(primitive.A)
	for _, datum := range tempEntryDataArray {
		tempDatum := datum.(primitive.M)
		for _, userPref := range tempCustData {
			tempUserPref := userPref.(primitive.A)
			if tempDatum["length"].(string) == tempUserPref[0].(string) || (tempDatum["length"].(string)+"'") == tempUserPref[0].(string) && tempUserPref[1].(bool) {
				return true
			}
		}
	}
	return false
}
func checkEqual(array interface{}, target interface{}) bool {
	tempArray := array.(primitive.A)
	for _, value := range tempArray {
		tempValue := value.(primitive.A)
		if tempValue[0].(string) == target.(string) && tempValue[1].(bool) {
			return true
		}
	}
	return false
}
func processEntries(filteredEntries []primitive.M) string {
	if len(filteredEntries) == 0 {
		return "Sorry none of our current entries looked like a great fit for you! We will ping you when we find a good fit."
	}
	template := "We think you will find the following entries a good fit for your business: \n"
	for _, entry := range filteredEntries {
		fmt.Println("FILTERED!!!!", entry)
		location := entry["location"].(string)
		grade := entry["grade"].(string)
		size := entry["size"].(string)
		// TODO doesnt work we cant convert data which is an array to a string
		data := entry["data"].(primitive.A)[0].(primitive.M)
		template += "The lumber mill at " + location + " with grade of " + grade + " and size of " + size + " at length of " + data["length"].(string) + "--> Tally of " + data["tally"].(string)
		template += "\n"
	}
	return template
}

// this function calls getEntries() which returns entries, and getCustomers(), then we can iterate through both
func getEmails() map[string]string {
	entries := getEntries()
	customers := getCustomers()
	emails := make(map[string]string)
	for _, customer := range customers {
		// 6 corresponds to sawmills so does entries[1]
		// 7 corresponds to grades so does entries [2]
		// 8 corresponds to sizes so does entries [3]
		// 9 corresponds to lengths so does entries
		var offers []primitive.M
		for _, entry := range entries {
			// the last checkEqual should be reformed because it only checks if the first data entry is correct, this will need to be updated
			if checkEqual(customer["sawmills"], entry["location"]) && checkEqual(customer["grades"], entry["grade"]) && checkEqual(customer["sizes"], entry["size"]) && checkEqualData(customer["lengths"], entry["data"]) {
				offers = append(offers, entry)
			}
		}
		companyName := customer["companyname"].(string)
		emails[companyName] = processEntries(offers)
	}
	fmt.Println(999999999999, emails, 111111111)
	return emails
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
func findUserByID(user_id string) (primitive.D, error) {
	id, err := primitive.ObjectIDFromHex(user_id)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	result := bson.D{}
	query := &bson.M{"_id": id}
	err = collection.FindOne(context.Background(), query).Decode(&result)
	if err != nil {
		return result, err
		//log.Fatal(err)
	}
	//TODO we might need check to ensure that a username is unique when you register
	fmt.Println("Found a Single User", result)
	return result, nil
}

func findOneUser(user models.User) (primitive.D, error) {
	result := bson.D{}
	query := &bson.M{"email": user.Email}
	err := collection.FindOne(context.Background(), query).Decode(&result)
	if err != nil {
		return result, err
		//log.Fatal(err)
	}
	//TODO we might need check to ensure that a username is unique when you register
	fmt.Println("Found a Single User", result)
	return result, nil
}

// Insert Entries in the DB
func insertEntries(entries []models.Entry) error {
	fmt.Println(entries)
	// We will encode more complex logic in here later after erics feedback
	var ui []interface{}
	for _, entry := range entries {
		entry.Time = time.Now()
		ui = append(ui, entry)
	}
	//update := bson.M{"$set": bson.M{"status": true}}
	insertResult, err := entryCollection.InsertMany(context.Background(), ui)
	if err != nil {
		log.Fatal(err)
		return err
		fmt.Println("Inserted the entries", insertResult)
	}
	return nil
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

// Insert one customer in the DB
func insertOneCustomer(customer models.Customer) {
	insertResult, err := customerCollection.InsertOne(context.Background(), customer)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Inserted a Single User", insertResult.InsertedID)
}
