const token = require("./createJWT.js");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require('express');
require('mongodb');


exports.setApp = function (app, client) {
// Add Card
// Incoming: userId, card
// Outgoing: error

app.post("/api/addcard", async (req, res) => {
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
// Login
// Incoming: login, password
// Outgoing: id, firstName, lastName, error
app.post("/api/login", async (req, res) => {
  const { login, password } = req.body;
  console.log(`Login attempt for user: ${login}`);
  try {
    const db = client.db("pockProf");
    const results = await db.collection("Users2").find({ Login: login }).toArray();

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
//Email Verification API
// Incoming: email
// Outgoing: success, error
app.post("/api/verifyemail", async (req, res) => {
  const { email, code } = req.body;
  try {
    const db = client.db("pockProf");
    const user = await db.collection("Users").findOne({ Email: email.toLowerCase() });

    console.log("Verification attempt for:", email);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (user.IsVerified) {
      console.log("User already verified");
      return res.status(400).json({ success: false, error: "Email already verified" });
    }

    console.log("Provided code:", code);
    console.log("Expected code:", user.VerificationCode);
    console.log("Code expiration date:", user.CodeExpires);
    console.log("Current date:", new Date(Date.now()));

    if (user.VerificationCode !== code) {
      console.log("Verification code does not match");
      return res.status(400).json({ success: false, error: "Invalid verification code" });
    }

    if (Date.now() > new Date(user.CodeExpires).getTime()) {
      console.log("Verification code expired");
      return res.status(400).json({ success: false, error: "Verification code expired" });
    }

    await db.collection("Users").updateOne(
      { Email: email.toLowerCase() },
      { $set: { IsVerified: true, VerificationCode: null, CodeExpires: null } }
    );
    console.log("User verified successfully");
    return res.status(200).json({ success: true, error: "" });
  } catch (err) {
    console.error("Email verification error:", err.message);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});


//Register API
//Incoming: login, password, firstName, lastName, email
//Outgoing id, firstName, lastName, error 
app.post("/api/register", async (req, res) => {
  let { login, password, firstName, lastName, email } = req.body;

  // Normalize inputs
  login = login.trim().toLowerCase();
  email = email.trim().toLowerCase();

  console.log("Register attempt:", { login, email });

  try {
    const db = client.db("pockProf");

    const existingUser = await db.collection("Users").findOne({
      $or: [{ Login: login }, { Email: email }]
    });

    console.log("Existing user found:", existingUser);

    let id = -1;
    let fn = "";
    let ln = "";
    let error = "";

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpires = new Date(Date.now() + 15 * 60 * 1000);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    if (existingUser) {
      if (existingUser.Login === login) {
        error = "Username is already taken";
      } else if (existingUser.Email === email) {
        if (!existingUser.IsVerified) {
          // Resend verification code, update user info
          await db.collection("Users").updateOne(
            { Email: email },
            {
              $set: {
                VerificationCode: verificationCode,
                CodeExpires: codeExpires,
                IsVerified: false,
                FirstName: firstName,
                LastName: lastName,
                Login: login,
                Password: await bcrypt.hash(password, 10),
              }
            }
          );

          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your PocketProf Verification Code',
            text: `Your verification code is ${verificationCode}. It will expire in 15 minutes.`,
          });

          return res.status(200).json({ id: existingUser._id.toString(), firstName, lastName, error: "" });
        } else {
          error = "Email is already registered";
        }
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        Login: login,
        Password: hashedPassword,
        Email: email,
        FirstName: firstName,
        LastName: lastName,
        VerificationCode: verificationCode,
        CodeExpires: codeExpires,
        IsVerified: false,
      };

      const result = await db.collection("Users").insertOne(newUser);
      id = result.insertedId.toString();
      fn = firstName;
      ln = lastName;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your PocketProf Verification Code',
        text: `Your verification code is ${verificationCode}. It will expire in 15 minutes.`,
      });
    }

    res.status(200).json({ id, firstName: fn, lastName: ln, error });

  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ id: -1, firstName: "", lastName: "", error: "Server error" });
  }

  console.log("BODY:", req.body);
});

// Search Cards
// Incoming: userId, search
// Outgoing: results[], error
app.post('/api/searchcards', async (req, res, next) =>
{
// incoming: userId, search
// outgoing: results[], error
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

};