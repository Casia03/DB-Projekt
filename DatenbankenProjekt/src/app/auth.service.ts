import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit{
  private tokenKey = 'auth_token'; // Schlüssel, um das Token in localStorage zu speichern

  constructor(private router: Router,private authService: AuthService) {
    // Konstruktor wird verwendet, um die Router-Instanz zu injizieren
  }
  ngOnInit(): void {
    // Clear token from localStorage on application startup
    if (this.authService.isLoggedIn()) {
      this.authService.logout(); // Clear token
      console.log('Cleared token from localStorage on startup');
    }
  }

  // Methode, um zu überprüfen, ob der Benutzer eingeloggt ist

  login(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Optionally, you can add methods to check if the user is logged in
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}
