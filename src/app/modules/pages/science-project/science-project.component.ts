import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import pagingConfig, {
    DEFAULT_PAGE_INDEX,
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZE_OPTIONS,
    DEFAULT_PER_PAGE_OPTIONS,
} from 'src/app/core/configs/paging.config';
import systemConfig from 'src/app/core/configs/system.config';
import sortConstant from 'src/app/core/constants/sort.Constant';
import { ClassService } from 'src/app/core/services/class.service';

@Component({
    selector: 'app-science-project',
    templateUrl: './science-project.component.html',
    styleUrls: ['./science-project.component.css'],
})
export class ScienceProjectComponent implements OnInit {
    // items: any[] = [];
    // constructor() {}

    // ngOnInit() {}
    visibleScienceProject: boolean = false;
    createScienceProjectForm: FormGroup;
    items: any;
    scienceProjects: any;
    statusOptions: any;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private classService: ClassService,
        private fb: FormBuilder
    ) {
        this.createScienceProjectForm = this.fb.group({
            projectName: ['', Validators.required],
            scienceProjectLevelId: [null, Validators.required],
            startYear: [null],
            endYear: [null],
            projectLeader: [''],
            memberCount: [null],
            projectCode: [''],
            durationInYears: [null],
            workHoursPerProject: [null],
            hoursCalculated: [null],
            projectManagerId: [null],
            managingAgency: [''],
            scienceProjecStatus: [0],
            notes: [''],
            acceptanceDate: [null],
            membersName: [''],
        });
    }

    public config: any = {
        paging: pagingConfig.default,
        baseUrl: systemConfig.baseFileSystemUrl,
        perPageOptions: DEFAULT_PER_PAGE_OPTIONS,
        pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
    };

    // public constant: any = {
    //     class: classConstant,
    //     sort: sortConstant,
    // };

    public paging: any = {
        pageIndex: DEFAULT_PAGE_INDEX,
        pageSize: DEFAULT_PAGE_SIZE,
        sortBy: '',
        orderBy: '',
        totalRecords: 0,
        totalPages: 0,
    };

    public selectedScienceProjects: any = [];

    public queryParameters: any = {
        ...this.config.paging,
        status: 0,
        keyWord: '',
    };

    ngOnInit() {
        this.items = [{ label: 'Vị trí nhân sự' }];
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

            this.getScience(request);
        });
    }

    public getScience(request: any): any {
        this.scienceProjects.getPaging(request).subscribe((result: any) => {
            if (result.status) {
                if (request.pageIndex !== 1 && result.data.items.length === 0) {
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

                this.scienceProjects = result.data.items;

                if (this.scienceProjects.length === 0) {
                    this.paging.pageIndex = 1;
                }

                const { items, ...paging } = result.data;
                this.paging = paging;

                this.selectedScienceProjects = [];
            }
        });
    }

    public selectAllScience(event: any): void {
        if (event.target.checked) {
            this.selectedScienceProjects = this.scienceProjects.map(
                (teacher: any) => teacher.id
            );
        } else {
            this.selectedScienceProjects = [];
        }
    }

    public handleSelectItem(id: number): void {
        if (this.isSelected(id)) {
            this.selectedScienceProjects = this.selectedScienceProjects.filter(
                (id: any) => id !== id
            );
        } else {
            this.selectedScienceProjects.push(id);
        }
    }

    public isSelected(id: number): boolean {
        return this.selectedScienceProjects.includes(id);
    }

    public handleSearchclass() {
        this.route.queryParams.subscribe((params) => {
            const request = {
                ...params,
                status: this.queryParameters.status
                    ? this.queryParameters.status
                    : null,
                keyWord: this.queryParameters.keyWord
                    ? this.queryParameters.keyWord
                    : null,
            };

            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: request,
                queryParamsHandling: 'merge',
            });
        });
    }

    onPageChange(event: any) {
        this.paging.pageIndex = event.page + 1;
        this.paging.pageSize = event.rows;
        this.route.queryParams.subscribe((params) => {
            const request = {
                ...params,
                pageIndex: event.page + 1,
                pageSize: event.rows,
            };

            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: request,
                queryParamsHandling: 'merge',
            });
        });
    }
}
