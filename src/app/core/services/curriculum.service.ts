import { Injectable } from '@angular/core';
import { HttpLoadingService } from '../https/http-loading.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CurriculumService {
    constructor(private http: HttpLoadingService) {}
    getPaging(request: any = null): Observable<any> {
        return this.http.get('curriculum/paging', request);
    }
    create(request: FormData): Observable<any> {
        return this.http.postFormData('curriculum/create', request);
    }

    update(request: any): Observable<any> {
        return this.http.putFormData('curriculum/update', request);
    }

    delete(request: any): Observable<any> {
        return this.http.put('curriculum/delete', request);
    }
    getById(request: any = null): Observable<any> {
        return this.http.get('curriculum/get-by-id', request);
    }
}
