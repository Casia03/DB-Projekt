// set up ======================== 
var express = require('express');
var app = express();                               // create our app w/ express 
var path = require('path');
var mysql = require('mysql2');
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); // fur tokens damit die user session nicht nach einem einfachen refresh verloren geht, implementiere spaeter

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

//Ein Film
app.get('/film/:id', function (req, res) {
    const filmId = req.params.id;
    const filmQuery = `
        SELECT film.*, image.link AS image_link
        FROM film
        LEFT JOIN image ON film.image_nr = image.image_id
        WHERE film.film_id = ?
    `;

    const categoryQuery = `
        SELECT category.name
        FROM category
        JOIN film_category ON category.category_id = film_category.category_id
        WHERE film_category.film_id = ?
    `;

    con.query(filmQuery, [filmId], function (err, filmResults) {
        if (err) {
            console.error("Error fetching film:", err);
            res.status(500).send("Error fetching film");
        } else if (filmResults.length > 0) {
            const film = filmResults[0];
            film.image_url = film.image_link ? `/assets/pictures/${film.image_link}` : `/assets/pictures/default.jpg`;

            con.query(categoryQuery, [filmId], function (err, categoryResults) {
                if (err) {
                    console.error("Error fetching film categories:", err);
                    res.status(500).send("Error fetching film categories");
                } else {
                    film.categories = categoryResults.map(category => category.name);
                    res.send(film);
                }
            });
        } else {
            res.status(404).send("Film not found");
        }
    });
});


