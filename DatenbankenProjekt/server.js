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
    password: "123451"
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


// Erstellen von Filmlisten (protected route)
app.post('/api/list-creator/create', verifyToken, function (req, res) {
    const { listname } = req.body;
    const userID = req.user.id; // Get user ID from token

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

app.get('/api/user-lists', verifyToken, function (req, res) {
    const userID = req.user.id; // Get user ID from token

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


// Filme zur Liste hinzufügen (protected route)
app.post('/api/list-creator/add-films', verifyToken, function (req, res) {
    const { listId, filmIds } = req.body;
    const userId = req.user.id; // Get user ID from token

    if (!listId || !Array.isArray(filmIds)) {
        console.error("Invalid input data:", { listId, filmIds });
        return res.status(400).json({ message: "Invalid input data." });
    }

    // Check if the user is the creator of the list
    const checkCreatorQuery = "SELECT * FROM liste WHERE ListenID = ? AND NutzerID = ?";
    con.query(checkCreatorQuery, [listId, userId], function (err, results) {
        if (err) {
            console.error("Error verifying list creator:", err);
            return res.status(500).json({ message: "Failed to verify list creator." });
        }

        if (results.length === 0) {
            return res.status(403).json({ message: "You do not have permission to edit this list." });
        }

        // User is the creator, proceed to add films to the list
        const values = filmIds.map(filmId => [listId, parseInt(filmId)]);
        const query = "INSERT INTO listenfilme (ListenID, film_id) VALUES ?";
        con.query(query, [values], function (err, results) {
            if (err) {
                console.error("Error adding films to list:", err);
                return res.status(500).json({ message: "Failed to add films to list." });
            } else {
                console.log("Films added to list successfully");
                return res.status(200).json({ message: "Films added to list successfully." });
            }
        });
    });
});


// Liste löschen (protected route)
app.delete('/api/list-creator/delete/:listId', verifyToken, function (req, res) {
    const listId = req.params.listId;
    const userId = req.user.id; // Get user ID from token

    // Check if the user is the creator of the list
    const checkCreatorQuery = "SELECT * FROM liste WHERE ListenID = ? AND NutzerID = ?";
    con.query(checkCreatorQuery, [listId, userId], function (err, results) {
        if (err) {
            console.error("Error verifying list creator:", err);
            return res.status(500).json({ message: "Failed to verify list creator." });
        }

        if (results.length === 0) {
            return res.status(403).json({ message: "You do not have permission to delete this list." });
        }

        // User is the creator, proceed to delete the list
        const query = "DELETE FROM liste WHERE ListenID = ?";
        con.query(query, [listId], function (err, results) {
            if (err) {
                console.error("Error deleting list:", err);
                return res.status(500).json({ message: "Failed to delete list." });
            } else {
                return res.status(200).json({ message: "List deleted successfully." });
            }
        });
    });
});


// Film aus Liste entfernen (protected route)
app.post('/api/list-creator/remove-film', verifyToken, function (req, res) {
    const { listId, filmId } = req.body;
    const userId = req.user.id; // Extract the user ID from the verified token

    // Query to check if the user is the creator of the list
    const checkCreatorQuery = "SELECT * FROM listen WHERE ListenID = ? AND NutzerID = ?";

    con.query(checkCreatorQuery, [listId, userId], function (err, results) {
        if (err) {
            console.error("Error verifying list creator:", err);
            return res.status(500).json({ message: "Failed to verify list creator." });
        }

        if (results.length === 0) {
            // User is not the creator of the list
            return res.status(403).json({ message: "You do not have permission to edit this list." });
        }

        // User is the creator, proceed to remove the film from the list
        const removeFilmQuery = "DELETE FROM listenfilme WHERE ListenID = ? AND film_id = ?";

        con.query(removeFilmQuery, [listId, filmId], function (err, results) {
            if (err) {
                console.error("Error removing film from list:", err);
                return res.status(500).json({ message: "Failed to remove film from list." });
            } else {
                return res.status(200).json({ message: "Film removed from list successfully." });
            }
        });
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
            return res.status(500).json({ message: "Login failed." });
        }

        if (results.length > 0) {
            console.log("Login successful");
            // User found, generate JWT token
            const user = results[0];
            const payload = { NutzerID: user.NutzerID, Nutzername: user.Nutzername }; // Make sure to use the correct fields from the database
            const secretKey = "bomba";
            jwt.sign(payload, secretKey, { expiresIn: '1h' }, (err, token) => {
                if (err) {
                    console.error("Error generating token:", err);
                    return res.status(500).json({ message: "Error generating token" });
                }
                return res.json({ token }); // Return the token
            });
        } else {
            console.log("Invalid username or password");
            return res.status(401).json({ message: "Invalid username or password." });
        }
    });
});

// Middleware to verify token

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    const token = authHeader.split(' ')[1]; // Handle 'Bearer ' prefix

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token.' });
        }
        req.user = decoded; // Attach decoded payload to request object
        next();
    });
}


