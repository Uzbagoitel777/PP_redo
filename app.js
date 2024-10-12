const express = require('express');
const app = express();
const sqlite3 = require('sqlite3')
const bcrypt = require('bcrypt');
const saltRounds = 11;

const port = 3000;

// MAKE SURE YOU CONNECT TO THE RIGHT DATABASE WHEN USING THE SQLITE3 TERMINAL
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
  db.get(query, [email], (err, row) => {
      //console.log(`Query: ${query}`);
      //console.log(`Query parameters: ${JSON.stringify([email])}`);
      //console.log(`Query result: ${JSON.stringify(rows)}`);
      if (err) {
          console.error(`Error: ${err}`);
          callback(false, err);
      } else if (!row) {
          console.log(`Email not found: ${email}`);
          callback(false, "Email not found");
      } else {
        bcrypt.compare(password, row.password, (err, result) =>{
          if (err) {
            console.error(err);
            callback(false, err);
          }
          console.log(`Password: ${row.password}`);
          if (result) {
              console.log(`Login successful!`);
              callback(true, null);
          } else {
              console.log(`Incorrect password`);
              callback(false, "Incorrect password");
          }
        });
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

app.post('/api/register', (req, res) => {
  const {email, password, firstName, surname, paternalName, academicYear} = req.body;
  if (!email || !password || !firstName){
    return res.status(400).json({success: false, error: 'Missing required fields'});
  }

  const checkEmailQuery = "SELECT email FROM students WHERE email = ?";
  db.get(checkEmailQuery, [email], (err, row) =>{
    if (err) {
        console.log(err);
        return res.status(500).json({success: false,  error: 'Database error'});
    }
    if (row){
      return res.status(409).json({success: false, error: 'Email already exists'});
    }

    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ success: false, error: 'Password hashing failed' });
      }

      const insertQuery = `
          INSERT INTO students (email, password, firstName, surname, paternalName, year) 
          VALUES (?, ?, ?, ?, ?, ?)
      `;
      db.run(insertQuery, [email, hash, firstName, surname, paternalName, academicYear], function(err) {
          if (err) {
              console.error(err);
              return res.status(500).json({ success: false, error: 'Database error' });
          }
          res.json({ success: true, message: 'Registration successful' });
      });
  });
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