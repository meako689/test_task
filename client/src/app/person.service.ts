import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Person } from './person';



@Injectable()
export class PersonService {

    private peopleUrl = '/api/people/'; 
    private headers = new Headers({'Content-Type': 'application/json'});
    constructor(private http: Http) { }

    getPeople(limit:number, page:number): Promise<Person[]> {
        var url = this.peopleUrl;
        if (limit > 0) {
            url += '?limit='+limit
            if (page > 0){
                const offset = (page-1)*limit;
                url += '&offset='+offset
            }
        }
      return this.http.get(url)
                 .toPromise()
                 .then(response => response.json().data as Person[])
                 .catch(this.handleError);
    }

    getTotal(): Promise<number>{
        return this.http.get(this.peopleUrl+'count/')
                 .toPromise()
                 .then(response => response.json().total)
                 .catch(this.handleError);

    }

    searchPeople(value: string): Promise<Person[]> {
        return this.http.get(this.peopleUrl+'?name='+value)
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
