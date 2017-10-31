import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from './course';
import { CourseService } from './course.service';



@Component({
  selector: 'courses-list',
  templateUrl: './courses.component.html',
    styleUrls: ['./courses.component.css'],
    providers: [CourseService]
})


export class CoursesComponent implements OnInit {

  title = 'courses!';
  courses: Course[];

    constructor(private courseService: CourseService,
                private router: Router,
    ) {

    }

    ngOnInit(): void {
      this.getCourses();
    }

    getCourses(): void {
        this.courseService.getCourses().then((courses) => {
            this.courses = courses;
        });
    }
}
