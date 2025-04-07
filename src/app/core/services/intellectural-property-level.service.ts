import { Injectable } from '@angular/core';
import { HttpLoadingService } from '../https/http-loading.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class IntellecturalPropertyLevelService {
    constructor(private http: HttpLoadingService) {}
    getPaging(request: any = null): Observable<any> {
        return this.http.get('intellecturealpropertylevel/paging', request);
    }
    create(request: FormData): Observable<any> {
        return this.http.postFormData(
            'intellecturealpropertylevel/create',
            request
        );
    }
    update(request: any): Observable<any> {
        return this.http.putFormData(
            'intellecturealpropertylevel/update',
            request
        );
    }

    delete(request: any): Observable<any> {
        return this.http.put('intellecturealpropertylevel/delete', request);
    }
}
