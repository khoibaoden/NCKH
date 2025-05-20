import { Injectable } from '@angular/core';
import { HttpLoadingService } from '../https/http-loading.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class StudentGuideService {
    constructor(private http: HttpLoadingService) {}
    getPaging(request: any = null): Observable<any> {
        return this.http.get('studentguide/paging', request);
    }
    create(request: FormData): Observable<any> {
        return this.http.postFormData('studentguide/create', request);
    }

    update(id: any, request: any): Observable<any> {
        return this.http.putFormData(
            `intellectualproperty/update?id=${id}`,
            request
        );
    }
    updateBodyAndQueryParamsStatus(
        dataQueryParams: any,
        dataBody: any
    ): Observable<any> {
        return this.http.putBodyAndQueryParams(
            'studentguide/update',
            dataQueryParams,
            dataBody
        );
    }

    delete(id): Observable<any> {
        return this.http.put(`studentguide/delete?id=${id}`, null);
    }

    getById(request: any = null): Observable<any> {
        return this.http.get('studentguide/get-by-id', request);
    }
}
