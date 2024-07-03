import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

export class Film {
    film_id: number;
    title: string;
    description: string;
    image_link: string;
    selected: boolean = false;

    constructor(film_id: number, title: string, description: string, image_link: string) {
        this.film_id = film_id;
        this.title = title;
        this.description = description;
        this.image_link = image_link;
    }
}

export class List {
    list_id: number;
    listname: string;

    constructor(list_id: number, listname: string) {
        this.list_id = list_id;
        this.listname = listname;
    }
}

@Component({
    selector: 'app-list-creator',
    templateUrl: './list-creator.component.html',
    styleUrls: ['./list-creator.component.css']
})
export class ListCreatorComponent implements OnInit {
    isSidebarOpen = false;
    films: Film[] = [];
    listen: List[] = [];
    listname: string = '';
    selectedList: List | null = null;
    showListCreation = true;

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.getFilms();
        this.getUserLists();
    }

    toggleSidebar(): void {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    getFilms(): void {
        this.http.get<Film[]>('/film-list').subscribe(
            (data: Film[]) => {
                this.films = data;
            },
            (error: HttpErrorResponse) => {
                this.handleHttpError('Error fetching all films', error);
            }
        );
    }

    getUserLists(): void {
        this.http.get<List[]>('/api/user-lists').subscribe(
            (data: List[]) => {
                this.listen = data;
            },
            (error: HttpErrorResponse) => {
                this.handleHttpError('Error fetching user lists', error);
            }
        );
    }

    createList(): void {
        if (this.listname.trim() !== '') {
            const body = { listname: this.listname };
            this.http.post('/api/list-creator/create', body).subscribe(
                (response: any) => {
                    console.log("List created successfully:", response);
                    const newList = new List(response.list_id, this.listname);
                    this.listen.push(newList);
                    this.listname = '';
                },
                (error: HttpErrorResponse) => {
                    this.handleHttpError('Error creating list', error);
                }
            );
        }
    }

    selectList(list: List): void {
        this.selectedList = list;
        this.showListCreation = false;
    }

    editList(list: List): void {
        this.selectList(list);
    }

    addFilmsToList(): void {
        if (!this.selectedList) {
            console.error("No list selected");
            return;
        }

        const selectedFilmIds = this.films.filter(film => film.selected).map(film => film.film_id);
        const body = { listId: this.selectedList.list_id, filmIds: selectedFilmIds };

        this.http.post('/api/list-creator/add-films', body).subscribe(
            (response: any) => {
                console.log("Films added to list successfully:", response);
            },
            (error: HttpErrorResponse) => {
                this.handleHttpError('Error adding films to list', error);
            }
        );
    }

    toggleView(): void {
        this.showListCreation = !this.showListCreation;
    }

    private handleHttpError(message: string, error: HttpErrorResponse): void {
        console.error(message, error);
    }
}


    /*
      toggleSelection(film: Film): void {
        film.selected = !film.selected;
      }
    
      createList(): void {
        const selectedFilms = this.films.filter(film => film.selected);
        // Now you can send the selectedFilms array to your backend or perform any other operations
      }
    
      saveList(listName: string): void {
        const selectedFilms = this.films.filter(film => film.selected);
        const newList = {
          name: listName,
          films: selectedFilms.map(film => film.film_id) // Only store film IDs in the user list
        };
        this.userLists.push(newList);
    
        // Send the newList object to your backend API to save it in the MySQL table
        this.http.post('', newList).subscribe(
          (response: any) => {
            console.log('User list saved successfully:', response);
          },
          (error: HttpErrorResponse) => {
            console.error('Error saving user list:', error);
          }
        );
      }*/
