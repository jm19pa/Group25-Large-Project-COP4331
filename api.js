const token = require("./createJWT.js");
const bcrypt = require("bcrypt");


exports.setApp = function (app, client) {
// Add Card
// Incoming: userId, card
// Outgoing: error
app.post("/api/addcard", async (req, res) => {
    const { userId, card, jwtToken } = req.body;
    try {
      if (token.isExpired(jwtToken)) return res.status(200).json({ error: "The JWT is no longer valid", jwtToken: "" });
    } catch (e) {
      console.log(e.message);
    }

    const db = client.db("pockProf");
    let error = "";
    try {
      await db.collection("Cards").insertOne({ Card: card, UserId: userId });
    } catch (e) {
      error = e.toString();
    }

    let refreshedToken = token.refresh(jwtToken);
    res.status(200).json({ error, jwtToken: refreshedToken });
  });
// Login
// Incoming: login, password
// Outgoing: id, firstName, lastName, error
app.post("/api/login", async (req, res) => {
  const { login, password } = req.body;

  try {
    const db = client.db("pockProf");
    const results = await db.collection("Users").find({ Login: login }).toArray();

    let id = -1;
    let fn = "";
    let ln = "";
    let error = "";
    let jwtToken = "";

    if (results.length > 0) {
      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.Password);

      if (isMatch) {
        id = user.userId || user._id?.toString();
        fn = user.FirstName;
        ln = user.LastName;
        
        const tokenObj = token.createToken(fn, ln, id);
        jwtToken = tokenObj.accessToken || ""; 
      } else {
        error = "Login/Password incorrect";
      }
    } else {
      error = "Login/Password incorrect";
    }

    res.status(200).json({ id, firstName: fn, lastName: ln, jwtToken, error });
  } catch (err) {
    console.error("Login error:", err.message);
    res
      .status(500)
      .json({ id: -1, firstName: "", lastName: "", jwtToken: "", error: "Server error" });
  }
});
//Register API
//Incoming: login, password, firstName, lastName
//Outgoing id, firstName, lastName, error 
app.post("/api/register", async(req, res) => {
  const{ login ,password, firstName, lastName, email} = req.body;

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


      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert the new user
      const newUser = {
        Login: login,
        Password: hashedPassword,
        Email: email,
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
  const db = client.db("pockProf"); //change database name here (pockProf)
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
};