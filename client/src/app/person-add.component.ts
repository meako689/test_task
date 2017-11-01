import { Component, Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
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
      public alerts: any[] = [];

    constructor(
      private personService: PersonService,
      private route: ActivatedRoute,
      private location: Location,
      private formBuilder: FormBuilder,
      
    ) {
        this.newPersonForm = this.formBuilder.group({
          'name': ['', [Validators.required,
                      Validators.pattern(/[a-zA-Z ]+/)]],
          'email': ['', [Validators.email]],
          'status': [false, [Validators.required]],
          'phone': ['', [Validators.pattern(/^\+\d{12}$/)]],
          'mobile_phone': ['', [Validators.pattern(/^\+\d{12}$/)]]
        });
    }

    goBack(): void {
      this.location.back();
    }

    add(newPerson: Person): void {
      this.personService.create(newPerson)
        .then(() => {
            this.alerts.push({type:'success', msg:'User Created Successfully', timeout:3000});
            setTimeout(() => {  
                this.goBack(); 
            }, 3000);
        });
    }
}
