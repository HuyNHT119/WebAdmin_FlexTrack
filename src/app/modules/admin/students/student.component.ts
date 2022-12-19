import { StudentService } from './student.service';
import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Student } from 'app/model/student.model';
import { Pagination } from 'app/model/pagination.model';

@Component({
    selector: 'app-student',
    templateUrl: 'student.component.html',
    styleUrls: ['student.component.css']
})

export class StudentComponent implements OnInit, AfterViewInit, OnDestroy {
    constructor(
        private _studentSerivce: StudentService,
        private _changeDetectorRef: ChangeDetectorRef
    ) { }

    students$: Observable<Student[]>;

    pagination: Pagination;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    search: string = "";
    selectedStudent: Student | null = null;
    selectedStudentForm: UntypedFormGroup;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    ngOnInit() {
        this.loadStudents();
    }

    ngAfterViewInit(): void {

    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // PRIVATE METHOD
    private loadStudents(): void {
        this._studentSerivce.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: Pagination) => {
                this.pagination = pagination;
                this._changeDetectorRef.markForCheck();
            });
        this.students$ = this._studentSerivce.students$;
    }

}
