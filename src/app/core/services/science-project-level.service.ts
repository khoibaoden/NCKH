import { Injectable } from '@angular/core';
import { HttpLoadingService } from '../https/http-loading.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ScienceProjectLevelService {
    constructor(private http: HttpLoadingService) {}
    getPaging(request: any = null): Observable<any> {
        return this.http.get('scienceprojectlevel/paging', request);
    }
    create(request: FormData): Observable<any> {
        return this.http.postFormData('scienceprojectlevel/create', request);
    }

    update(request: any): Observable<any> {
        return this.http.putFormData('scienceprojectlevel/update', request);
    }

    delete(request: any): Observable<any> {
        return this.http.put('scienceprojectlevel/delete', request);
    }
}
