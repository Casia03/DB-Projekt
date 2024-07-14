import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User, UpdateResponse } from './user.model'; // Import der Schnittstellen

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {
  private tokenKey = 'auth_token'; // Schlüssel zur Speicherung des Tokens in localStorage
  private user: User | null = null; // Lokale Speicherung der Benutzerinformation

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    // Beim Initialisieren prüfen, ob der Benutzer eingeloggt ist, und Benutzerinformationen abrufen
    if (this.isLoggedIn()) {
      this.getUserInfo().subscribe(
        user => {
          this.user = user; // Benutzerinformationen lokal speichern
        },
        error => {
          console.error('Fehler beim Abrufen der Benutzerinformationen beim Starten', error);
          this.logout(); // Bei Fehlern ausloggen
        }
      );
    }
  }

  login(token: string): void {
    // Token im localStorage speichern und Benutzerinformationen abrufen
    localStorage.setItem(this.tokenKey, token);
    this.getUserInfo().subscribe(
      user => {
        this.user = user; // Benutzerinformationen lokal speichern
      },
      error => {
        console.error('Fehler beim Abrufen der Benutzerinformationen nach dem Login', error);
      }
    );
  }

  getToken(): string | null {
    // Token aus localStorage abrufen
    return localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    // Token aus localStorage entfernen und Benutzerinformationen löschen
    localStorage.removeItem(this.tokenKey);
    this.user = null;
    this.router.navigate(['/login']); // Zur Login-Seite navigieren
  }

  isLoggedIn(): boolean {
    // Prüfen, ob ein gültiges Token vorhanden ist
    return this.getToken() !== null;
  }
  
  getUserInfo(): Observable<User> {
    // Benutzerinformationen abrufen
    const token = this.getToken();
    if (!token) {
      return throwError('Kein Token gefunden');
    }
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<User>('/api/user-info', { headers }).pipe(
      tap(user => this.user = user), // Benutzerinformationen lokal speichern
      catchError(this.handleError)
    );
  }

  updateUsername(newUsername: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError('Kein Token gefunden');
    }
  
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<{ token: string, user: User }>('/api/update-username', { newUsername }, { headers }).pipe(
      tap((response: { token: string, user: User }) => {
        // Update local token and user information
        localStorage.setItem(this.tokenKey, response.token);
        this.user = response.user;
      }),
      catchError(this.handleError)
    );
  }
  
  updateEmail(newEmail: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError('Kein Token gefunden');
    }
  
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<{ token: string, user: User }>('/api/update-email', { newEmail }, { headers }).pipe(
      tap((response: { token: string, user: User }) => {
        // Update local token and user information
        localStorage.setItem(this.tokenKey, response.token);
        this.user = response.user;
      }),
      catchError(this.handleError)
    );
  }
  
  

  updatePassword(Passwort: string): Observable<any> {
    // Passwort aktualisieren
    const token = this.getToken();
    if (!token) {
      return throwError('Kein Token gefunden');
    }
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post('/api/update-password', { Passwort }, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    // Fehlerbehandlung
    console.error('Ein Fehler ist aufgetreten', error);
    return throwError(error);
  }

  getUser(): User | null {
    // Aktuelle Benutzerinformationen abrufen
    return this.user;
  }
}