// Alle Filme
app.get('/film-list', function (req, res) {
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

//Filme nach Jahr
app.get('/api/films/year/:year', function (req, res) {
    const year = req.params.year;
    const query = `
        SELECT film.*, image.link AS image_link
        FROM film
        LEFT JOIN image ON film.image_nr = image.image_id
        WHERE film.release_year = ?
    `;

    con.query(query, [year], function (err, results) {
        if (err) {
            console.error("Error fetching films by year:", err);
            res.status(500).send("Error fetching films by year");
        } else {
            results.forEach(film => {
                if (film.image_link) {
                    film.image_url = `/assets/pictures/${film.image_link}`;
                } else {
                    film.image_url = `/assets/pictures/default.jpg`; // Fallback for no image
                }
            });

            res.send(results);
        }
    });
});

//Filme von Jahr bis Jahr
app.get('/api/films/year-range/:startYear/:endYear', function (req, res) {
    const startYear = req.params.startYear;
    const endYear = req.params.endYear;
    const query = `
        SELECT film.*, image.link AS image_link
        FROM film
        LEFT JOIN image ON film.image_nr = image.image_id
        WHERE film.release_year BETWEEN ? AND ?
    `;

    con.query(query, [startYear, endYear], function (err, results) {
        if (err) {
            console.error("Error fetching films by year range:", err);
            res.status(500).send("Error fetching films by year range");
        } else {
            results.forEach(film => {
                if (film.image_link) {
                    film.image_url = `/assets/pictures/${film.image_link}`;
                } else {
                    film.image_url = `/assets/pictures/default.jpg`; // Fallback for no image
                }
            });

            res.send(results);
        }
    });
});

// Filme nach Rating
app.get('/api/films/rating/:rating', function (req, res) {
    const rating = req.params.rating;
    const query = `
        SELECT film.*, image.link AS image_link
        FROM film
        LEFT JOIN image ON film.image_nr = image.image_id
        WHERE film.rating = ?
    `;

    con.query(query, [rating], function (err, results) {
        if (err) {
            console.error("Error fetching films by rating:", err);
            res.status(500).send("Error fetching films by rating");
        } else {
            results.forEach(film => {
                film.image_url = film.image_link ? `/assets/pictures/${film.image_link}` : `/assets/pictures/default.jpg`;
            });

            res.send(results);
        }
    });
});

// Filme nach Kategorie
app.get('/api/films/category/:categoryId', function (req, res) {
    const categoryId = req.params.categoryId;
    const query = `
        SELECT film.*, image.link AS image_link
        FROM film
        LEFT JOIN image ON film.image_nr = image.image_id
        INNER JOIN film_category ON film.film_id = film_category.film_id
        WHERE film_category.category_id = ?
    `;

    con.query(query, [categoryId], function (err, results) {
        if (err) {
            console.error("Error fetching films by category:", err);
            res.status(500).send("Error fetching films by category");
        } else {
            results.forEach(film => {
                if (film.image_link) {
                    film.image_url = `/assets/pictures/${film.image_link}`;
                } else {
                    film.image_url = `/assets/pictures/default.jpg`; // Fallback for no image
                }
            });

            res.send(results);
        }
    });
});


// Erstellen von Filmlisten
app.post('/api/list-creator/create', function (req, res) {

    // if (!req.session.userID) {
    //     return res.status(401).json({ message: "Unauthorized." });
    // }

    const { listname } = req.body;
    const userID = 1; // Feste NutzerID für Testzwecke
    const query = "INSERT INTO liste (listname, NutzerID) VALUES (?, ?)";
    con.query(query, [listname, userID], function (err, results) {
        if (err) {
            console.error("Error creating list:", err);
            res.status(500).json({ message: "List creation failed." });
        } else {
            console.log("List created successfully");
            res.status(200).json({ ListenID: results.insertId, message: "List created successfully." });
        }
    });
});

// Lade die Listen der Eingeloggte Nutzers
app.get('/api/user-lists', function (req, res) {
    //const userID = req.session.userID; // NutzerID aus der Session holen
    
    //if (!userID) {
    //    return res.status(401).json({ message: "Unauthorized." });
    //}
    
    const userID = 1; // Feste NutzerID für Testzwecke
    const query = "SELECT * FROM liste WHERE NutzerID = ?";
    con.query(query, [userID], function (err, results) {
        if (err) {
            console.error("Error fetching user lists:", err);
            res.status(500).json({ message: "Failed to fetch user lists." });
        } else {
            res.status(200).json(results);
        }
    });
});

// Filme zur Liste hinzufügen
app.post('/api/list-creator/add-films', function (req, res) {
    const { listId, filmIds } = req.body;

    if (!listId || !Array.isArray(filmIds)) {
        console.error("Invalid input data:", { listId, filmIds });
        return res.status(400).json({ message: "Invalid input data." });
    }

    // Konvertiere die filmIds zu SMALLINT, falls erforderlich
    const values = filmIds.map(filmId => [listId, parseInt(filmId)]);

    const query = "INSERT INTO listenfilme (ListenID, film_id) VALUES ?";
    con.query(query, [values], function (err, results) {
        if (err) {
            console.error("Error adding films to list:", err);
            res.status(500).json({ message: "Failed to add films to list." });
        } else {
            console.log("Films added to list successfully");
            res.status(200).json({ message: "Films added to list successfully." });
        }
    });
});

// Liste löschen
app.delete('/api/list-creator/delete/:listId', function (req, res) {
    const listId = req.params.listId;
    const query = "DELETE FROM liste WHERE ListenID = ?";

    con.query(query, [listId], function (err, results) {
        if (err) {
            console.error("Error deleting list:", err);
            res.status(500).json({ message: "Failed to delete list." });
        } else {
            res.status(200).json({ message: "List deleted successfully." });
        }
    });
});

// Film aus Liste entfernen
app.post('/api/list-creator/remove-film', function (req, res) {
    const { listId, filmId } = req.body;
    const query = "DELETE FROM listenfilme WHERE ListenID = ? AND film_id = ?";

    con.query(query, [listId, filmId], function (err, results) {
        if (err) {
            console.error("Error removing film from list:", err);
            res.status(500).json({ message: "Failed to remove film from list." });
        } else {
            res.status(200).json({ message: "Film removed from list successfully." });
        }
    });
});

// Filme einer Liste abrufen
app.get('/api/list-creator/list-films/:listId', function (req, res) {
    const listId = req.params.listId;
    const query = `
        SELECT film.film_id, film.title, film.description, image.link AS image_link
        FROM film
        JOIN listenfilme ON film.film_id = listenfilme.film_id
        LEFT JOIN image ON film.image_nr = image.image_id
        WHERE listenfilme.ListenID = ?
    `;

    con.query(query, [listId], function (err, results) {
        if (err) {
            console.error("Error fetching films in list:", err);
            res.status(500).json({ message: "Failed to fetch films in list." });
        } else {
            res.status(200).json(results);
        }
    });
});




// Registration 
app.post('/api/register', function (req, res) {
    const { username, email, password } = req.body;
    const query = "INSERT INTO nutzer (Nutzername, Email, Passwort) VALUES (?, ?, ?)";
    con.query(query, [username, email, password], function (err, results) {
        if (err) {
            console.error("Error registering user:", err);
            res.status(500).json({ message: "Registration failed." }); // Rückgabe im JSON-Format
        } else {
            console.log("User registered successfully");
            res.status(200).json({ message: "Registration successful." }); // Rückgabe im JSON-Format
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

app.get('/api/listen', function (req, res) {
    const query = `
        SELECT liste.* from liste
    `;

    con.query(query, function (err, results) {
        if (err) {
            console.error("Error fetching list:", err);
            res.status(500).send("Error fetching list");
        } else {
            
            res.send(results);
        }
    });
});

app.get('/api/listeninhalt/:ListenID', function (req, res) {
    const ListenID = req.params.ListenID;
    const query = ` SELECT film.*, image.link AS image_link from film 

        INNER JOIN listenfilme ON film.film_id = listenfilme.film_id
        LEFT JOIN image ON film.image_nr = image.image_id
        WHERE listenfilme.ListenID =?
    `;

    con.query(query,[ListenID], function (err, results) {
        if (err) {
            console.error("Error fetching list:", err);
            res.status(500).send("Error fetching list");
        } else {
            
            res.send(results);
        }
    });
});


// // fur tokens
// app.post('/api/login', (req, res) => {
//     const { username, password } = req.body;
//     // Replace this with actual authentication logic
//     if (username === 'Nutzername' && password === 'Passwort') {
//       // Return a fake token for demonstration
//       const token = 'your-jwt-token';
//       res.json({ token });
//     } else {
//       res.status(401).json({ message: 'Invalid credentials' });
//     }
//   });
  