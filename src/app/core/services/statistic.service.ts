import { Injectable } from '@angular/core';
import { HttpLoadingService } from '../https/http-loading.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class StatisticService {
    constructor(private http: HttpLoadingService) {}

    getPaging(request: any = null): Observable<any> {
        return this.http.get('statistic/paging', request);
    }

    getStatisticTotalHours(request: any = null): Observable<any> {
        return this.http.get('statistic/statistic-total-hours', request);
    }

    create(request: any): Observable<any> {
        return this.http.post('statistic/create', request);
    }

    update(request: any): Observable<any> {
        const statisticId = request.id;
        return this.http.put(`statistic/update/${statisticId}`, request);
    }

    delete(id: number): Observable<any> {
        return this.http.put('statistic/delete?id=' + id, null);
    }

    getPaingProcess(request: any = null): Observable<any> {
        return this.http.get('user/paging-info', request);
    }

    getPaingBM(request: any = null): Observable<any> {
        return this.http.get('statisticlevel/paging', request);
    }
}
