require("dotenv").config();
// =======================
// Imports and Middleware
// =======================
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
// =======================
// MongoDB Setup
// =======================

const { MongoClient } = require("mongodb");
const url = process.env.MONGODB_URI;
const client = new MongoClient(url);
client
  .connect()
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// =======================
// In-Memory Card List
// =======================
const cardList = ["Roy Campanella", "Paul Molitor",
   "Tony Gwynn", "Dennis Eckersley", "Reggie Jackson", 
   "Gaylord Perry", "Buck Leonard", "Rollie Fingers", 
   "Charlie Gehringer", "Wade Boggs", "Carl Hubbell", 
   "Dave Winfield", "Jackie Robinson", "Ken Griffey, Jr.", 
   "Al Simmons", "Chuck Klein", "Mel Ott", "Mark McGwire", 
   "Nolan Ryan", "Ralph Kiner", "Yogi Berra", "Goose Goslin", 
   "Greg Maddux", "Frankie Frisch", "Ernie Banks", "Ozzie Smith", 
   "Hank Greenberg", "Kirby Puckett", "Bob Feller", "Dizzy Dean", 
   "Joe Jackson", "Sam Crawford", "Barry Bonds", "Duke Snider", 
   "George Sisler", "Ed Walsh", "Tom Seaver", "Willie Stargell", 
   "Bob Gibson", "Brooks Robinson", "Steve Carlton", "Joe Medwick", 
   "Nap Lajoie", "Cal Ripken, Jr.", "Mike Schmidt", "Eddie Murray", 
   "Tris Speaker", "Al Kaline", "Sandy Koufax", "Willie Keeler", 
   "Pete Rose", "Robin Roberts", "Eddie Collins", "Lefty Gomez", 
   "Lefty Grove", "Carl Yastrzemski", "Frank Robinson", "Juan Marichal", 
   "Warren Spahn", "Pie Traynor", "Roberto Clemente", "Harmon Killebrew", 
   "Satchel Paige", "Eddie Plank", "Josh Gibson", "Oscar Charleston", 
   "Mickey Mantle", "Cool Papa Bell", "Johnny Bench", "Mickey Cochrane", 
   "Jimmie Foxx", "Jim Palmer", "Cy Young", "Eddie Mathews", "Honus Wagner", 
   "Paul Waner", "Grover Alexander", "Rod Carew", "Joe DiMaggio", "Joe Morgan", 
   "Stan Musial", "Bill Terry", "Rogers Hornsby", "Lou Brock", "Ted Williams", 
   "Bill Dickey", "Christy Mathewson", "Willie McCovey", "Lou Gehrig", "George Brett", 
   "Hank Aaron", "Harry Heilmann", "Walter Johnson", "Roger Clemens", "Ty Cobb", 
   "Whitey Ford", "Willie Mays", "Rickey Henderson", "Babe Ruth"];

// =======================
// Routes
// =======================

// Add Card
// Incoming: userId, card
// Outgoing: error
app.post("/api/addcard", async (req, res, next) => {
  // incoming: userId, color
  // outgoing: error
  const { userId, card } = req.body;
  const newCard = { Card: card, UserId: userId };
  var error = "";
  try {
    const db = client.db("COP4331Cards"); // change to your database name (pockProf)
    // change to your collection name (unnamed for now | will be Cards most likely)
    const result = db.collection("Cards").insertOne(newCard);
  } catch (e) {
    error = e.toString();
  }
  cardList.push(card);
  var ret = { error: error };
  res.status(200).json(ret);
});

// Login
// Incoming: login, password
// Outgoing: id, firstName, lastName, error
app.post("/api/login", async (req, res) => {
  const { login, password } = req.body;

  try {
    const db = client.db("pockProf"); // database name here | this is good
    // this is fine
    const results = await db
      .collection("Users")
      .find({ Login: login, Password: password })
      .toArray();

    let id = -1;
    let fn = "";
    let ln = "";
    let error = "";

    if (results.length > 0) {
      // if no custom UserID, use _id instead
      id = results[0].UserID || results[0]._id;
      fn = results[0].FirstName;
      ln = results[0].LastName;
    } else {
      error = "Invalid username or password";
    }

    const ret = { id, firstName: fn, lastName: ln, error };
    res.status(200).json(ret);
  } catch (err) {
    console.error("Login error:", err.message);
    res
      .status(500)
      .json({ id: -1, firstName: "", lastName: "", error: "Server error" });
  }
});

//Register API
//Incoming: login, password, firstName, lastName
//Outgoing id, firstName, lastName, error 
app.post("/api/register", async(req, res) => {
  const{ login ,password, firstName, lastName} = req.body;

  try{
    const db = client.db("pockProf");

    const existingUser = await db
      .collection("Users")
      .findOne({Login: login});

    let id = -1;
    let fn = "";
    let ln = "";
    let error = "";

    if(existingUser) {
      error = "Username is already taken";
    } else {
      // Insert the new user
      const newUser = {
        Login: login,
        Password: password,
        FirstName: firstName,
        LastName: lastName,
      };

      const result = await db.collection("Users").insertOne(newUser);

      id = result.insertedId.toString();
      fn = firstName;
      ln = lastName;
    }
    
    const ret = { id, firstName: fn, lastName: ln, error };
    res.status(200).json(ret);
  } catch (err) {
    console.error("Registration error:", err.message);
    res
      .status(500)
      .json({ id: -1, firstName: "", lastName: "", error: "Server error" });

  }
  console.log("BODY:", req.body);
});

// Search Cards
// Incoming: userId, search
// Outgoing: results[], error
app.post("/api/searchcards", async (req, res, next) => {
  // incoming: userId, search
  // outgoing: results[], error
  var error = "";
  const { userId, search } = req.body;
  var _search = search.trim();
  const db = client.db("COP4331Cards"); //change database name here (pockProf)
  // change to your collection name
  const results = await db
    .collection("Cards")
    .find({ Card: { $regex: _search + ".*", $options: "i" } })
    .toArray();
  var _ret = [];
  for (var i = 0; i < results.length; i++) {
    _ret.push(results[i].Card);
  }
  var ret = { results: _ret, error: error };
  res.status(200).json(ret);
});
// =======================
// Start Server
// =======================
app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});