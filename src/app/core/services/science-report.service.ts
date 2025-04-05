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

    update(request: any): Observable<any> {
        return this.http.putFormData('sciencereport/update', request);
    }

    delete(request: any): Observable<any> {
        return this.http.put('sciencereport/delete', request);
    }
}
