import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Person } from './person';

const PEOPLE: Person[] = [
  { id: 1, name: 'Mr. Nice', email:'email@a.com',phone:'+380935273171',mobile_phone:'+380972025505'},
  { id: 2, name: 'blak', email:'email@a.com',phone:'+380935273171',mobile_phone:'+380972025505'},
  { id: 3, name: 'Nice', email:'email@a.com',phone:'+380935273171',mobile_phone:'+380972025505'},
  { id: 4, name: 'jsjsjs', email:'email@a.com',phone:'+380935273171',mobile_phone:'+380972025505'},
  { id: 5, name: 'makam. Nice', email:'email@a.com',phone:'+380935273171',mobile_phone:'+380972025505'},
  { id: 6, name: 'Meako', email:'email@a.com',phone:'+380935273171',mobile_phone:'+380972025505'},
];


@Injectable()
export class PersonService {

    private peopleUrl = 'http://192.168.192.168:8000/people/'; 

    constructor(private http: Http) { }

    getPeople(): Promise<Person[]> {
      return this.http.get(this.peopleUrl)
                 .toPromise()
                 .then(response => response.json().data as Person[])
                 .catch(this.handleError);
    }

    getPerson(id: number): Promise<Person> {
        return this.http.get(this.peopleUrl+id+'/')
                 .toPromise()
                 .then(response => response.json() as Person)
                 .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
      console.error('An error occurred', error); // for demo purposes only
      return Promise.reject(error.message || error);
    }
}
