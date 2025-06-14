import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpLoadingService } from '../https/http-loading.service';

@Injectable({
    providedIn: 'root',
})
export class StaffPositionService {
    constructor(private http: HttpLoadingService) {}
    getPaging(request: any = null): Observable<any> {
        return this.http.get('staffposition/paging', request);
    }

    create(request: FormData): Observable<any> {
        return this.http.postFormData('staffposition/create', request);
    }

    update(request: any): Observable<any> {
        return this.http.putFormData('staffposition/update', request);
    }

    delete(request: any): Observable<any> {
        return this.http.put('staffposition/delete', request);
    }
}
