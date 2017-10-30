import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Person } from './person';



@Injectable()
export class PersonService {

    private peopleUrl = 'http://192.168.192.168:8000/people/'; 
    private headers = new Headers({'Content-Type': 'application/json'});
    constructor(private http: Http) { }

    getPeople(): Promise<Person[]> {
      return this.http.get(this.peopleUrl)
                 .toPromise()
                 .then(response => response.json().data as Person[])
                 .catch(this.handleError);
    }

    getPerson(id: number): Promise<Person> {
        const url = `${this.peopleUrl}${id}/`;
        return this.http.get(url)
                 .toPromise()
                 .then(response => response.json() as Person)
                 .catch(this.handleError);
    }

    update(person: Person): Promise<Person> {
        const url = `${this.peopleUrl}${person.id}/`;
      return this.http
        .put(url, JSON.stringify(person), {headers: this.headers})
        .toPromise()
        .then(() => person)
        .catch(this.handleError);
    }

    create(person: Person): Promise<Person> {
      return this.http
        .post(this.peopleUrl, JSON.stringify(person), {headers: this.headers})
        .toPromise()
        .then(res => res.json().data as Person)
        .catch(this.handleError);
    }

    delete(person: Person): Promise<void> {
      const url = `${this.peopleUrl}${person.id}/`;
      return this.http.delete(url, {headers: this.headers})
        .toPromise()
        .then(() => null)
        .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
      console.error('An error occurred', error); // for demo purposes only
      return Promise.reject(error.message || error);
    }
}
