import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

export class Film {
    film_id: number;
    title: string;
    description: string;
    image_link: string;
    selected: boolean = false;
    inCurrentList: boolean = false;

    constructor(film_id: number, title: string, description: string, image_link: string) {
        this.film_id = film_id;
        this.title = title;
        this.description = description;
        this.image_link = image_link;
    }
}


export class List {
    ListenID: number;
    listname: string;

    constructor(ListenID: number, listname: string) {
        this.ListenID = ListenID;
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
                    const newList = new List(response.ListenID, this.listname);
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
        this.getFilmsInList(list.ListenID);
    }

    getFilmsInList(listId: number): void {
        const url = `/api/list-creator/list-films/${listId}`;
        this.http.get<Film[]>(url).subscribe(
            (data: Film[]) => {
                this.films.forEach(film => {
                    film.inCurrentList = data.some(f => f.film_id === film.film_id);
                    if (film.inCurrentList) {
                        film.selected = false; // Checkbox nicht ausgewählt, wenn der Film bereits in der Liste ist
                    }
                });
            },
            (error: HttpErrorResponse) => {
                this.handleHttpError('Error fetching films in list', error);
            }
        );
    }
    

    editList(list: List): void {
        this.selectList(list);
    }

    addFilmsToList(): void {
        if (!this.selectedList) {
            console.error("No list selected");
            return;
        }
    
        const selectedFilmIds = this.films.filter(film => film.selected && !film.inCurrentList).map(film => film.film_id);
        const body = { listId: this.selectedList.ListenID, filmIds: selectedFilmIds };
    
        if (this.selectedList.ListenID !== undefined) {
            this.http.post('/api/list-creator/add-films', body).subscribe(
                (response: any) => {
                    console.log("Films added to list successfully:", response);
                    //this.getFilmsInList(this.selectedList.ListenID); // Sicherstellen, dass ListenID definiert ist
                },
                (error: HttpErrorResponse) => {
                    this.handleHttpError('Error adding films to list', error);
                }
            );
        }
    }
    
    removeFilmFromList(film: Film): void {
        if (!this.selectedList) {
            console.error("No list selected");
            return;
        }

        const body = { listId: this.selectedList.ListenID, filmId: film.film_id };

        this.http.post('/api/list-creator/remove-film', body).subscribe(
            (response: any) => {
                console.log("Film removed from list successfully:", response);
                film.inCurrentList = false;
                film.selected = false;
            },
            (error: HttpErrorResponse) => {
                this.handleHttpError('Error removing film from list', error);
            }
        );
    }
    

    deleteList(list: List): void {
        const url = `/api/list-creator/delete/${list.ListenID}`;
        this.http.delete(url).subscribe(
            (response: any) => {
                console.log("List deleted successfully:", response);
                this.listen = this.listen.filter(l => l.ListenID !== list.ListenID);
                if (this.selectedList?.ListenID === list.ListenID) {
                    this.selectedList = null;
                    this.toggleView();
                }
            },
            (error: HttpErrorResponse) => {
                this.handleHttpError('Error deleting list', error);
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
