import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from 'app/model/student.model';
import { Pagination } from 'app/model/pagination.model';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StudentService {
    private _students: BehaviorSubject<Student[] | null> = new BehaviorSubject(null);
    private _student: BehaviorSubject<Student | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(null);

    constructor(private _http: HttpClient) { }

    get students$(): Observable<Student[]> {
        return this._students.asObservable();
    }

    get student$(): Observable<Student> {
        return this._student.asObservable();
    }

    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    getStudents(pageNumber: number = 0, pageSize: number = 10, sort: string = 'name', order: 'asc' | 'desc' | '' = 'asc', search: string = '')
        : Observable<any> {
        var params = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            sort: sort,
            order: order,
            search: search
        }
        return this._http.get<any>('/api/tutees/all', { params: params, observe: 'response' }).pipe(
            catchError(error => {
                if (error.status === 404) {
                    var empty = {
                        pagination: {
                            total: 0,
                            pageSize: pageSize,
                            pageNumber: pageNumber
                        }, data: []
                    }
                    this._students.next(empty.data);
                    this._pagination.next(empty.pagination);
                    return of(empty);
                } else {
                    throw error;
                }
            }),
            tap((response) => {
                if (response.body?.length > 0) {
                    var tmp = {
                        total: 0,
                        pageSize: pageSize,
                        pageNumber: pageNumber
                    }
                    this._pagination.next(response.body.pagination ?? tmp);
                    this._students.next(response.body);
                }
            }),
        );
    }

}
