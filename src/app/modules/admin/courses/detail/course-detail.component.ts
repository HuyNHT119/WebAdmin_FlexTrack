import { CourseService } from './../course.service';
import { Course } from 'app/model/course.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'app-course-detail',
    templateUrl: 'course-detail.component.html'
})

export class CourseDetailComponent implements OnInit {

    course: Course;

    confirmDialogData: any = {
        title: "Confirm course",
        message: "Are you sure you want to confirm this course? <span class=\"font-medium\">This course will be announced!</span>",
        icon: {
            show: true,
            name: "heroicons_solid:check",
            color: "success"
        },
        actions: {
            confirm: {
                show: true,
                label: "Confirm",
                color: "warn"
            },
            cancel: {
                show: true,
                label: "Cancel"
            }
        },
        dismissible: true
    };

    constructor(
        private _route: ActivatedRoute,
        private _courseService: CourseService,
        private _fuseConfirmationService: FuseConfirmationService
    ) { }

    ngOnInit() {
        this.getCourse();
    }

    getCourse() {
        this._courseService.getCourse(this._route.snapshot.paramMap.get('id')).subscribe(result => {
            this.course = result.body as Course
            console.log(this.course);
        })
    }

    confirmCourse() {
        const dialogRef = this._fuseConfirmationService.open(this.confirmDialogData);
        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                console.log('Hahahahaha');
            }
        });
    }

}