import { CurriculumLevelService } from './../../../core/services/curriculum-level.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
import { ClassService } from 'src/app/core/services/class.service';
import { CurriculumService } from 'src/app/core/services/curriculum.service';
import { ScienceProjectService } from 'src/app/core/services/science-project.service';
import { ScienceReportService } from 'src/app/core/services/science-report.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
    selector: 'app-curriculum',
    templateUrl: './curriculum.component.html',
    styleUrls: ['./curriculum.component.css'],
    providers: [MessageService, ConfirmationService],
})
export class CurriculumComponent implements OnInit {
    items: any;
    curriculums: any;
    visibleCurriculum: boolean = false;
    visibleUpdateCurriculum: boolean = false;
    createCurriculumForm: FormGroup;
    updateCurriculumForm: FormGroup;
    canbos: any;
    search: string = '';

    curriculumLevels: any;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private scienceReportService: ScienceReportService,
        private curriculumService: CurriculumService,
        private curriculumLevelService: CurriculumLevelService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private userService: UserService
    ) {
        this.createCurriculumForm = this.fb.group({
            projectName: [''],
            scienceProjectLevelId: [null],
            userId: [null],
            name: [''],
            publishYear: [null],
            isAuthor: [false],
            memberNumber: [null],
            isAuthorWrite: [false],
            isbn: [''],
            publishingHouse: [''],
            curriculumLevelId: [null],
            workHoursPerProject: [null],
            hoursCalculated: [null],
            note: [''],
        });
        this.updateCurriculumForm = this.fb.group({
            projectName: [''],
            scienceProjectLevelId: [null],
            userId: [null],
            name: [''],
            publishYear: [null],
            isAuthor: [false],
            memberNumber: [null],
            isAuthorWrite: [false],
            isbn: [''],
            publishingHouse: [''],
            curriculumLevelId: [null],
            workHoursPerProject: [null],
            hoursCalculated: [null],
            note: [''],
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

    public selectedScienceReport: any = [];

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
            this.getCurriculum(request);
        });
        this.loadCurriculumLevel();
    }

    public getCurriculum(request: any): any {
        this.curriculumService.getPaging(request).subscribe((result: any) => {
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
                console.log(result.data.items);
                this.curriculums = result.data.items;
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

                if (this.curriculums.length === 0) {
                    this.paging.pageIndex = 1;
                }

                const { items, ...paging } = result.data;
                this.paging = paging;

                this.selectedScienceReport = [];
            }
        });
    }

    public selectAllScience(event: any): void {
        if (event.target.checked) {
            this.selectedScienceReport = this.curriculums.map(
                (teacher: any) => teacher.id
            );
        } else {
            this.selectedScienceReport = [];
        }
    }

    public handleSelectItem(id: number): void {
        if (this.isSelected(id)) {
            this.selectedScienceReport = this.selectedScienceReport.filter(
                (id: any) => id !== id
            );
        } else {
            this.selectedScienceReport.push(id);
        }
    }

    public isSelected(id: number): boolean {
        return this.selectedScienceReport.includes(id);
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

    handleShowUpdateCurriculum(item: any) {
        this.visibleUpdateCurriculum = true;
        this.curriculumService
            .getById({ id: item.id })
            .subscribe((result: any) => {
                if (result.status) {
                }
            });
    }

    public handleDeleteItem(id: number) {}

    public handleCreateItem() {
        console.log(this.createCurriculumForm.value);
        this.curriculumService
            .create({
                ...this.createCurriculumForm.value,
            })
            .subscribe((result: any) => {
                if (result.status) {
                    this.visibleCurriculum = false;
                    this.createCurriculumForm.reset();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Đã thêm hội thảo mới',
                    });
                    this.getCurriculum(this.queryParameters);
                }
            });
    }

    public handleUpdateItem() {
        this.curriculumService
            .update({
                ...this.updateCurriculumForm.value,
            })
            .subscribe((result: any) => {
                if (result.status) {
                    this.visibleUpdateCurriculum = false;
                    this.updateCurriculumForm.reset();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Đã cập nhật hội thảo',
                    });
                    this.getCurriculum(this.queryParameters);
                }
            });
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

    onSelectCanBo(event: any) {
        console.log(event);
        this.createCurriculumForm.get('userId')?.setValue(event.value.id);
    }

    loadCurriculumLevel() {
        this.curriculumLevelService.getPaging({}).subscribe((result: any) => {
            if (result.status) {
                this.curriculumLevels = result.data.items;
            }
        });
    }
    public handleOnSearch(event: any = null): void {
        this.userService
            .getPaging({ name: this.search })
            .subscribe((result: any) => {
                if (result.status) {
                    this.canbos = result.data.items;
                    const { items, ...paging } = result.data;
                    this.paging = paging;
                }
            });
    }
}
