import { Injectable } from '@angular/core';
import { HttpLoadingService } from '../https/http-loading.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class IntellecturealPropertyService {
    constructor(private http: HttpLoadingService) {}
    getPaging(request: any = null): Observable<any> {
        return this.http.get('intellecturalproperty/paging', request);
    }
    create(request: FormData): Observable<any> {
        return this.http.postFormData('intellecturalproperty/create', request);
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
            'intellecturalproperty/update',
            dataQueryParams,
            dataBody
        );
    }

    delete(request: any): Observable<any> {
        return this.http.put('intellecturalproperty/delete', request);
    }

    getById(request: any = null): Observable<any> {
        return this.http.get('intellecturalproperty/get-by-id', request);
    }
}
