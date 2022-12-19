import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Account } from 'app/model/account.model';
import { Pagination } from 'app/model/pagination.model';
import { Observable } from 'rxjs';
import { AccountService } from './account.service';

@Injectable({
    providedIn: 'root'
})
export class AccountsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _accountService: AccountService) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{
        pagination: Pagination; data: Account[]
    }> {
        return this._accountService.getAccounts();
    }
}
