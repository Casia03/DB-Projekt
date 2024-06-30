import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;
  private tokenKey = 'auth_token'; // Key to store token in localStorage

  constructor(private router: Router) {
    // // Check localStorage for an existing token on initialization
    // const token = localStorage.getItem(this.tokenKey);
    // if (token) {
    //   this.loggedIn = true;
    // }
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  login(token: string): void {
    this.loggedIn = true;
    localStorage.setItem(this.tokenKey, token); // Save token to localStorage
  }

  logout(): void {
    this.loggedIn = false;
    localStorage.removeItem(this.tokenKey); // Remove token from localStorage
    this.router.navigate(['/user-login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
