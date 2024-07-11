import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-film',
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.css']
})
export class FilmComponent implements OnInit {
  isSidebarOpen = false;
  film: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const filmIdParam = params.get('id');
      if (filmIdParam !== null) {
        const filmId = +filmIdParam; // Konvertierung der Film-ID in eine Zahl
        if (!isNaN(filmId)) {
          this.loadFilm(filmId);
        } else {
          console.error('Invalid film ID:', filmIdParam);
        }
      } else {
        console.error('Film ID is null or undefined.');
      }
    });
  }
  

  loadFilm(filmId: number) {
    this.http.get<any>(`/api/film/${filmId}`).subscribe(
      (film: any) => {
        console.log('Loaded film:', film);
        this.film = {
          ...film,
          image_url: `/assets/pictures/${film.image_link}`
        };
        console.log('Film object:', this.film);
      },
      (error: HttpErrorResponse) => {
        console.error('Error loading film:', error);
      }
    );
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

}
