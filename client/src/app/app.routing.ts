import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PeopleComponent} from './people.component';
import {CoursesComponent} from './courses.component';
import {PersonDetailComponent} from './person-detail.component';
import { PersonAddComponent } from './person-add.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/people', pathMatch: 'full' },
  { path: 'people',  component: PeopleComponent },
  { path: 'people/add',  component: PersonAddComponent },
  { path: 'person/:id', component: PersonDetailComponent },
  { path: 'courses',  component: CoursesComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes) ],
  exports: [ RouterModule ]
})
 
export class AppRoutingModule {}
