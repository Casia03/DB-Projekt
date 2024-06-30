import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;

  constructor() { }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  login(): void {
    // In a real application, you would typically call an API to verify credentials
    // For simplicity, we just set loggedIn to true here
    this.loggedIn = true;
  }

  logout(): void {
    // In a real application, you would typically call an API to log the user out
    // For simplicity, we just set loggedIn to false here
    this.loggedIn = false;
  }
}
