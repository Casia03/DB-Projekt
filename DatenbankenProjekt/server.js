 // set up ======================== 
var express  = require('express'); 
var app      = express();                               // create our app w/ express 
var path     = require('path'); 
var mysql    = require('mysql2');
var bodyParser = require('body-parser');

const con = mysql.createConnection({
      database: "sakila",
      host: "localhost",
      user: "root",
      password: "vNikopolidis290803-_"
}) ;

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

 // configuration =================
app.use(express.static(path.join(__dirname, '/dist/datenbanken-projekt/browser')));  
 
 // listen (start app with node server.js) ======================================
app.listen(8080, function(){    
     console.log("App listening on port 8080");
});

 // application -------------------------------------------------------------
app.get('/', function(req,res) 
{     
      //res.send("Hello World123");     
      res.sendFile('index.html', { root: __dirname+'/dist/datenbanken-projekt/browser' });    
});

app.get('/home-page', function(req,res) {
      res.sendFile('index.html', { root: __dirname+'/dist/datenbanken-projekt/browser' });
});



app.get('/film', function(req,res) {
      con.connect(function(err) {
            if(err) throw err;
            con.query("SELECT * FROM film WHERE image_nr=14", function(err, results) {
                  if(err) throw err;
                  console.log(results);
                  res.send(results);
                  con.end(function(err) {
                        if(err) throw err;
                        console.log("Disconnected");
                  });
            })
      })
});

// Registration route
app.post('/api/register', function(req, res) {
      console.log("Garnichtmal hier gelandet")
      const { username, email, password } = req.body;
      const query = "INSERT INTO nutzer (Nutzername, Email, Passwort) VALUES (?, ?, ?)";
      con.query(query, [username, email, password], function(err, results) {
          if (err) {
              console.log("Nicht registriert")
              console.error("Error registering user:", err);
              res.status(500).send("Registration failed.");
          } else {
              console.log("Registriert")
              res.status(200).send("Registration successful.");
          }
      });
  });
  
  // Login route
app.post('/api/login', function(req, res) {
      const { username, password } = req.body;
      const query = "SELECT * FROM nutzer WHERE Nutzername = ? AND Passwort = ?";
      con.query(query, [username, password], function(err, results) {
          if (err) {
              console.error("Error during login:", err);
              res.status(500).send("Login failed.");
          } else if (results.length > 0) {
              res.status(200).send("Login successful.");
          } else {
              res.status(401).send("Invalid username or password.");
          }
      });
  });