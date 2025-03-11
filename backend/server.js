const express = require("express");
const app = express();
app.use(express.json());
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
//import session from "express-session"

const cors = require("cors");

//Allowing http request from cross
app.use(cors("http://localhost"));

//Makes a connection with mysql database
let connection;
function makeconnection() {
  connection = mysql.createConnection({
    host: "database",
    user: "user",
    password: "password",
    database: "mydatabase",
    port: "3306",
  });
  connection.connect((err) => {
    if (err) {
      console.error("Couldn't connect to database, let's try in 3", err);
      setTimeout(makeconnection, 3000);
    } else {
      console.log("Connected to database!");
    }
  });
}

makeconnection();

// Session Middleware (Should be before routes)
app.use(
  session({
    secret: "super secret",
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: "strict",
      maxAge: 60000 * 10, // 10 minutes
    },
  })
);

/*const sessionStore = new MySQLStore({
  host: 'database',
  user: 'user',
  password: 'password',
  database: 'mydatabase',
  port: '3306',
});*/

//Users
//Get all users
app.get("/users", (req, res) => {
  //Makes query to database
  connection.query("SELECT * FROM users", (error, results) => {
    if (error) {
      res.status(400).send("Problem getting all users");
      return;
    }
    //Return all users
    res.json(results);
  });
});

//Register users
app.post("/registerUser", (req, res) => {
  //Gets value from post body
  const { username, user_password, adminRole } = req.body;
  //Generating the salt for bcrypt hash
  bcrypt.genSalt(10, (error, salt) => {
    if (error) {
      res.status(400).send("Error with salt");
      return;
    }
    //Hashing with the generated salt
    bcrypt.hash(user_password, salt, (errors, hash) => {
      if (errors) {
        res.status(400).send("Error hasing password");
        return;
      }

      //Puts username and hashed password inte database
      connection.query(
        "INSERT INTO users (username, user_password, cash, adminRole) VALUES (?, ?, ?, ?)",
        [username, hash, 0, adminRole],
        (err, result) => {
          if (err) {
            res.status(400).send("Error registrating user");
            return;
          }
          res.status(201).send("Created user");
        }
      );
    });
  });
});

//Login for users
app.post("/loginUser", (req, res) => {
  const { username, user_password } = req.body;

  //Gets username and password if the username exists in table users
  connection.query(
    "SELECT username, user_password FROM users WHERE username = ?",
    [username],
    (error, result) => {
      if (error) {
        res.status(400).send("User do not exist");
        return;
      }

      //Compares the password from user input with the one in database
      bcrypt.compare(
        user_password,
        result[0].user_password,
        function (error, pass) {
          if (error) {
            res.status(400).send("Error comparing password");
            return;
          }

          //Checks if they matches
          if (pass === true) {
            //Create session
            createSession(req, connection, username);

            res.status(200).send("Successfully logged in");
            return;
          } else {
            res.status(400).send("Your password does not match");
            return;
          }
        }
      );
    }
  );
});

//Seasion
//Create session
function createSession(req, connection, username) {
  //delete previous session if exsist
  connection.query(
    "DELETE FROM user_sessions WHERE username = ?",
    [username],
    (err, result) => {
      if (err) {
        console.log("could not delete session");
        return;
      }
      console.log("session deleted");
    }
  );

  //Create new session
  req.session.user = { username };
  console.log("seasion created, id:", req.session);

  connection.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (error, results) => {
      if (error) {
        res.status(400).send("Problem getting all users");
        return;
      }
      console.log("result: ", results);

      const cash = results[0].cash;
      const sessionId = req.session.id;
      const userId = results[0].id;
      let expirationTime = new Date(req.session.cookie._expires);
      expirationTime = new Date(expirationTime.getTime() + 60 * 60 * 1000); // Add 1 hour
      const formattedExpirationTime = expirationTime
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      connection.query(
        "INSERT INTO user_sessions (session_id, username, userId, expiration_time, cash) VALUES (?, ?, ?, ?, ?)",
        [sessionId, username, userId, formattedExpirationTime, cash],
        (err, result) => {
          if (err) {
            console.log("could not add session to db");
            return;
          }
          console.log("session added");
        }
      );
    }
  );
}

//Get seasion ID
app.get("/sessionId", (req, res) => {
  const { username } = req.query;
  connection.query(
    "SELECT session_id, expiration_time FROM user_sessions WHERE username = ?",
    [username],
    (err, result) => {
      if (err) {
        console.error("Error getting session id", err);
        res.status(400).send("Error fetching sessionId for user: " + username);
        return;
      } else if (Date(result[0].expiration_time) > Date.now()) {
        //if sesion expired delete session
        connection.query(
          "DELETE FROM user_sessions WHERE username = ?",
          [username],
          (err, result) => {
            if (err) {
              console.log("could not delete session");
              return;
            }
            console.log("session deleted");
          }
        );
        res.status(600).send("Session has expired");
        return;
      } else if (result[0].session_id.length == 0) {
        //if session empty
        console.log("session id NULL");
        res.status(400).send("No session id found for user");
        return;
      }
      console.log("session id returned");
      console.log(result[0].session_id);
      res.status(200).send(result[0].session_id);
    }
  );
});

