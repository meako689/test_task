import { Component, Input } from '@angular/core';
import { OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location }                 from '@angular/common';
import { Person } from './person';
import { PersonService } from './person.service';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'person-add',
  templateUrl: './person-add.component.html',
})
export class PersonAddComponent {
    newPersonForm: FormGroup;

    constructor(
      private personService: PersonService,
      private route: ActivatedRoute,
      private location: Location,
      private formBuilder: FormBuilder
      
    ) {
    this.newPersonForm = this.formBuilder.group({
      'name': ['', [Validators.required]],
      'email': ['', [Validators.required]]
    });
       console.log('HELLO THERE');
    }

    goBack(): void {
      this.location.back();
    }

    add(newPerson: Person): void {
        console.log(newPerson);
      this.personService.create(newPerson)
        .then(() => this.goBack()); //TODO show message, wait 3 sec
    }
}
