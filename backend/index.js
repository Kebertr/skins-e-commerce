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

setTimeout(makeconnection, 3000);

app.get('/api/users', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      res.status(500).send('Problem gettings users');
      return;
    }
    res.json(results);
  });
});



const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});