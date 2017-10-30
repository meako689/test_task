import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms'; 
import { HttpModule }    from '@angular/http';

import { AppComponent } from './app.component';
import { PersonDetailComponent } from './person-detail.component';
import { PeopleComponent } from './people.component';
import { AppRoutingModule } from './app.routing';
import { PersonService } from './person.service';




@NgModule({
  declarations: [
    AppComponent,
      PersonDetailComponent,
      PeopleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
      AppRoutingModule
  ],
  providers: [PersonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
