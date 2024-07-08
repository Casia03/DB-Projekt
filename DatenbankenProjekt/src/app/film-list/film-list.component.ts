import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface Film {
    film_id: number;
    title: string;
    description: string;
    release_year: number;
    image_link: string;
    image_url?: string;
    // Weitere Eigenschaften hier rein
}

@Component({
    selector: 'app-film-list',
    templateUrl: './film-list.component.html',
    styleUrls: ['./film-list.component.css']
})
export class FilmListComponent implements OnInit {
    isSidebarOpen = false;
    films: Film[] = [];

    constructor(private http: HttpClient, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const year = params.get('year');
            const rating = params.get('rating');
            const categoryId = params.get('categoryId');
            const ListenID = params.get('ListenID');
            
            if (year) {
                if (year.includes('-')) {
                    const [startYear, endYear] = year.split('-');
                    this.getFilmsByYearRange(parseInt(startYear), parseInt(endYear));
                } else {
                    this.getFilmsByYear(parseInt(year));
                }
            } else if (rating) {
                this.getFilmsByRating(rating);
            } else if (categoryId) {
                this.getFilmsByCategory(parseInt(categoryId));     
            } else if (ListenID) {
                this.getFilmsByListe(parseInt(ListenID));
            } else {
                this.getAllFilms();
            }
        });
    }

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    getAllFilms() {
        this.http.get<Film[]>('/film-list').subscribe(
            (data: Film[]) => {
                this.films = data;
            },
            (error: HttpErrorResponse) => {
                this.handleHttpError('Error fetching all films', error);
            }
        );
    }

    getFilmsByYear(year: number) {
        this.http.get<Film[]>(`/api/films/year/${year}`).subscribe(
            (data: Film[]) => {
                this.films = data;
            },
            (error: HttpErrorResponse) => {
                this.handleHttpError(`Error fetching films for year ${year}`, error);
            }
        );
    }

    getFilmsByYearRange(startYear: number, endYear: number) {
        this.http.get<Film[]>(`/api/films/year-range/${startYear}/${endYear}`).subscribe(
            (data: Film[]) => {
                this.films = data;
            },
            (error: HttpErrorResponse) => {
                this.handleHttpError(`Error fetching films for year range ${startYear}-${endYear}`, error);
            }
        );
    }

    getFilmsByRating(rating: string) {
        this.http.get<Film[]>(`/api/films/rating/${rating}`).subscribe(
            (data: Film[]) => {
                this.films = data;
            },
            (error: HttpErrorResponse) => {
                this.handleHttpError(`Error fetching films for rating ${rating}`, error);
            }
        );
    }

    getFilmsByCategory(categoryId: number) {
        this.http.get<Film[]>(`/api/films/category/${categoryId}`).subscribe(
            (data: Film[]) => {
                this.films = data;
            },
            (error: HttpErrorResponse) => {
                this.handleHttpError(`Error fetching films for category ${categoryId}`, error);
            }
        );
    }
    getFilmsByListe(ListenID: number) {
        this.http.get<Film[]>(`/api/listeninhalt/${ListenID}`).subscribe(
            (data: Film[]) => {
                this.films = data;
            },
            (error: HttpErrorResponse) => {
                this.handleHttpError(`Error fetching films for category ${ListenID}`, error);
            }
        );
    }

    private handleHttpError(message: string, error: HttpErrorResponse): void {
        console.error(message, error);
    }
}
