import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Account } from 'app/model/account.model';
import { Pagination } from 'app/model/pagination.model';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private _accounts: BehaviorSubject<Account[] | null> = new BehaviorSubject(null);
    private _account: BehaviorSubject<Account | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(null);

    constructor(private _http: HttpClient) { }

    get accounts$(): Observable<Account[]> {
        return this._accounts.asObservable();
    }

    get account$(): Observable<Account> {
        return this._account.asObservable();
    }

    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    getAccounts(pageNumber: number = 0, pageSize: number = 10, sort: string = 'name', order: 'asc' | 'desc' | '' = 'asc', search: string = '')
        : Observable<any> {
        var params = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            sort: sort,
            order: order,
            search: search
        }
        return this._http.post<any>('/api/v1/accounts/searchUserForAdmin', params, { observe: 'response' }).pipe(
            catchError(error => {
                if (error.status === 404) {
                    var empty = {
                        pagination: {
                            total: 0,
                            pageSize: pageSize,
                            pageNumber: pageNumber
                        }, data: []
                    }
                    this._accounts.next(empty.data);
                    this._pagination.next(empty.pagination);
                    return of(empty);
                } else {
                    throw error;
                }
            }),
            tap((response) => {
                console.log(response);
                if (response.body?.content.length > 0) {
                    var tmp = {
                        total: 0,
                        pageSize: pageSize,
                        pageNumber: pageNumber
                    }
                    this._pagination.next(response.body.pagination ?? tmp);
                    this._accounts.next(response.body.content);
                }
            }),
        );
    }

    changeAccountStatus(data: any) {
        return this._http.post<any>('/api/v1/accounts/activeAccount', data, { observe: 'response' });
    }

}