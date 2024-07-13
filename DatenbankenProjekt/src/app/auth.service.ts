import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {
  private tokenKey = 'auth_token'; // Key to store token in localStorage

  constructor(private router: Router, private http: HttpClient) {}

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
  
  getUserInfo(): Observable<any> {
    const token = localStorage.getItem(this.tokenKey);
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get('/api/user-info', { headers }).pipe(
      catchError(this.handleError) // Handle errors
    );
  }

  private handleError(error: any): Observable<never> {
    // Log the error and rethrow it
    console.error('An error occurred', error);
    throw error;
  }
}
