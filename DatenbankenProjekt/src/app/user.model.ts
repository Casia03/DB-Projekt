export interface User {
    Nutzername: string;
    Email: string;
    Passwort: string;
  }
  
  export interface UpdateResponse {
    user: User;
  }