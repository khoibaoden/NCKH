import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpLoadingService } from '../https/http-loading.service';

@Injectable({
    providedIn: 'root',
})
export class ArticleProjectLevelService {
    constructor(private http: HttpLoadingService) {}
    getPaging(request: any = null): Observable<any> {
        return this.http.get('articleprojectlevel/paging', request);
    }
    create(request: FormData): Observable<any> {
        return this.http.postFormData('articleprojectlevel/create', request);
    }

    update(request: any): Observable<any> {
        return this.http.putFormData('articleprojectlevel/update', request);
    }

    delete(request: any): Observable<any> {
        return this.http.put('articleprojectlevel/delete', request);
    }
}
