import { Component, Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location }                 from '@angular/common';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';


import { Person } from './person';
import { Course } from './course';
import { PersonService } from './person.service';
import { CourseService } from './course.service';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'person-detail',
  templateUrl: './person-detail.component.html',
})
export class PersonDetailComponent implements OnInit {
    @Input() person: Person;
    courses : {'applied':Course[], 'available':Course[]};
    courseToAdd: Course;
    editPersonForm: FormGroup;


    constructor(
      private personService: PersonService,
      private courseService: CourseService,
      private route: ActivatedRoute,
      private location: Location,
      private formBuilder: FormBuilder
    ) {
    }

    ngOnInit(): void {
      this.route.paramMap
        .switchMap((params: ParamMap) => this.personService.getPerson(+params.get('id')))
        .subscribe((person) =>{
            
            this.person = person;

            this.courseService.getPersonCourses(this.person.id).then((data) => {
                this.courses = data;
                if (this.courses.available.length){
                    this.courseToAdd = this.courses.available[0];
                }
            });

            this.editPersonForm = this.formBuilder.group({
              'name': [this.person.name, [Validators.required,
                          Validators.pattern(/[a-zA-Z ]+/)]],
              'email': [this.person.email, [Validators.email]],
              'status': [this.person.status, [Validators.required]],
              'phone': [this.person.phone, [Validators.pattern(/^\+\d{12}$/)]],
              'mobile_phone': [this.person.mobile_phone, [Validators.pattern(/^\+\d{12}$/)]]
            });

        });

    }
    goBack(): void {
      this.location.back();
    }
    save(): void {
        const id = this.person.id;
        this.person = this.editPersonForm.value;
        this.person.id = id;
        this.personService.update(this.person)
        .then(() => {console.log(this);
            this.goBack()}); //TODO show message, wait 3 sec
    }

    unsubscribe(course: Course): void{
        this.courses.available.push(course);
        this.courses.applied = this.courses.applied.filter(c=> c!== course);

        if (this.courses.available.length === 1){
            this.courseToAdd = this.courses.available[0];
        }

        this.courseService.action('unsubscribe', this.person.id, course.id);

    }
    subscribe(course: Course): void{
        this.courses.applied.push(course);
        this.courses.available = this.courses.available.filter(c=> c!== course);
        this.courseService.action('subscribe', this.person.id, course.id);

        if (this.courses.available.length){
            this.courseToAdd = this.courses.available[0];
        }
    }
}
