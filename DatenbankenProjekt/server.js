 // set up ======================== 
var express  = require('express'); 
var app      = express();                               // create our app w/ express 
var path     = require('path'); 
var mysql    = require('mysql2');
 
bodyParser = require('body-parser');


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



/*app.get('/film', function(req,res) {
      const con = mysql.createConnection({
            database: "sakila",
            host: "localhost",
            user: "root",
            password: "passwort"
      }) ;

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
});*/