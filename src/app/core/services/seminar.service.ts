import { Injectable } from '@angular/core';
import { HttpLoadingService } from '../https/http-loading.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SeminarService {
    constructor(private http: HttpLoadingService) {}
    getPaging(request: any = null): Observable<any> {
        return this.http.get('seminar/paging', request);
    }

    create(request: any): Observable<any> {
        return this.http.post('seminar/create', request);
    }

    update(request: any): Observable<any> {
        const seminarId = request.id;
        return this.http.put(`seminar/update/${seminarId}`, request);
    }

     updateStatus(request: any): Observable<any> {
        const seminarId = request.id;
        return this.http.put(`seminar/update-status/${seminarId}`, request);
    }

    delete(id: number): Observable<any> {
        return this.http.put('seminar/delete?id=' + id, null);
    }

    getPaingProcess(request: any = null): Observable<any> {
        return this.http.get('user/paging-info', request);
    }

    getPaingBM(request: any = null): Observable<any> {
        return this.http.get('seminarlevel/paging', request);
    }
}