//Add cash
app.post("/cash", (req, res) => {
  const { username, user_password } = req.body;
  console.log(req.body);
  connection.query(
    //add cash to account
    "UPDATE users SET cash = ? WHERE username = ?",
    [req.body.cash, req.body.username],
    (error, results) => {
      if (error) {
        res.status(400).send("Problem setting cash");
        return;
      }
    }
  );
  connection.query(
    //add cash to session
    "UPDATE user_sessions SET cash = ? WHERE username = ?",
    [req.body.cash, req.body.username],
    (error, results) => {
      if (error) {
        res.status(400).send("Problem setting cash");
        return;
      }
    }
  );
});

//Gett session
app.get("/session", (req, res) => {
  const ID = req.query.sessionID.trim();
  //Makes query to database
  connection.query(
    "SELECT * FROM user_sessions WHERE session_id = ?",
    [ID],
    (error, results) => {
      if (error) {
        res.status(400).send("Problem getting all users");
        return;
      }
      //Return session
      console.log(results[0]);
      res.json(results);
    }
  );
});

//Gett user
app.get("/user", (req, res) => {
  const ID = req.query.username.trim();
  //Makes query to database
  connection.query(
    "SELECT * FROM users WHERE username = ?",
    [ID],
    (error, results) => {
      if (error) {
        res.status(400).send("Problem getting all users");
        return;
      }
      //Return user
      console.log(results);
      res.json(results);
    }
  );
});

//Skins
//Get all skins
app.get("/skins", (req, res) => {
  connection.query("SELECT * FROM skins", (error, results) => {
    if (error) {
      res.status(400).send("Problem gettings skins");
      return;
    }
    //You get a list with json objects back
    res.json(results);
  });
});

// Get a skin with ID
app.get("/skins/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "SELECT * FROM skins WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        console.error("Error fetching skin:", error);
        res.status(500).send("Problem getting skin"); // server errors
        return;
      }
      if (results.length === 0) {
        res.status(404).send("Skin not found"); // no skin is found
        return;
      }
      res.json(results[0]); // Return the only result
    }
  );
});

