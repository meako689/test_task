import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PeopleComponent} from './people.component';
import {PersonDetailComponent} from './person-detail.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/people', pathMatch: 'full' },
  { path: 'people',  component: PeopleComponent },
  { path: 'person/:id', component: PersonDetailComponent }
  //{ path: 'heroes',     component: HeroesComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes) ],
  exports: [ RouterModule ]
})
 
export class AppRoutingModule {}

//const appRoutes: Routes = [
    //{
        //path:"people",
        //component:
    //},
    //{
        //path:"people/:id",
        //component:
    //},
    //{
        //path:"people/add",
        //component:
    //},
    //{
        //path:"people/:id/edit",
        //component:
    //}
//]

