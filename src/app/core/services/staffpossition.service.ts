import { Injectable } from '@angular/core';
import { HttpLoadingService } from '../https/http-loading.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class StaffPossitionService {
    constructor(private http: HttpLoadingService) {}
    getPaging(request: any = null): Observable<any> {
        return this.http.get('staffposition/paging', request);
    }

    create(request: any): Observable<any> {
        return this.http.post('staffposition/create', request);
    }

    update(request: any): Observable<any> {
        const staffposition = request.id;
        return this.http.put(`staffposition/update/${staffposition}`, request);
    }

    delete(id: number): Observable<any> {
        return this.http.put('staffposition/delete?id=' + id, null);
    }
}
