import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpLoadingService } from '../https/http-loading.service';

@Injectable({
    providedIn: 'root',
})
export class CurriculumLevelService {
    constructor(private http: HttpLoadingService) {}
    getPaging(request: any = null): Observable<any> {
        return this.http.get('curriculumlevel/paging', request);
    }

    create(request: FormData): Observable<any> {
        return this.http.postFormData('curriculumlevel/create', request);
    }

    update(request: any): Observable<any> {
        return this.http.putFormData('curriculumlevel/update', request);
    }

    delete(id): Observable<any> {
        return this.http.put(`curriculumlevel/delete?id=${id}`, null);
    }
}
