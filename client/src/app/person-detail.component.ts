import { Component, Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location }                 from '@angular/common';
import { Person } from './person';
import { Course } from './course';
import { PersonService } from './person.service';
import { PersonCourseService } from './person-course.service';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'person-detail',
  templateUrl: './person-detail.component.html',
})
export class PersonDetailComponent implements OnInit {
    @Input() person: Person;
    courses : {'applied':Course[], 'available':Course[]};
    courseToAdd: Course;


    constructor(
      private personService: PersonService,
      private personCourseService: PersonCourseService,
      private route: ActivatedRoute,
      private location: Location
    ) {
    }

    ngOnInit(): void {
      this.route.paramMap
        .switchMap((params: ParamMap) => this.personService.getPerson(+params.get('id')))
        .subscribe((person) =>{
            
            this.person = person;
            this.personCourseService.getPersonCourses(this.person.id).then((data) => {
                this.courses = data;
                if (this.courses.available.length){
                    this.courseToAdd = this.courses.available[0];
                }
            });
        });

    }
    goBack(): void {
      this.location.back();
    }
    save(): void {
      this.personService.update(this.person)
        .then(() => this.goBack()); //TODO show message, wait 3 sec
    }

    unsubscribe(course: Course): void{
        this.courses.available.push(course);
        this.courses.applied = this.courses.applied.filter(c=> c!== course);

        this.personCourseService.action('unsubscribe', this.person.id, course.id);

    }
    subscribe(course: Course): void{
        this.courses.applied.push(course);
        this.courses.available = this.courses.available.filter(c=> c!== course);
        this.personCourseService.action('subscribe', this.person.id, course.id);

        if (this.courses.available.length){
            this.courseToAdd = this.courses.available[0];
        }
    }
}
