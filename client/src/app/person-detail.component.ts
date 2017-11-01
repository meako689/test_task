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
    public alerts: any[] = [];

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
                'name': [{'value':this.person.name, 'disabled':true}, [Validators.required,
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
        const name = this.person.name;
        this.person = this.editPersonForm.value;
        this.person.id = id;
        this.person.name = name;
        this.personService.update(this.person)
        .then(() => {
            this.alerts.push({type:'success', msg:'Saved Successfully', timeout:3000});
            setTimeout(() => {  
                this.goBack(); 
            }, 3000);
        });
    }

    unsubscribe(course: Course): void{
        this.courses.available.push(course);
        this.courses.applied = this.courses.applied.filter(c=> c!== course);

        if (this.courses.available.length === 1){
            this.courseToAdd = this.courses.available[0];
        }


        this.courseService.action('unsubscribe', this.person.id, course.id);
        this.alerts.push({type:'success', msg:'Unsubscribed from '+course.name, timeout:1000});

    }
    subscribe(course: Course): void{
        this.courses.applied.push(course);
        this.courses.available = this.courses.available.filter(c=> c!== course);

        if (this.courses.available.length){
            this.courseToAdd = this.courses.available[0];
        }
        this.courseService.action('subscribe', this.person.id, course.id);
        this.alerts.push({type:'success', msg:'Subscribed to '+course.name, timeout:1000});
    }
}
