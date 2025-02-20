const express = require('express');
const app = express();
app.use(express.json());
const mysql = require('mysql2');

const cors = require('cors');


app.use(cors());

let connection;
function makeconnection(){
  connection = mysql.createConnection({
    host: 'database', 
    user: 'user',
    password: 'password',
    database: 'mydatabase',
    port: '3306',
  });
  connection.connect();
}

setTimeout(makeconnection, 5000);

app.get('/api/users', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      alert('Problem gettings users');
      return;
    }
    res.json(results);
  });
});

app.get('/api/skins', (req, res) => {
  connection.query('SELECT * FROM skins', (err, results) => {
    if (err) {
      alert('Problem gettings skins');
      return;
    }
    res.json(results);
  });
});

app.post('/api/createskin', (req, res) => {
  const { name, category, value, image_location } = req.body;
  connection.query('INSERT INTO skins (name, category, value, image_location) VALUES (?, ?, ?, ?)', [name, category, value, image_location], (err, result) => {
    if (err) {
      res.status(400).send('Error creating skin');
      return;
    }
    res.status(201).send('Create skin');
  });
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});