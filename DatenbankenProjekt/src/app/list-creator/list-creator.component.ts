import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-creator',
  templateUrl: './list-creator.component.html',
  styleUrls: ['./list-creator.component.css']
})
export class ListCreatorComponent implements OnInit {
  isSidebarOpen = false; // Initial state of the sidebar
  films: any[] = []; // Array to hold multiple films

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getFilms(); // Call getFilms on component initialization
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  getFilms() {
    this.http.get<any[]>('/film').subscribe(
      (data: any[]) => {
        console.log(data);
        this.films = data;
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching films', error);
      }
    );
  }
}

