import { CourseService } from './course.service';
import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Course } from 'app/model/course.model';
import { Pagination } from 'app/model/pagination.model';

@Component({
    selector: 'app-course',
    templateUrl: 'course.component.html',
    styleUrls: ['course.component.css']
})

export class CourseComponent implements OnInit, AfterViewInit, OnDestroy {
    constructor(
        private _courseSerivce: CourseService,
        private _changeDetectorRef: ChangeDetectorRef
    ) { }

    courses$: Observable<Course[]>;

    pagination: Pagination;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    search: string = "";
    selectedCourse: Course | null = null;
    selectedCourseForm: UntypedFormGroup;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    ngOnInit() {
        this.loadCourses();
    }

    ngAfterViewInit(): void {

    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // PRIVATE METHOD
    private loadCourses(): void {
        this._courseSerivce.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: Pagination) => {
                this.pagination = pagination;
                this._changeDetectorRef.markForCheck();
            });
        this.courses$ = this._courseSerivce.courses$;
    }

}
