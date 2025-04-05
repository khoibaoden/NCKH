import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpLoadingService } from '../https/http-loading.service';

@Injectable({
    providedIn: 'root',
})
export class StudentGuideLevelService {
    constructor(private http: HttpLoadingService) {}
    getPaging(request: any = null): Observable<any> {
        return this.http.get('staff-position/paging', request);
    }

    create(request: FormData): Observable<any> {
        return this.http.postFormData('staff-position/create', request);
    }

    update(request: any): Observable<any> {
        return this.http.putFormData('staff-position/update', request);
    }

    delete(request: any): Observable<any> {
        return this.http.put('staff-position/delete', request);
    }
}
