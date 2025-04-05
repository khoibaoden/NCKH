import { Injectable } from '@angular/core';
import { HttpLoadingService } from '../https/http-loading.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FalcultyService {
    constructor(private http: HttpLoadingService) {}
    getPaging(request: any = null): Observable<any> {
        return this.http.get('faculty/paging', request);
    }

    create(request: FormData): Observable<any> {
        return this.http.postFormData('faculty/create', request);
    }

    update(request: any): Observable<any> {
        return this.http.putFormData('faculty/update', request);
    }

    delete(request: any): Observable<any> {
        return this.http.put('faculty/delete', request);
    }
}
