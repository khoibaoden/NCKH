import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpLoadingService } from '../https/http-loading.service';

@Injectable({
    providedIn: 'root',
})
export class DepartmentService {
    constructor(private http: HttpLoadingService) {}
    getPaging(request: any = null): Observable<any> {
        return this.http.get('seminarlevel/paging', request);
    }

    create(request: any): Observable<any> {
        return this.http.post('seminarlevel/create', request);
    }

    update(request: any): Observable<any> {
        const seminarId = request.id;
        return this.http.put(`seminarlevel/update/${seminarId}`, request);
    }

    delete(id: number): Observable<any> {
        return this.http.put('seminarlevel/delete?id=' + id, null);
    }
}
