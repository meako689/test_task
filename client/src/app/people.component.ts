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
  total = 0;
  pages: number [] = [];
  currentPage :number = 1;
  showPerPageOptions = [15, 10, 20];
  showPerPage :number;

    constructor(private personService: PersonService,
                private router: Router,
    ) {
        this.showPerPage = this.showPerPageOptions[0];
    }

    getPeople(): void {
        this.personService.getPeople(this.showPerPage, this.currentPage).then((people) => {
            this.people = people;
        });
    }
    getTotal(): void {
        this.personService.getTotal().then((total) => {
            this.total = total;
            this.countPages();

        });
    }

    changePerPage(): void{
        this.currentPage = 1;
        this.countPages();
        this.getPeople();
    }

    goToPage(page: number): void{
        this.currentPage = page;
        this.getPeople();

    }

    countPages(): void{
        this.pages = [];

        console.log(this.showPerPage);
        console.log(this.total);

        var countPages = Math.trunc(this.total / this.showPerPage);
        if (this.total % this.showPerPage){
            countPages +=1;
        }

        for (let i: number = 1; i <= countPages; i++) {
          this.pages.push(i);
        }

        console.log(countPages);
        console.log(this.pages);
    }


    ngOnInit(): void {
      this.getPeople();
      this.getTotal();
       console.log('init');
    }

    onSelect(person: Person): void {
        this.selectedPerson = person;
        this.router.navigate(['/person', person.id]);
    }
    onSearch(value: string): void{
        this.personService.searchPeople(value).then(
            people => this.people = people);
    }

    delete(person: Person): void {
      this.personService
          .delete(person)
          .then(() => {
            this.people = this.people.filter(p => p !== person);
            this.total -=1;
          });
    }
}
