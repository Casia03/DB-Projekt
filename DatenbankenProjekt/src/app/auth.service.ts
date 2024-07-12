import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {
  private tokenKey = 'auth_token'; // Key to store token in localStorage

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      this.logout(); // Clear token
      console.log('Cleared token from localStorage on startup');
    }
  }

  login(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}
