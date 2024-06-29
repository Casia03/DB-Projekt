import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { FilmComponent } from './film/film.component';
import { FilmListComponent } from './film-list/film-list.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserComponent } from './user/user.component';
import { ListCreatorComponent } from './list-creator/list-creator.component';

const routes: Routes = [
  { path: '', redirectTo: 'home-page', pathMatch: 'full' }, // Standardroute zur Homepage
  { path: 'home-page', component: HomePageComponent },
  { path: 'film', component: FilmComponent },
  { path: 'film/:id', component: FilmComponent },
  { path: 'film-list', component: FilmListComponent },
  { path: 'user-login', component: UserLoginComponent },
  { path: 'list-creator', component: ListCreatorComponent },

  { path: 'user', component: UserComponent },
  // Optionale ERROR 404-Seite
  { path: '**', redirectTo: 'home-page' } // Wildcard-Route, die auf die Homepage umleitet
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
