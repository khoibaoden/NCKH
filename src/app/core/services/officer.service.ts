import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpLoadingService } from '../https/http-loading.service';

@Injectable({
    providedIn: 'root',
})
export class OfficerService {
    constructor(private http: HttpLoadingService) {}
    getPaging(request: any = null): Observable<any> {
        return this.http.get('user/paging-info', request);
    }
}
