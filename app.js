const express = require('express');
const app = express();
const sqlite3 = require('sqlite3')

const port = 3000;

// MAKE SURE YOU CONNECT TO THE RIGHT DATABASE WHEN USING SQLITE3 TERMINAL
let db = new sqlite3.Database("mydatabase.db",  (err) => {
  if(err){
    console.log('Error Occured - ' + err.message)
  }
  else{
    console.log('Database connected')
  }
});

app.use(express.json());
app.use(express.static('public'));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

function validateCreds(email, password, callback) {
  const query = "SELECT password FROM students WHERE email = ? COLLATE NOCASE;";
  db.all(query, [email], (err, rows) => {
      //console.log(`Query: ${query}`);
      //console.log(`Query parameters: ${JSON.stringify([email])}`);
      //console.log(`Query result: ${JSON.stringify(rows)}`);
      if (err) {
          console.error(`Error: ${err}`);
          callback(false, err);
      } else if (rows.length === 0) {
          console.log(`Email not found: ${email}`);
          callback(false, "Email not found");
      } else {
          console.log(`Password: ${rows[0].password}`);
          if (rows[0].password === password) {
              console.log(`Login successful!`);
              callback(true, null);
          } else {
              console.log(`Incorrect password`);
              callback(false, "Incorrect password");
          }
      }
  });
}

app.get('/api/test', (req, res) => {
  res.json({ message: 'Yes the API works' });
});

app.post('/api/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  validateCreds(email, password, (authorized, error) => {
    if (authorized) {
      res.json({ authorized: true });
      //console.log('authorized set to true')
    } else {
      res.status(401).json({ authorized: false, error: error });
      //console.log('validateCreds returned false')
    }
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

process.on('SIGINT', () => {
  db.close((err) => {
      if (err) {
          console.error('Error closing database:', err);
      }
      console.log('Database closed');
      process.exit(0);
  });
});