import { Injectable } from '@angular/core';
import { HttpLoadingService } from '../https/http-loading.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class StaffPositionService {
    constructor(private http: HttpLoadingService) {}
    getPaging(request: any = null): Observable<any> {
        return this.http.get('articleproject/paging', request);
    }

    create(request: FormData): Observable<any> {
        return this.http.postFormData('articleproject/create', request);
    }

    update(request: any): Observable<any> {
        return this.http.putFormData('articleproject/update', request);
    }

    delete(request: any): Observable<any> {
        return this.http.put('articleproject/delete', request);
    }
}
