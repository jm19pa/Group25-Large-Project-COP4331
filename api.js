const token = require("./createJWT.js");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const sgMail = require('@sendgrid/mail');
require('dotenv').config();
require('express');
require('mongodb');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.setApp = function (app, client) {
// Add Card
// Incoming: userId, card
// Outgoing: error

/*app.post("/api/addcard", async (req, res) => {
    const { userId, card, jwtToken } = req.body;
/////////////////////////////////////////////////
  console.log("Received addCard request:");
  console.log("userId:", userId);
  console.log("card:", card);
  console.log("jwtToken (raw):", jwtToken);
/////////////////////////////////////////////////
    try {
      console.log("Checking if token is expired...");
      if (token.isExpired(jwtToken)) {
        console.log("JWT is expired or invalid.");
        console.log("Token expired");
        return res.status(200).json({ error: "The JWT is no longer valid", jwtToken: "" });
    } console.log("Token is valid");
  }

    catch (err) {
      console.error("Error checking token expiration:", err);
  return res.status(500).json({ error: "Token validation error", jwtToken: "" });
    }
    console.log("Before insertOne");
    const db = client.db("COP4331Cards"); // change database name here (pockProf)
    console.log("After insertOne");
    let error = "";
    try {
      await db.collection("Cards").insertOne({ Card: card, UserId: userId });
      console.log("Card inserted successfully");
    } catch (e) {
      console.error("Error inserting card:", e.message);
      error = e.toString();
    }
    // these lines important cuz refreshing makes it an object
    // so we need to convert it back to a string
    let refreshedTokenObj = token.refresh(jwtToken);
    let refreshedToken = refreshedTokenObj.accessToken;
    res.status(200).json({ error: "", jwtToken: refreshedToken });
  });
*/

// Login
// Incoming: login, password
// Outgoing: id, firstName, lastName, error
app.post("/api/login", async (req, res) => {
  const { login, password } = req.body;
  console.log(`Login attempt for user: ${login}`);
  try {
    const db = client.db("pockProf");
    const results = await db.collection("Users").find({ Login: login }).toArray();

    let id = -1;
    let fn = "";
    let ln = "";
    let error = "";
    let jwtToken = "";
    let user = null
    if (results.length > 0) {
      user = results[0];
      const isMatch = await bcrypt.compare(password, user.Password);

      if (isMatch) {
        id = user.userId || user._id?.toString();
        fn = user.FirstName;
        ln = user.LastName;
        
        const tokenObj = token.createToken(fn, ln, id);
        jwtToken = tokenObj.accessToken;
      } else {
        error = "Login/Password incorrect";
      }
    } else {
      error = "Login/Password incorrect";
    }
  if (!user.IsVerified) {
    return res.status(403).json({ id: -1, error: "Email not verified", jwtToken: "" });
}
  if (jwtToken) {
    console.log("Generated JWT token:", jwtToken);
  }
    res.status(200).json({ id, firstName: fn, lastName: ln, jwtToken, error });
  } catch (err) {
    console.error("Login error:", err.message);
    res
      .status(500)
      .json({ id: -1, firstName: "", lastName: "", jwtToken: "", error: "Server error" });
  }
});


/*
// Search Cards
// Incoming: userId, search
// Outgoing: results[], error
app.post('/api/searchcards', async (req, res, next) =>
{
var error = '';
const { userId, search, jwtToken } = req.body;
try
{
if( token.isExpired(jwtToken))
{
var r = {error:'The JWT is no longer valid', jwtToken: ''};
res.status(200).json(r);
return;
}
}
catch(e)
{
console.log(e.message);
}
var _search = search.trim();
const db = client.db('COP4331Cards');
const results = await db.collection('Cards').find({"Card":{$regex:_search+'.*',
$options:'i'}}).toArray();
var _ret = [];
for( var i=0; i<results.length; i++ )
{
_ret.push( results[i].Card );
}
var refreshedToken = null;
try
{
let refreshedTokenObj = token.refresh(jwtToken);
let refreshedToken = refreshedTokenObj.accessToken;
}
catch(e)
{
console.log(e.message);
}
var ret = { results:_ret, error: error, jwtToken: refreshedToken };
res.status(200).json(ret);
});
*/

//Search All Cards Not Found
//Incoming:UserID, jwt
//OutGoing: All Cards In DataBase Not Found
app.post("/api/unfoundCards", async(req, res) => { 
  const{userID, jwtToken} = req.body;
try
{
if( token.isExpired(jwtToken))
{
var r = {error:'The JWT is no longer valid', jwtToken: ''};
res.status(200).json(r);
return;
}
}
catch(e)
{
console.log(e.message);
}

let missingCards = [];
let error = '';

try{
  const userDb = client.db("COP4331Cards");
  const globalDb = client.db("pockProf");

 const userResults = await userDb.collection("Cards").find({ UserId: userID }).toArray();
 const userCardNames = new Set(userResults.map(doc => doc.Card));

 const globalCardResults = await globalDb.collection("Cards").distinct("Card");
 missingCards = globalCardResults.filter(card => !userCardNames.has(card));
}catch (e) {
    error = e.toString();
}
let refreshedToken = null;
  try {
    refreshedToken = token.refresh(jwtToken);
  } catch (e) {
    console.log(e.message);
  }

  res.status(200).json({ missingCards, error, jwtToken: refreshedToken });

}); //End of UnfoundCards

//Search Found Cards API
//Incoming:UserID, jwt
//Outgoing: Found Cards
app.post("/api/foundCards", async(req, res) => {
  const{userID, jwtToken} = req.body;
try
{
if( token.isExpired(jwtToken))
{
var r = {error:'The JWT is no longer valid', jwtToken: ''};
res.status(200).json(r);
return;
}
}
catch(e)
{
console.log(e.message);
}
let cards = [];
let error = '';
try {
  const db = client.db("COP4331Cards");
  const results = await db.collection("Cards").find({ UserId: userID }).toArray();

  cards = results.map(doc => doc.Card);
} catch(e){
  error = e.toString();
}

var refreshedToken = null;
try
{
refreshedToken = token.refresh(jwtToken);
}
catch(e)
{
console.log(e.message);
}
res.status(200).json({ cards, error, jwtToken: refreshedToken });
});

//Updated Register
//Incoming:Login,Password,firstName,lastName,email
//Outgoing:Error,Success
app.post("/api/register", async(req,res) => {
  const{login, password, firstName, lastName, email} = req.body;
  
  try {
    const db = client.db("pockProf");

    // Normalize login
    const normalizedLogin = login.trim().toLowerCase();

    // Check if login already exists
    const existingUser = await db.collection("Users").findOne({ Login: normalizedLogin });

    if (existingUser) {
      return res.status(400).json({ success: false, error: "Username is already taken" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUserEmail = await db.collection("Users").findOne({ Email: normalizedEmail });

    if (existingUserEmail) {
      return res.status(400).json({ success: false, error: "Email is already taken" });
    }
    

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await db.collection("Users").insertOne({
      Login: normalizedLogin,
      Password: hashedPassword,
      FirstName: firstName,
      LastName: lastName,
      Email: email.trim().toLowerCase(),
      VerificationCode: null,
      CodeExpires: null,
      IsVerified: false,
    });

    return res.status(200).json({ success: true, error: "" });

  } catch (err) {
    console.error("Registration error:", err.message);
    return res.status(500).json({ success: false, error: "Server error" });
  }


}); //End of Register

app.post("/api/Verify", async (req, res) => {
  const { email } = req.body;
  const db = client.db("pockProf");

  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const codeExpires = new Date(Date.now() + 15 * 60 * 1000);

  try {
    // Find user by email
    const user = await db.collection("Users").findOne({ Email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Update user's code and expiration
    await db.collection("Users").updateOne(
      { Email: email.toLowerCase() },
      {
        $set: {
          VerificationCode: verificationCode,
          CodeExpires: codeExpires,
        },
      }
    );

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Your PocketProf Verification Code',
      text: `Your verification code is ${verificationCode}. It will expire in 15 minutes.`,
    };
    await sgMail.send(msg);

/*
    // Send user the verification code
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port:443,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your PocketProf Verification Code',
      text: `Your verification code is ${verificationCode}. It will expire in 15 minutes.`,
    });
*/
    return res.status(200).json({ success: true, message: "Verification code sent" });

  } catch (err) {
    console.error("Error during verification process:", err.message);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

//Confirm Email Code
//Incoming:Verification Code, Email
//OutGoing:Error, Login page
app.post("/api/Confirm", async (req, res) => {
  const { email, verificationCode } = req.body;
  const db = client.db("pockProf");

  try {
    const user = await db.collection("Users").findOne({ Email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (user.VerificationCode !== verificationCode) {
      return res.status(400).json({ success: false, error: "Invalid verification code" });
    }

    // Check code expiration 
    if (user.CodeExpires && Date.now() > new Date(user.CodeExpires).getTime()) {
      return res.status(400).json({ success: false, error: "Verification code expired" });
    }

    // Update user to verified and clear codes
    await db.collection("Users").updateOne(
      { Email: email.toLowerCase() },
      { $set: { IsVerified: true }, $unset: { VerificationCode: "", CodeExpires: "" } }
    );

    return res.status(200).json({ success: true, message: "Email verified successfully" });

  } catch (err) {
    console.error("Error confirming verification:", err.message);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

// Open Pack
// Incoming: userId, jwtToken, packName
// Outgoing: jwtToken, addedCards, error
app.post('/api/openPack', async (req, res) => {
  const { userId, jwtToken, packName } = req.body;

  // Validate JWT
  try {
    if (token.isExpired(jwtToken)) {
      return res.status(200).json({ error: 'JWT expired', jwtToken: '' });
    }
  } catch (e) {
    return res.status(500).json({ error: 'JWT validation failed', jwtToken: '' });
  }

  try {
    const userDb = client.db("COP4331Cards");
    const packDb = client.db(packName);

    const rarityWeights = {
      1: 50,
      2: 25,
      3: 15,
      4: 8,
      5: 2
    };

    // Get all cards from the pack
    const allCards = await packDb.collection('Cards').find({}).toArray();
    const weightedPool = [];

    // Create weighted pool
    allCards.forEach(card => {
      const weight = rarityWeights[card.Rarity] || 1;
      for (let i = 0; i < weight; i++) {
        weightedPool.push(card);
      }
    });

    const newCards = [];
    const selected = new Set();
    const packSize = 3; // change if needed

    while (newCards.length < packSize && weightedPool.length > 0) {
      const randIndex = Math.floor(Math.random() * weightedPool.length);
      const selectedCard = weightedPool[randIndex];

      if (!selected.has(selectedCard.Card)) {
        newCards.push(selectedCard);
        selected.add(selectedCard.Card);
      }
    }

    // Add cards to user's collection
    const userCardsCollection = userDb.collection("UserCards");
    const insertOps = newCards.map(card => ({
      UserId: userId,
      Card: card.Card,
      Rarity: card.Rarity,
    }));
    await userCardsCollection.insertMany(insertOps);

    // Return updated JWT and the new cards
    const refreshedToken = token.refresh(jwtToken);
    return res.status(200).json({
      jwtToken: refreshedToken,
      addedCards: newCards,
      error: ''
    });

  } catch (err) {
    console.error("Error opening pack:", err);
    return res.status(500).json({ error: "Error opening pack", jwtToken: '' });
  }
});



};