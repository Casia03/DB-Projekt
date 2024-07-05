import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { FilmComponent } from './film/film.component';
import { FilmListComponent } from './film-list/film-list.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserComponent } from './user/user.component';
import { ListCreatorComponent } from './list-creator/list-creator.component';
import { ListListenComponent } from './list-listen/list-listen.component';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

const routes: Routes = [
  { path: '', redirectTo: 'home-page', pathMatch: 'full' }, // Standardroute zur Homepage
  { path: 'home-page', component: HomePageComponent },
  { path: 'film', component: FilmComponent },
  { path: 'film/:id', component: FilmComponent },
  { path: 'film-list', component: FilmListComponent },
  { path: 'film-list/year/:year', component: FilmListComponent },
  { path: 'film-list/year/:startYear/:endYear', component: FilmListComponent }, // Route für Filme nach Jahrbereich
  { path: 'film-list/rating/:rating', component: FilmListComponent },
  { path: 'film-list/category/:categoryId', component: FilmListComponent },
  { path: 'user-login', component: UserLoginComponent },
  { path: 'list-creator', component: ListCreatorComponent },
  { path: 'list-listen', component: ListListenComponent },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  // Optionale ERROR 404-Seite
  { path: '**', redirectTo: 'home-page' } // Wildcard-Route, die auf die Homepage umleitet
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
