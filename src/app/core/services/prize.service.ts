import { Injectable } from '@angular/core';
import { HttpLoadingService } from '../https/http-loading.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PrizeService {
    constructor(private http: HttpLoadingService) {}
    getPaging(request: any = null): Observable<any> {
        return this.http.get('prize/paging', request);
    }

    create(request: FormData): Observable<any> {
        return this.http.postFormData('prize/create', request);
    }

    update(request: any): Observable<any> {
        return this.http.putFormData('prize/update', request);
    }

    delete(request: any): Observable<any> {
        return this.http.put('prize/delete', request);
    }
}
