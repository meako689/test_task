import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';


import { Course } from './course';


@Injectable()
export class PersonCourseService {

    private peopleCourseUrl = 'http://192.168.192.168:8000/person_courses/'; 
    private headers = new Headers({'Content-Type': 'application/json'});
    constructor(private http: Http) { }

    getPersonCourses(personId:number): Promise<any> {
        var url = this.peopleCourseUrl+personId;

      return this.http.get(url)
                .toPromise()
                .then(response => response.json())
                .catch(this.handleError);
    }
    action(action:string, personId:number, courseId:number): Promise<void>{
        var payload = {'action':action,'id':courseId}
        var url = this.peopleCourseUrl+personId;
        return this.http
            .post(url, JSON.stringify(payload), {headers:this.headers})
            .toPromise()
            .then(() => null)
            .catch(this.handleError);
    }


    private handleError(error: any): Promise<any> {
      console.error('An error occurred', error); // for demo purposes only
      return Promise.reject(error.message || error);
    }
}
