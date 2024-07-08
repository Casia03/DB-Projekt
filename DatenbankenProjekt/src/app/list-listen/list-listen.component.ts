import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface liste {
  ListenID: number;
  listname: string;
  NutzerID: number;
  Nutzername: string;
  // Weitere Eigenschaften hier rein
}

@Component({
  selector: 'app-list-listen',
  templateUrl: './list-listen.component.html',
  styleUrls: ['./list-listen.component.css']
})
export class ListListenComponent {
  isSidebarOpen = false;
  listen: liste[] = [];

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
      
          this.getAllFilms();
  
  }

  toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
  }

  getAllFilms() {
      this.http.get<liste[]>('/api/listen').subscribe(
          (data: liste[]) => {
              this.listen = data;
          },
          (error: HttpErrorResponse) => {
              this.handleHttpError('Error fetching all list', error);
          }
      );
  }


  private handleHttpError(message: string, error: HttpErrorResponse): void {
      console.error(message, error);
      // Hier kannst du zusätzliche Logik zur Fehlerbehandlung einfügen, z.B. Benachrichtigungen an den Benutzer
  }
}
