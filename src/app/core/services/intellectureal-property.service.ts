import { Injectable } from '@angular/core';
import { HttpLoadingService } from '../https/http-loading.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class IntellecturealPropertyService {
    constructor(private http: HttpLoadingService) {}
    getPaging(request: any = null): Observable<any> {
        return this.http.get('class/paging', request);
    }

    create(request: FormData): Observable<any> {
        return this.http.postFormData('class/create', request);
    }

    update(request: any): Observable<any> {
        return this.http.putFormData('class/update', request);
    }

    delete(request: any): Observable<any> {
        return this.http.put('class/delete', request);
    }
}
