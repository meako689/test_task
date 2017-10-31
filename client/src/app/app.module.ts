import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule }    from '@angular/http';


import { AppComponent } from './app.component';
import { PersonDetailComponent } from './person-detail.component';
import { PersonAddComponent } from './person-add.component';
import { PeopleComponent } from './people.component';
import { CoursesComponent } from './courses.component';
import { AppRoutingModule } from './app.routing';
import { PersonService } from './person.service';
import { CourseService } from './course.service';
import { ActiveBlockedPipe } from './active-blocked.pipe';




@NgModule({
  declarations: [
    AppComponent,
      PersonDetailComponent,
      PersonAddComponent,
      PeopleComponent,
      CoursesComponent,
      ActiveBlockedPipe
  ],
  imports: [
    BrowserModule,
    FormsModule, ReactiveFormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [PersonService, CourseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
