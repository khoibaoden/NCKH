import { Injectable } from '@angular/core';
import { HttpLoadingService } from '../https/http-loading.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ScienceReportService {
    constructor(private http: HttpLoadingService) {}
    getPaging(request: any = null): Observable<any> {
        return this.http.get('sciencereport/paging', request);
    }
    create(request: FormData): Observable<any> {
        return this.http.postFormData('sciencereport/create', request);
    }

    update(request: any, request2: any): Observable<any> {
        return this.http.putBodyAndQueryParams(
            'sciencereport/update',
            request,
            request2
        );
    }
     updateStatus(request: any, request2: any): Observable<any> {
        return this.http.putBodyAndQueryParams(
            'sciencereport/update-status',
            request,
            request2
        );
    }

    delete(request: any, request2: any): Observable<any> {
        return this.http.putBodyAndQueryParams(
            'sciencereport/delete',
            request,
            request2
        );
    }
}
