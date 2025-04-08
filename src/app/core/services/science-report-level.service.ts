import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpLoadingService } from '../https/http-loading.service';

@Injectable({
    providedIn: 'root',
})
export class ScienceReportLevelService {
    constructor(private http: HttpLoadingService) {}
    getPaging(request: any = null): Observable<any> {
        return this.http.get('sciencereportlevel/paging', request);
    }
    create(request: FormData): Observable<any> {
        return this.http.postFormData('sciencereportlevel/create', request);
    }

    update(request: any): Observable<any> {
        return this.http.putFormData('sciencereportlevel/update', request);
    }

    delete(request: any): Observable<any> {
        return this.http.put('sciencereportlevel/delete', request);
    }
}
