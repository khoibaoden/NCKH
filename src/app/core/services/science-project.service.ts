import { Injectable } from '@angular/core';
import { HttpLoadingService } from '../https/http-loading.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ScienceProjectService {
    constructor(private http: HttpLoadingService) {}
    getPaging(request: any = null): Observable<any> {
        return this.http.get('scienceproject/paging', request);
    }
    create(request: FormData): Observable<any> {
        return this.http.postFormData('scienceproject/create', request);
    }

    update(request: any): Observable<any> {
        return this.http.putFormData('scienceproject/update', request);
    }

    delete(request: any): Observable<any> {
        return this.http.put('scienceproject/delete', request);
    }
}
