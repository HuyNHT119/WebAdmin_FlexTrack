import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Course } from 'app/model/course.model';
import { Pagination } from 'app/model/pagination.model';
import { Observable } from 'rxjs';
import { CourseService } from './course.service';

@Injectable({
    providedIn: 'root'
})
export class CoursesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _courseService: CourseService) {
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
        pagination: Pagination; data: Course[]
    }> {
        return this._courseService.getCourses();
    }
}
