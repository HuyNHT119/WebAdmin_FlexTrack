import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Student } from 'app/model/student.model';
import { Pagination } from 'app/model/pagination.model';
import { Observable } from 'rxjs';
import { StudentService } from './student.service';

@Injectable({
    providedIn: 'root'
})
export class StudentsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _studentService: StudentService) {
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
        pagination: Pagination; data: Student[]
    }> {
        return this._studentService.getStudents();
    }
}