app.put("/changeSkinStock", (req, res) => {
  const { amount } = req.body;
  const { id } = req.query;
  //example of url for using productId is 'http://localhost:3000/changeSkinStock?id=1' for id=1
  connection.query(
    "SELECT stock FROM skins WHERE id = ?",
    [id],
    (error, result) => {
      if (error) {
        res.status(400).send("Error getting stock");
        return;
      }
      connection.query(
        "UPDATE skins SET stock = ? WHERE id = ?",
        [result[0].stock - amount, id],
        (err, result) => {
          if (err) {
            res.status(400).send("Error changing stock");
            return;
          }
          res.status(200).send("Successfully changed stock for product");
        }
      );
    }
  );
});
app.put("/changeSkinStockAdmin", (req, res) => {
  const { stock, id } = req.body; // getting id and stock from request body

  if (!stock || !id) {
    return res.status(400).json({ error: "id or stock is missing" });
  }
  if (stock < 0) {
    return res.status(400).json({ error: "Can't input negative stock values" });
  }

  connection.query(
    "UPDATE skins SET stock = ? WHERE id = ?",
    [stock, id],
    (error, result) => {
      
      if (error) {
        console.error("Error updating stock:", error);
        return res.status(500).json({ error: "Failed to update stock" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Skin not found" });
      }

      res.status(200).json({ message: "Successfully updated stock", stock, id });
    }
  );
});


app.post("/createSkin", (req, res) => {
  const { skin_name, category, skin_value, stock, image_location } = req.body;
  connection.query(
    "INSERT INTO skins (skin_name, category, skin_value, stock, image_location) VALUES (?, ?, ?, ?, ?)",
    [skin_name, category, skin_value, stock, image_location],
    (err, result) => {
      if (err) {
        res.status(400).send("Error creating skin");
        return;
      }
      res.status(201).send("Create skin");
    }
  );
});


//Get all reviews
app.get("/reviewProduct", (req, res) => {
  //example of url for using productId is 'http://localhost:3000/reviewProduct?productId=1' for productId=1
  const { productId } = req.query;
  connection.query(
    "SELECT review, grade, userId FROM reviews WHERE productId = ?",
    [productId],
    (error, result) => {
      if (error) {
        res.status(400).send("Error getting reviews");
        return;
      }
      console.log(result[0].userId);
      connection.query(
        "SELECT username FROM users WHERE id = ?",
        [result[0].userId],
        (err, resu) => {
          if (err) {
            res.status(400).send("Error getting username");
            return;
          }
          for (let i = 0; i < result.length; i++) {
            result[i]["username"] = resu[0].username;
          }
          console.log(result);
          res.json(result);
        }
      );
    }
  );
});

app.post("/makeReview", (req, res) => {
  const { review, grade, userId, productId, productName } = req.body;

  //check how many reviews user has made
  connection.query(
    "SELECT id FROM reviews WHERE userId = ? AND productId = ?",
    [userId, productId],
    (error, result) => {
      console.log("result: ", result);
      if (error) {
        res.status(400).send(error);
        return;
      }else if (result.length >= 1) {
        res.status(400).send("You have already reviewed this product.");
        return;
      }
      //check how if user owns item
      connection.query(
        "SELECT id FROM orders WHERE userId = ? AND skin_name = ?",
        [userId, productName],
        (error, result2) => {
          console.log("result2: ", result2);
          if (error) {
            res.status(400).send(error);
            return;
          } else if(result2.length < 1) {
            res.status(400).send("You don't own this item");
            return;
          }
          //make review
          connection.query(
            "INSERT INTO reviews (review, grade, userId, productId) VALUES (?, ?, ?, ?)",
            [review, grade, userId, productId],
            (error, result) => {
              if (error) {
                res.status(400).send(error);
                return;
              }
              res.status(201).send("Made the review");
            }
          );
        }
      );
    }
  );
});

//Basket
//Get all skins in the basket
app.get("/basket", (req, res) => {
  const { id } = req.query;
  //example of url for using productId is 'http://localhost:3000/changeSkinStock?id=1' for id=1
  connection.query(
    "SELECT * FROM Basket WHERE userId = ?",
    [id],
    (error, results) => {
      if (error) {
        res.status(400).send("Problem gettings the basket");
        return;
      }
      //You get a list with json objects back
      res.json(results);
    }
  );
});

app.post("/addSkin", (req, res) => {
  const { quantity, userId, productId } = req.body;
  connection.query(
    `INSERT INTO Basket (skin_name, quantity, userId, productId, skin_value, stock)
      SELECT skin_name, ?, ?, ?, skin_value, stock
      FROM skins
      WHERE id = ?`,
    [quantity, userId, productId, productId],
    (err, resultBask) => {
      if (err) {
        res.status(400).send("Error adding skin to basket");
        return;
      }
      res.status(201).send("successfully added skin to basket");
    }
  );
});

app.post("/deleteCart", (req, res) => {
  const { skin } = req.body;
  connection.query(
    "DELETE FROM Basket WHERE userId = ? AND productId = ?",
    [skin.userId, skin.productId],
    (error, results) => {
      if (error) {
        res.status(400).send("Problem getting rid of basket");
        return;
      }
      res.status(200).send("successfully deleted basket for user");
    }
  );
});

app.post("/checkout", (req, res) => {
  const { userId, cash, username, data } = req.body;
  connection.query(
    "SELECT * FROM Basket WHERE userId = ?",
    [userId],
    (error, results) => {
      if (error) {
        res.status(400).send("Problem getting basket for user");
        return;
      }
      results.forEach((result) => {
        var cost = result.skin_value * result.quantity;
        connection.query(
          "INSERT INTO orders (userId, cost, skin_name) VALUES (?, ?, ?)",
          [userId, cost, result.skin_name],
          (error, resultOrder) => {
            if (error) {
              res.status(400).send("Error adding to orders");
              return;
            }
            res.status(201).send("successfully added to orders");
          }
        );
      });
    }
  );

  connection.query(
    "DELETE FROM Basket WHERE userId = ?",
    [userId],
    (error, results) => {
      if (error) {
        res.status(400).send("Problem getting rid of basket");
        return;
      }
      res.status(200).send("successfully deleted basket for user");
    }
  );

  data.forEach((prop) => {
    connection.query(
      "UPDATE skins SET stock = ? WHERE id = ?",
      [prop.stock - prop.quantity, prop.productId],
      (error, results) => {
        if (error) {
          res.status(400).send("Problem setting cash");
          return;
        }
      }
    );
  });

  connection.query(
    "UPDATE users SET cash = ? WHERE username = ?",
    [cash, username],
    (error, results) => {
      if (error) {
        res.status(400).send("Problem setting cash");
        return;
      }
    }
  );

  connection.query(
    "UPDATE user_sessions SET cash = ? WHERE username = ?",
    [cash, username],
    (error, results) => {
      if (error) {
        res.status(400).send("Problem setting cash");
        return;
      }
    }
  );
});

app.get("/getAdmin", (req, res) => {
  const { id } = req.query;
  //example of url for using productId is 'http://localhost:3000/getAdmin?id=1' for id=1
  connection.query(
    "SELECT adminRole FROM users WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        res.status(400).send("Problem gettings the basket");
        return;
      }
      //You get a list with json objects back
      console.log(results);
      res.json(results);
    }
  );
});

app.get("/getOrders", (req, res) => {
  connection.query("SELECT * FROM orders", (error, results) => {
    if (error) {
      res.status(400).send("Problem getting all users");
      return;
    }
    //Return all users
    res.json(results);
  });
});

//Listen on port 9000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
