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

    create(request: FormData): Observable<any> {
        return this.http.postFormData('seminar/create', request);
    }

    update(request: any): Observable<any> {
        return this.http.putFormData('seminar/update', request);
    }

    delete(request: any): Observable<any> {
        return this.http.put('seminar/delete', request);
    }

    getPaingProcess(request: any = null): Observable<any> {
        return this.http.get('user/paging-info', request);
    }

    getPaingBM(request: any = null): Observable<any> {
        return this.http.get('seminarlevel/paging', request);
    }
}
