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
        pageSize: DEFAULT_PAGE_SIZE,
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
    };

    constructor(
        private statisticService: StatisticService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.items = [{ label: 'Vị trí nhân sự' }];
        this.getStatistic(this.queryParameters);
    }

    public getStatistic(request: any): any {
        this.statisticService
            .getStatisticTotalHours()
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
                    // this.classes = this.classes.map(
                    //     (class: any) => ({
                    //         ...class,
                    //         status:
                    //             this.constant.class.status.find(
                    //                 (status: any) =>
                    //                     status.value === class.status
                    //             )?.label ?? '',
                    //     })
                    // );

                    if (this.statistics.length === 0) {
                        this.paging.pageIndex = 1;
                    }

                    const { items, ...paging } = result.data;
                    this.paging = paging;
                }
            });
    }
}
