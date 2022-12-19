import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tutor } from 'app/model/tutor.model';
import { Pagination } from 'app/model/pagination.model';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TutorService {
    private _tutors: BehaviorSubject<Tutor[] | null> = new BehaviorSubject(null);
    private _tutor: BehaviorSubject<Tutor | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(null);

    constructor(private _http: HttpClient) { }

    get tutors$(): Observable<Tutor[]> {
        return this._tutors.asObservable();
    }

    get tutor$(): Observable<Tutor> {
        return this._tutor.asObservable();
    }

    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    getTutors(pageNumber: number = 0, pageSize: number = 10, sort: string = 'name', order: 'asc' | 'desc' | '' = 'asc', search: string = '')
        : Observable<any> {
        var params = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            sort: sort,
            order: order,
            search: search
        }
        return this._http.get<any>('/api/tutors/all', { params: params, observe: 'response' }).pipe(
            catchError(error => {
                if (error.status === 404) {
                    var empty = {
                        pagination: {
                            total: 0,
                            pageSize: pageSize,
                            pageNumber: pageNumber
                        }, data: []
                    }
                    this._tutors.next(empty.data);
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
                    this._tutors.next(response.body);
                }
            }),
        );
    }

}
