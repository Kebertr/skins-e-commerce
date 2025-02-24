const express = require('express');
const app = express();
app.use(express.json());
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const cors = require('cors');

//Allowing http request from cross
app.use(cors('http://localhost'));

//Makes a connection with mysql database
let connection;
function makeconnection(){
  connection = mysql.createConnection({
    host: 'database', 
    user: 'user',
    password: 'password',
    database: 'mydatabase',
    port: '3306',
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


//Users
//Get all users
app.get('/users', (req, res) => {
  //Makes query to database
  connection.query('SELECT * FROM users', (error, results) => {
    if (error) {
      res.status(400).send('Problem getting all users');
      return;
    }
    //Return all users
    res.json(results);
  });
});

//Register users
app.post('/registerUser', (req, res) => {
  //Gets value from post body
  const { username, user_password } = req.body;
  //Generating the salt for bcrypt hash
  bcrypt.genSalt(10, (error, salt) => {
    if (error) {
        res.status(400).send('Error with salt');
        return;
    }
    //Hashing with the generated salt
    bcrypt.hash(user_password, salt, (errors, hash) => {
      if (errors) {
          res.status(400).send('Error hasing password');
          return;
      }
      
      //Puts username and hashed password inte database
      connection.query('INSERT INTO users (username, user_password) VALUES (?, ?)', [username, hash], (err, result) => {
        if (err) {
          res.status(400).send('Error registrating user');
          return;
        }
        res.status(201).send('Created user');
      });
    });
  });
});

//Login for users
app.post('/loginUser', (req, res) => {
  const { username, user_password} = req.body;

  //Gets username and password if the username exists in table users
  connection.query('SELECT username, user_password FROM users WHERE username = ?', [username], (error, result) => {
    if (error) {
      res.status(400).send('User do not exist');
      return;
    }

    //Compares the password from user input with the one in database
    bcrypt.compare(user_password, result[0].user_password, function(error, pass) {
      if (error){
        res.status(400).send('Error comparing password');
        return;
      };

      //Checks if they matches
      if (pass === true) {
        res.status(200).send('Successfully logged in');
        return;
      } else {
        res.status(400).send('Your password does not match');
        return;
      }
    });
  });
});


//Skins
//Get all skins
app.get('/skins', (req, res) => {
  connection.query('SELECT * FROM skins', (error, results) => {
    if (error) {
      res.status(400).send('Problem gettings skins');
      return;
    }
    //You get a list with json objects back
    res.json(results);
  });
});

app.put('/changeSkinStock', (req, res) => {
  const { amount } = req.body;
  const { id } = req.query;
  //example of url for using productId is 'http://localhost:3000/changeSkinStock?id=1' for id=1
  connection.query('SELECT stock FROM skins WHERE id = ?', [id], (error, result) => {
    if (error) {
      res.status(400).send('Error getting stock');
      return;
    }
    connection.query('UPDATE skins SET stock = ? WHERE id = ?', [(result[0].stock - amount), id], (err, result) => {
      if (err) {
        res.status(400).send('Error changing stock');
        return;
      }
      res.status(200).send('Successfully changed stock for product');
    });
  });
});

app.post('/createSkin', (req, res) => {
  const { skin_name, category, skin_value, stock, image_location } = req.body;
  connection.query('INSERT INTO skins (skin_name, category, skin_value, stock, image_location) VALUES (?, ?, ?, ?, ?)', [skin_name, category, skin_value, stock, image_location], (err, result) => {
    if (err) {
      res.status(400).send('Error creating skin');
      return;
    }
    res.status(201).send('Create skin');
  });
});



//Get all reviews
app.get('/reviewProduct', (req, res) => {
  //example of url for using productId is 'http://localhost:3000/reviewProduct?productId=1' for productId=1
  const { productId } = req.query;
  connection.query('SELECT review, grade FROM reviews WHERE productId = ?', [productId], (error, result) => {
    if (error) {
      res.status(400).send('Error getting reviews');
      return;
    }
    res.status(201).send(result);
    res.json(result);
  });
});

app.post('/makeReview', (req, res) => {
  const {review, grade, userId, productId } = req.body;
  connection.query('INSERT INTO reviews (review, grade, userId, productId) VALUES (?, ?, ?, ?)', [review, grade, userId, productId], (error, result) => {
    if (error) {
      res.status(400).send(error);
      return;
    }
    res.status(201).send('Made the review');
  });
});

//Basket
//Get all skins in the basket
app.get('/basket', (req, res) => {
  const { id } = req.query;
  //example of url for using productId is 'http://localhost:3000/changeSkinStock?id=1' for id=1
  connection.query('SELECT * FROM basket WHERE id = ?', [id], (error, results) => {
    if (error) {
      res.status(400).send('Problem gettings the basket');
      return;
    }
    //You get a list with json objects back
    res.json(results);
  });
});

app.post('/addSkin', (req, res) => {
  const { quantity, userId, productId } = req.body;
  connection.query('SELECT skin_name from skins WHERE id = ?', [productId], (error, result) => {
    if(error){
      res.status(400).send('Problem getting skin name');
      return;
    }
    connection.query('INSERT INTO Basket (skin_name, quantity, userId, productId) VALUES (?, ?, ?, ?)', [result[0].skin_name, quantity, userId, productId], (err, resultBask) => {
      if (err) {
        res.status(400).send('Error adding skin to basket');
        return;
      }
      res.status(201).send('successfully added skin to basket');
    });
  });
});



//Listen on port 9000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});