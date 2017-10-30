import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { Person } from './person';
import { PersonService } from './person.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [PersonService]
})

export class AppComponent {

  title = 'people!';
}

