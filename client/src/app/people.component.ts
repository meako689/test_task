import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Person } from './person';
import { PersonService } from './person.service';



@Component({
  selector: 'people-list',
  templateUrl: './people.component.html',
    styleUrls: ['./people.component.css'],
    providers: [PersonService]
})

export class PeopleComponent implements OnInit {

  title = 'people!';
  people: Person[];
  selectedPerson: Person;

    constructor(private personService: PersonService,
                private router: Router,
    ) { }

    getPeople(): void {
      this.personService.getPeople().then(people => this.people = people);
    }


    ngOnInit(): void {
      this.getPeople();
    }

    onSelect(person: Person): void {
        this.selectedPerson = person;
        this.router.navigate(['/person', person.id]);
    }

    delete(person: Person): void {
      this.personService
          .delete(person)
          .then(() => {
            this.people = this.people.filter(p => p !== person);
          });
    }
}
