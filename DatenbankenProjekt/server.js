// set up ======================== 
var express = require('express');
var app = express();                               // create our app w/ express 
var path = require('path');
var mysql = require('mysql2');
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); // fur tokens damit die user session nicht nach einem einfachen refresh verloren geht, implementiere spaeter
const secretKey = "bomba";

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

// application -------------------------------------------------------------


// listen (start app with node server.js) ======================================
app.listen(8080, function () {
    console.log("App listening on port 8080");
});

// Middleware to verify token
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        console.log("No authorization header");
        return res.status(401).json({ message: 'No token provided.' });
    }

    const token = authHeader.split(' ')[1]; // Handle 'Bearer ' prefix

    if (!token) {
        console.log("No token found after Bearer");
        return res.status(401).json({ message: 'No token provided.' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.log("Failed to verify token:", err);
            return res.status(401).json({ message: 'Failed to authenticate token.' });
        }
        console.log("Token verified successfully, decoded payload:", decoded);
        req.user = decoded; // Attach decoded payload to request object
        next();
    });
}

//Ein Film
app.get('/api/film/:id', function (req, res) {
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


app.get('/api/film-list', function (req, res) {
    const query = `
        SELECT film.*, image.link AS image_link 
        FROM film 
        LEFT JOIN image ON film.image_nr = image.image_id
        ORDER BY film.title ASC
    `;

    con.query(query, function (err, results) {
        if (err) {
            console.error("Error fetching films:", err);
            res.status(500).send("Error fetching films");
        } else {
            console.log(results);

            // Processing the results: Creating the image_url for each film object
            results.forEach(film => {
                if (film.image_link) {
                    film.image_url = `/assets/pictures/${film.image_link}`;
                } else {
                    film.image_url = `/assets/pictures/default.jpg`; // Fallback if no image available
                }
            });

            // Sending the processed results to the Angular application
            res.status(200).json(results);
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
    const userID = req.user.NutzerID; // Get user ID from token

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

// Getter von Nutzererstellter Listen (protected blabla)    
app.get('/api/user-lists', verifyToken, function (req, res) {
    const userID = req.user.NutzerID; // Get user ID from token payload

    console.log("Fetching user lists for user ID:", userID); // Debug log

    const query = "SELECT * FROM liste WHERE NutzerID = ?";
    con.query(query, [userID], function (err, results) {
        if (err) {
            console.error("Error fetching user lists:", err);
            res.status(500).json({ message: "Failed to fetch user lists." });
        } else {
            console.log("User lists fetched successfully:", results); // Debug log
            res.status(200).json(results);
        }
    });
});



// Filme zur Liste hinzufügen (protected route)
app.post('/api/list-creator/add-films', verifyToken, function (req, res) {
    const { listId, filmIds } = req.body;
    const userId = req.user.NutzerID; // Get user ID from token

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
    const userId = req.user.NutzerID; // Get user ID from token

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
    const userId = req.user.NutzerID; // Extract the user ID from the verified token

    // Query to check if the user is the creator of the list
    const checkCreatorQuery = "SELECT * FROM liste WHERE ListenID = ? AND NutzerID = ?";

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

app.get('/api/listen', function (req, res) {
    const query = `
        SELECT liste.*, nutzer.Nutzername
        FROM liste
        JOIN nutzer ON liste.NutzerID = nutzer.NutzerID
        ORDER BY liste.listname ASC
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
        ORDER BY film.title ASC
    `;

    con.query(query, [ListenID], function (err, results) {
        if (err) {
            console.error("Error fetching list:", err);
            res.status(500).send("Error fetching list");
        } else {

            res.send(results);
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

app.post('/api/update-username', verifyToken, (req, res) => {
    const { newUsername } = req.body;
    const userId = req.user.NutzerID;

    // Perform the update in the database
    const query = 'UPDATE nutzer SET Nutzername = ? WHERE NutzerID = ?';
    con.query(query, [newUsername, userId], (error, results) => {
        if (error) {
            console.error('Error updating username:', error);
            return res.status(500).json({ message: 'Error updating username' });
        }

        // Assuming update successful, now re-generate the JWT token
        const getUserQuery = 'SELECT NutzerID, Nutzername, Email FROM nutzer WHERE NutzerID = ?';
        con.query(getUserQuery, [userId], (error, results) => {
            if (error) {
                console.error('Error retrieving updated user info:', error);
                return res.status(500).json({ message: 'Error retrieving updated user info' });
            }

            const user = results[0];
            const payload = { NutzerID: user.NutzerID, Nutzername: user.Nutzername, Email: user.Email };

            // Generate new token with updated user info
            jwt.sign(payload, secretKey, { expiresIn: '1h' }, (err, token) => {
                if (err) {
                    console.error("Error generating token:", err);
                    return res.status(500).json({ message: "Error generating token" });
                }
                return res.json({ token, user }); // Return the new token and user info
            });
        });
    });
});

app.post('/api/update-email', verifyToken, (req, res) => {
    const { newEmail } = req.body;
    const userId = req.user.NutzerID;
  
    // Perform the update in the database
    const query = 'UPDATE nutzer SET Email = ? WHERE NutzerID = ?';
    con.query(query, [newEmail, userId], (error, results) => {
      if (error) {
        console.error('Error updating email:', error);
        return res.status(500).json({ message: 'Error updating email' });
      }
  
      // Assuming update successful, now re-generate the JWT token
      const getUserQuery = 'SELECT NutzerID, Nutzername, Email FROM nutzer WHERE NutzerID = ?';
      con.query(getUserQuery, [userId], (error, results) => {
        if (error) {
          console.error('Error retrieving updated user info:', error);
          return res.status(500).json({ message: 'Error retrieving updated user info' });
        }
  
        const user = results[0];
        const payload = { NutzerID: user.NutzerID, Nutzername: user.Nutzername, Email: user.Email };
  
        // Generate new token with updated user info
        jwt.sign(payload, secretKey, { expiresIn: '1h' }, (err, token) => {
          if (err) {
            console.error("Error generating token:", err);
            return res.status(500).json({ message: "Error generating token" });
          }
          return res.json({ token, user }); // Return the new token and user info
        });
      });
    });
  });
  
  app.post('/api/update-password', verifyToken, (req, res) => {
    const { Passwort } = req.body;
    const userId = req.user.NutzerID;

    con.query('UPDATE nutzer SET Passwort = ? WHERE NutzerID = ?', [Passwort, userId], (error, results) => {
        if (error) {
            console.error('Error updating password:', error);
            res.status(500).json({ message: 'Error updating password' });
        } else {
            res.status(200).json({ message: 'Password updated successfully' });
        }
    });
});


// Login, returns Nutzername Email NutzerID as payload for further website logic.
app.post('/api/login', function (req, res) {
    const { username, password } = req.body;
    const query = "SELECT NutzerID, Nutzername, Email FROM nutzer WHERE Nutzername = ? AND Passwort = ?";

    con.query(query, [username, password], function (err, results) {
        if (err) {
            console.log("Login failed");
            console.error("Error during login:", err);
            return res.status(500).json({ message: "Login failed." });
        }

        if (results.length > 0) {
            console.log(results);
            console.log("Login successful");
            // User found, generate JWT token
            const user = results[0];
            const payload = { NutzerID: user.NutzerID, Nutzername: user.Nutzername, Email: user.Email };
            jwt.sign(payload, secretKey, { expiresIn: '1h' }, (err, token) => {
                if (err) {
                    console.error("Error generating token:", err);
                    return res.status(500).json({ message: "Error generating token" });
                }
                //console.log({ token });
                return res.json({ token }); // Return the token

            });
        } else {
            console.log("Invalid username or password");
            return res.status(401).json({ message: "Invalid username or password." });
        }
    });
});




// Logout rute, token loeschen
app.post('/api/logout', verifyToken, function (req, res) {
    const token = req.headers['authorization'].split(' ')[1];
    tokenBlacklist.push(token); // schwarze liste, nicht sicher ob noetig
    res.status(200).json({ message: 'Logged out successfully.' });
});


app.get('/api/user-info', verifyToken, (req, res) => {
    const user = {
        Nutzername: req.user.Nutzername,
        Email: req.user.Email, 
    };
    res.status(200).json(user);
});





app.get('/', function (req, res) {
    //res.send("Hello World123");     
    res.sendFile('index.html', { root: __dirname + '/dist/datenbanken-projekt/browser' });
});

app.get('*', function (req, res) {
    res.sendFile('index.html', { root: path.join(__dirname, 'dist/datenbanken-projekt/browser') });
});