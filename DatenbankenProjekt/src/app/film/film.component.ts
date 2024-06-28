import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-film',
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.css']
})
export class FilmComponent implements OnInit {
  isSidebarOpen = false;
  film: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadFilm(); // Call loadFilm on component initialization
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  loadFilm() {
    const filmId = this.route.snapshot.paramMap.get('id'); // Film-ID aus der URL holen

    this.http.get<any>(`/film/${filmId}`).subscribe(
      (film: any) => {
        console.log(film);
        this.film = film;
        this.film.image_url = `/assets/pictures/${film.image_link}`; // Anpassen der Bild-URL
      },
      (error: HttpErrorResponse) => {
        console.error('Error loading film:', error);
      }
    );
  }

}
/*
//vasia hier sind die plazhalte der funktionen die wir brauchen man muss schauen ob das funktioniert 
//aber so inderart sollte es sein
const mysql = require('mysql');

// Konfiguriere die Datenbankverbindung
//bin mir nicht sicher ob man das in unserer umgebung braucht
const connection = mysql.createConnection({
    host: 'localhost', // dein Hostname
    user: 'dein_benutzername', // dein Datenbankbenutzername
    password: 'dein_passwort', // dein Datenbankpasswort
    database: 'deine_datenbank' // dein Datenbankname
});

// Verbinde zur Datenbank
connection.connect((err) => {
    if (err) {
        console.error('Fehler beim Verbinden zur Datenbank:', err.stack);
        return;
    }
    console.log('Verbunden zur Datenbank als ID', connection.threadId);
});

// Funktion zum Abrufen der Bilder
function getBilder(callback) {
    const query = 'SELECT name, beschreibung, tags FROM film'; // Passe den Tabellennamen und die Spalten an
    connection.query(query, (error, results) => {
        if (error) {
            return callback(error, null);
        }
        return callback(null, results);
    });
}
// Verbinde zur Datenbank
connection.connect((err) => {
    if (err) {
        console.error('Fehler beim Verbinden zur Datenbank:', err.stack);
        return;
    }
    console.log('Verbunden zur Datenbank als ID', connection.threadId);
});

// Funktion zum Abrufen der Namen
function getName(callback) {
    const query = 'SELECT name FROM film'; // Passe den Tabellennamen an
    connection.query(query, (error, results) => {
        if (error) {
            return callback(error, null);
        }
        return callback(null, results);
    });
}

// Funktion zum Abrufen der Beschreibungen
function getBeschreibung(callback) {
    const query = 'SELECT beschreibung FROM film'; // Passe den Tabellennamen an
    connection.query(query, (error, results) => {
        if (error) {
            return callback(error, null);
        }
        return callback(null, results);
    });
}

// Funktion zum Abrufen der Tags
function getTags(callback) {
    const query = 'SELECT tags FROM film'; // Passe den Tabellennamen an
    connection.query(query, (error, results) => {
        if (error) {
            return callback(error, null);
        }
        return callback(null, results);
    });
}

// Funktion zum Abrufen des Namens eines bestimmten Benutzers
function getNameUser(userId, callback) {
  const query = 'SELECT name FROM users WHERE id = ?'; // Passe den Tabellennamen und die Spalte an
  connection.query(query, [userId], (error, results) => {
      if (error) {
          return callback(error, null);
      }
      return callback(null, results);
  });
}

// Funktion zum Abrufen der Liste aller Benutzer
function getListUser(callback) {
  const query = 'SELECT id, name FROM users'; // Passe den Tabellennamen und die Spalten an
  connection.query(query, (error, results) => {
      if (error) {
          return callback(error, null);
      }
      return callback(null, results);
  });
}






// Exportiere die Funktion für die Verwendung in anderen Dateien
module.exports = {
    getBilder,
    getName,
    getBeschreibung,
    getTags,
    getNameUser,
    getListUser
};
*/
