import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import pagingConfig, {
    DEFAULT_PAGE_INDEX,
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZE_OPTIONS,
    DEFAULT_PER_PAGE_OPTIONS,
} from 'src/app/core/configs/paging.config';
import systemConfig from 'src/app/core/configs/system.config';
import sortConstant from 'src/app/core/constants/sort.Constant';
import { OfficerService } from 'src/app/core/services/officer.service';

@Component({
    selector: 'app-officer',
    templateUrl: './officer.component.html',
    styleUrl: './officer.component.scss',
    providers: [MessageService, ConfirmationService]
})
export class OfficerComponent implements OnInit {
    items: any;
    editDialogVisible: boolean = false;
    editingDepartment: any = {};
    code: string = '';
    addDialogVisible: boolean = false;
    submitted: boolean = false;

    newDepartment: any = {
        name: '',
        value: 0,
        description: '',
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private officerService: OfficerService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    public config: any = {
        paging: pagingConfig.default,
        baseUrl: systemConfig.baseFileSystemUrl,
        perPageOptions: DEFAULT_PER_PAGE_OPTIONS,
        pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
    };

    public constant: any = {
        sort: sortConstant,
    };

    public staff: any = [];
    public filteredstaff: any = [];

    public paging: any = {
        pageIndex: DEFAULT_PAGE_INDEX,
        pageSize: DEFAULT_PAGE_SIZE,
        sortBy: '',
        orderBy: '',
        totalRecords: 0,
        totalPages: 0,
    };

    public selectedstaff: any = [];

    public queryParameters: any = {
        ...this.config.paging,
        status: 0,
        keyWord: '',
    };

    ngOnInit() {
        this.items = [{ label: 'Cán bộ' }];
        this.route.queryParams.subscribe((params) => {
            const request = {
                ...params,
                pageIndex: params['pageIndex']
                    ? params['pageIndex']
                    : this.config.paging.pageIndex,
                pageSize: params['pageSize']
                    ? params['pageSize']
                    : this.config.paging.pageSize,
            };
            this.queryParameters = {
                ...params,
                status: params['status'] ? params['status'] : 0,
                keyWord: params['keyWord'] ? params['keyWord'] : null,
            };
            this.getstaff(request);
        });
    }

    public getstaff(request: any): any {
        this.officerService.getPaging(request).subscribe((result: any) => {
            if (result.status) {
                if (request.pageIndex !== 1 && result.data.items.length === 0) {
                    this.route.queryParams.subscribe((params) => {
                        const request = { ...params, pageIndex: 1 };
                        this.router.navigate([], {
                            relativeTo: this.route,
                            queryParams: request,
                            queryParamsHandling: 'merge',
                        });
                    });
                }
                this.staff = result.data.items;
                this.filteredstaff = [...this.staff];
                console.log(this.staff);
                if (this.staff.length === 0) {
                    this.paging.pageIndex = 1;
                }
                const { items, ...paging } = result.data;
                this.paging = paging;
                this.paging.totalRecords = this.filteredstaff.length;
                this.selectedstaff = [];
            }
        });
    }

    onPageChange(event: any) {
        this.paging.pageIndex = event.page + 1;
        this.paging.pageSize = event.rows;
    }

    EvenFilter() {
        this.applyFilter();
    }

    private applyFilter() {
        this.filteredstaff = [...this.staff];

        if (this.code) {
            this.filteredstaff = this.filteredstaff.filter((staff: any) =>
                staff.name?.toLowerCase().includes(this.code.toLowerCase())
            );
        }

        this.paging.totalRecords = this.filteredstaff.length;
        this.paging.pageIndex = 1;
    }
}
