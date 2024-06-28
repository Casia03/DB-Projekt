// set up ======================== 
var express = require('express');
var app = express();                               // create our app w/ express 
var path = require('path');
var mysql = require('mysql2');
var bodyParser = require('body-parser');

const con = mysql.createConnection({
    database: "sakila",
    host: "localhost",
    user: "root",
    password: "1231"
});

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// configuration =================
app.use(express.static(path.join(__dirname, '/dist/datenbanken-projekt/browser')));

// listen (start app with node server.js) ======================================
app.listen(8080, function () {
    console.log("App listening on port 8080");
});

// application -------------------------------------------------------------
app.get('/', function (req, res) {
    //res.send("Hello World123");     
    res.sendFile('index.html', { root: __dirname + '/dist/datenbanken-projekt/browser' });
});

app.get('/home-page', function (req, res) {
    res.sendFile('index.html', { root: __dirname + '/dist/datenbanken-projekt/browser' });
});

// Fetch films with image URLs
app.get('/film', function (req, res) {
    con.query("SELECT film.*, image.link AS image_link FROM film LEFT JOIN image ON film.image_nr = image.image_id", function (err, results) {
        if (err) {
            console.error("Error fetching films:", err);
            res.status(500).send("Error fetching films");
        } else {
            console.log(results);

            // Verarbeitung der Ergebnisse: Erstellen der image_url für jedes Film-Objekt
            results.forEach(film => {
                if (film.image_link) {
                    film.image_url = `/assets/pictures/${film.image_link}`;
                } else {
                    film.image_url = `/assets/pictures/default.jpg`; // Fallback für den Fall, dass kein Bild verfügbar ist
                }
            });

            // Senden der verarbeiteten Ergebnisse an die Angular-Anwendung
            res.send(results);
        }
    });
});

app.get('/film/:id', function (req, res) {
    const filmId = req.params.id;
    const query = `
        SELECT film.*, image.link AS image_link
        FROM film
        LEFT JOIN image ON film.image_nr = image.image_id
        WHERE film.film_id = ?
    `;

    con.query(query, [filmId], function (err, results) {
        if (err) {
            console.error("Error fetching film:", err);
            res.status(500).send("Error fetching film");
        } else if (results.length > 0) {
            const film = results[0];
            film.image_url = film.image_link ? `/assets/pictures/${film.image_link}` : `/assets/pictures/default.jpg`;
            res.send(film);
        } else {
            res.status(404).send("Film not found");
        }
    });
});

// Registration 
app.post('/api/register', function (req, res) {
    const { username, email, password } = req.body;
    const query = "INSERT INTO nutzer (Nutzername, Email, Passwort) VALUES (?, ?, ?)";
    con.query(query, [username, email, password], function (err, results) {
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

// Login 
app.post('/api/login', function (req, res) {
    const { username, password } = req.body;
    const query = "SELECT * FROM nutzer WHERE Nutzername = ? AND Passwort = ?";
    con.query(query, [username, password], function (err, results) {
        if (err) {
            console.log("Login failed");
            console.error("Error during login:", err);
            res.status(500).json({ message: "Login failed." });
        } else if (results.length > 0) {
            console.log("Login successful");
            res.status(200).json({ message: "Login successful." });
        } else {
            console.log("Invalid username or password");
            res.status(401).json({ message: "Invalid username or password." });
        }
    });
});