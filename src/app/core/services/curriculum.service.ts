import { Injectable } from '@angular/core';
import { HttpLoadingService } from '../https/http-loading.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CurriculumService {
    constructor(private http: HttpLoadingService) {}
    getPaging(request: any = null): Observable<any> {
        return this.http.get('curriculum/paging', request);
    }
    create(request: any): Observable<any> {
        return this.http.post('curriculum/create', request);
    }

    update(request: any): Observable<any> {
        return this.http.put('curriculum/update', request);
    }
    updateBodyAndQueryParamsStatus(
        dataQueryParams: any,
        dataBody: any
    ): Observable<any> {
        return this.http.putBodyAndQueryParams(
            'curriculum/update',
            dataQueryParams,
            dataBody
        );
    }

    delete(id): Observable<any> {
        return this.http.put(`curriculum/delete?id=${id}`, null);
    }
    getById(request: any = null): Observable<any> {
        return this.http.get('curriculum/get-by-id', request);
    }
}
