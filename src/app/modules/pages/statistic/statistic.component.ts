import { ActivatedRoute, Router } from '@angular/router';
import { StatisticService } from './../../../core/services/statistic.service';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import pagingConfig, {
    DEFAULT_PAGE_INDEX,
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZE_OPTIONS,
    DEFAULT_PER_PAGE_OPTIONS,
} from 'src/app/core/configs/paging.config';
import systemConfig from 'src/app/core/configs/system.config';
import { AuthService } from 'src/app/core/services/identity/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { el } from '@fullcalendar/core/internal-common';

@Component({
    selector: 'app-statistic',
    templateUrl: './statistic.component.html',
    styleUrls: ['./statistic.component.css'],
    providers: [MessageService, ConfirmationService],
})
export class StatisticComponent implements OnInit {
    items: any;
    statistics: any;
    public config: any = {
        paging: pagingConfig.default,
        baseUrl: systemConfig.baseFileSystemUrl,
        perPageOptions: DEFAULT_PER_PAGE_OPTIONS,
        pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
    };

    public paging: any = {
        pageIndex: DEFAULT_PAGE_INDEX,
        pageSize: DEFAULT_PAGE_SIZE * 100,
        sortBy: '',
        orderBy: '',
        totalRecords: 0,
        totalPages: 0,
    };

    public selectedclass: any = [];

    public queryParameters: any = {
        ...this.config.paging,
        status: 0,
        keyWord: '',
        startDate: null,
        endDate: null,
        pageSize: 100
    };
    userCurrent: any = {};

    constructor(
        private statisticService: StatisticService,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private http: HttpClient
    ) {
        this.authService.userCurrent.subscribe((user) => {
            console.log(user);
            this.userCurrent = user;
        });
    }

    ngOnInit() {
        this.items = [{ label: 'Thống kê' }];

        this.getStatistic();
    }
    reLoad() {
        this.queryParameters.startDate=undefined;
        this.queryParameters.endDate=undefined;
        // this.getStatistic();
         const request = {
            pageIndex: 1,
            pageSize: 100,
            userId: this.userCurrent?.id == 1 ? undefined : this.userCurrent.id
        }
        this.statisticService
            .getStatisticTotalHours({
                ...request,
                // startDate: this.queryParameters?.startDate?.toISOString(),
                // endDate: this.queryParameters?.endDate?.toISOString(),
            })
            .subscribe((result: any) => {
                if (result.status) {
                    if (
                        request.pageIndex !== 1 &&
                        result.data.items.length === 0
                    ) {
                        this.route.queryParams.subscribe((params) => {
                            const request = {
                                ...params,
                                pageIndex: 1,
                            };

                            this.router.navigate([], {
                                relativeTo: this.route,
                                queryParams: request,
                                queryParamsHandling: 'merge',
                            });
                        });
                    }

                    this.statistics = result.data;
                    if (this.statistics.length === 0) {
                        this.paging.pageIndex = 1;
                    }

                    const { items, ...paging } = result.data;
                    this.paging = paging;
                }
            });

    }


    filterByDateRange() { }
    public getStatistic(): any {
        const request = {
            pageIndex: 1,
            pageSize: 100,
            userId: this.userCurrent?.id == 1 ? undefined : this.userCurrent.id
        }
        this.statisticService
            .getStatisticTotalHours({
                ...request,
                startDate: this.queryParameters?.startDate?.toISOString(),
                endDate: this.queryParameters?.endDate?.toISOString(),
            })
            .subscribe((result: any) => {
                if (result.status) {
                    if (
                        request.pageIndex !== 1 &&
                        result.data.items.length === 0
                    ) {
                        this.route.queryParams.subscribe((params) => {
                            const request = {
                                ...params,
                                pageIndex: 1,
                            };

                            this.router.navigate([], {
                                relativeTo: this.route,
                                queryParams: request,
                                queryParamsHandling: 'merge',
                            });
                        });
                    }

                    this.statistics = result.data;
                    if (this.statistics.length === 0) {
                        this.paging.pageIndex = 1;
                    }

                    const { items, ...paging } = result.data;
                    this.paging = paging;
                }
            });


    }
    export() {
        var request = {};
        if (this.userCurrent.id === 1) {
            request = {
                pageIndex: 1,
                pageSize: 100,
                // userId: this.userCurrent?.id === 1 ? null : this.userCurrent.id,
                startDate: this.queryParameters?.startDate?.toISOString()?this.queryParameters?.startDate?.toISOString():'',
                endDate: this.queryParameters?.endDate?.toISOString()?this.queryParameters?.endDate?.toISOString():''
            }
        }
         else {
                request = {
                    pageIndex: 1,
                    pageSize: 100,
                    userId: this.userCurrent?.id === 1 ? null : this.userCurrent.id,
                    startDate: this.queryParameters?.startDate?.toISOString()?this.queryParameters?.startDate?.toISOString():'',
                     endDate: this.queryParameters?.endDate?.toISOString()?this.queryParameters?.endDate?.toISOString():''   
                };
            }

        

        const params = new HttpParams({ fromObject: request });

        this.http.get('https://localhost:7115/api/statistic/export-excel', {
            params,
            responseType: 'blob'
        }).subscribe(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'teacher_statistics.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);
        });
    }




}
