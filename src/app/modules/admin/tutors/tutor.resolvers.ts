import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Tutor } from 'app/model/tutor.model';
import { Pagination } from 'app/model/pagination.model';
import { Observable } from 'rxjs';
import { TutorService } from './tutor.service';

@Injectable({
    providedIn: 'root'
})
export class TutorsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _tutorService: TutorService) {
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
        pagination: Pagination; data: Tutor[]
    }> {
        return this._tutorService.getTutors();
    }
}
