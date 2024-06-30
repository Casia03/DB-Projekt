import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { UserComponent } from './user/user.component';
import { FilmComponent } from './film/film.component';
import { FilmListComponent } from './film-list/film-list.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { ListCreatorComponent } from './list-creator/list-creator.component';
import { DialogComponent } from './dialog/dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    UserComponent,
    FilmComponent,
    FilmListComponent,
    UserLoginComponent,
    ListCreatorComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
