import { Injectable } from '@angular/core';
import { HttpLoadingService } from '../https/http-loading.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NewsService {
    constructor(private http: HttpLoadingService) {}
    getPaging(request: any = null): Observable<any> {
        return this.http.get('articleproject/paging', request);
    }

    updateBodyAndQueryParamsStatus(
        dataQueryParams: any,
        dataBody: any
    ): Observable<any> {
        return this.http.putBodyAndQueryParams(
            'articleproject/update',
            dataQueryParams,
            dataBody
        );
    }
      updateBodyAndQueryParamsStatusStatus(
        dataQueryParams: any,
        dataBody: any
    ): Observable<any> {
        return this.http.putBodyAndQueryParams(
            'articleproject/update-status',
            dataQueryParams,
            dataBody
        );
    }

    create(request: FormData): Observable<any> {
        return this.http.postFormData('articleproject/create', request);
    }

    update(request: any): Observable<any> {
        return this.http.putFormData('articleproject/update', request);
    }

    getById(request: any = null): Observable<any> {
        return this.http.get('articleproject/get-by-id', request);
    }
    delete(request: any, request2: any): Observable<any> {
        return this.http.putBodyAndQueryParams(
            'articleproject/delete',
            request,
            request2
        );
    }
}
