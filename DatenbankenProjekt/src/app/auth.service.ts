import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false; // Variable, um den Anmeldestatus des Benutzers zu speichern
  private tokenKey = 'auth_token'; // Schlüssel, um das Token in localStorage zu speichern

  constructor(private router: Router) {
    // Konstruktor wird verwendet, um die Router-Instanz zu injizieren
  }

  // Methode, um zu überprüfen, ob der Benutzer eingeloggt ist
  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  // Methode, um den Benutzer einzuloggen und das Token in localStorage zu speichern
  login(token: string): void {
    this.loggedIn = true;
    localStorage.setItem(this.tokenKey, token); // Token in localStorage speichern
  }

  // Methode, um den Benutzer auszuloggen und das Token aus localStorage zu entfernen
  logout(): void {
    this.loggedIn = false;
    localStorage.removeItem(this.tokenKey); // Token aus localStorage entfernen
    this.router.navigate(['/user-login']); // Benutzer zur Login-Seite umleiten
  }

  // Methode, um das gespeicherte Token aus localStorage abzurufen
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
