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
import { AuthService } from 'src/app/core/services/identity/auth.service';
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
    authorsList: any = [];
    curriculumId: any;
    search: string = '';
    keyWord: any;
    selectedAuthor: any;
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
        private userService: UserService,
        private authService: AuthService
    ) {
        this.createCurriculumForm = this.fb.group({
            userId: [null],
            userName:[null],
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
        keyWord: '',
        authorName: '',
    };
    userCurrent: any;
    ngOnInit() {
        this.items = [{ label: 'Quản lý viết sách' }];
        this.authService.userCurrent.subscribe((result: any) => {
            this.userCurrent = result;
        });
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
                keyWord: params['keyWord'] ? params['keyWord'] : '',
            };

            this.getCurriculum(request);
        });

        this.loadCanbos();
        this.loadCurriculumLevel();
    }

    public getCurriculum(request: any): any {
        this.curriculumService
            .getPaging({
                ...request,
                userId: this.userCurrent.id != 1 ? this.userCurrent.id : null,
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

                    this.curriculums = result.data.items;
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

    handleShowUpdateCurriculum(item: any) {
        this.visibleUpdateCurriculum = true;
        this.curriculumId = item;
        this.curriculumService
            .getById({ id: item.id })
            .subscribe((result: any) => {
                if (result.status) {
                    this.updateCurriculumForm = this.fb.group({
                        userId: [result.data.userId],
                        name: [result.data.name],
                        publishYear: [result.data.publishYear],
                        isAuthor: [result.data.isAuthor],
                        memberNumber: [result.data.memberNumber],
                        isAuthorWrite: [result.data.isAuthorWrite],
                        isbn: [result.data.isbn],
                        publishingHouse: [result.data.publishingHouse],
                        curriculumLevelId: [result.data.curriculumLevelId],
                        workHoursPerProject: [result.data.workHoursPerProject],
                        hoursCalculated: [result.data.hoursCalculated],
                        note: [result.data.note],
                    });
                }
            });
    }

    handleSearchAuthor(event: any) {
        this.userService
            .getPaging({ name: event.query })
            .subscribe((result: any) => {
                if (result.status) {
                    this.authorsList = result.data.items;
                }
            });
    }

    //Thêm
    public handleCreateItem() {
        const formValue = this.createCurriculumForm.value;
        console.log(formValue);

        const isChiefAuthor = formValue.isAuthor; // Có phải chủ biên?
        const isAuthorWrite = formValue.isAuthorWrite; // Có tham gia viết?
        const memberNumber = Number(formValue.memberNumber); // Số lượng tác giả
        const workHoursPerProject = Number(formValue.workHoursPerProject); // Định mức giờ

        let calculatedHours = 0;

        // Nếu không đủ dữ liệu thì không tính
        if ( !isChiefAuthor ||!memberNumber || !workHoursPerProject) {
            calculatedHours = 0;
            console.warn('Thiếu dữ liệu cần thiết hoặc không phải chủ biên');
            console.log("cho chet "+isChiefAuthor+"meochet"+memberNumber+"gahcet"+workHoursPerProject)
        } else {
            const L = workHoursPerProject;
            const H = memberNumber;

            console.log(isChiefAuthor)
            console.log(L)
            console.log(H)
            if (isAuthorWrite) {
                // Là chủ biên và có viết
                calculatedHours = (1 / 5) * L + ((1 / H) * (4 / 5) * L);
            } else {
                calculatedHours = ((1 / H) * (4 / 5) * L);
                // không phải là chủ biên nhưng chủ biên nhưng có viết
            }
        }
        if(isChiefAuthor==false){
             const L = workHoursPerProject;
            const H = memberNumber;

            calculatedHours = (1 / H) * ((4/5)*L);
        }

        // Làm tròn kết quả


        formValue.hoursCalculated = Math.round(calculatedHours);
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

    public loadCanbos(event: any = null): void {
        this.userService
            .getPaging({ name: this.search, pageSize: 100 })
            .subscribe((result: any) => {
                if (result.status) {
                    this.canbos = result.data.items;
                }
            });
    }

    //Cập nhật
    public handleUpdateItem() {
        this.curriculumService
            .updateBodyAndQueryParamsStatus(
                {
                    id: this.curriculumId.id,
                },
                {
                    ...this.updateCurriculumForm.value,
                }
            )
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

    // onSelectCanBo(event: any) {
    //     this.createCurriculumForm.get('userId')?.setValue(event.value.id);
    // }

    onSelectCanBo(event: any) {
        this.createCurriculumForm.get('userId')?.setValue(event.value.id);
        this.createCurriculumForm.get('userName')?.setValue(event.value);

    }

    loadCurriculumLevel() {
        this.curriculumLevelService
            .getPaging({ pageSize: 1000 })
            .subscribe((result: any) => {
                if (result.status) {
                    this.curriculumLevels = result.data.items;
                }
            });
    }
    onCurriculumLevelChange(event: any): void {
        console.log(event);
        const selectedId = event.value;
        const selectedLevel = this.curriculumLevels.find(
            (level) => level.id === selectedId
        );

        this.createCurriculumForm.patchValue({
            workHoursPerProject: selectedLevel.value,
        });

        console.log('Bạn đã chọn:', selectedLevel);
    }
    onEditCurriculumLevelChange(event: any): void {
        console.log(event);
        const selectedId = event.value;
        const selectedLevel = this.curriculumLevels.find(
            (level) => level.id === selectedId
        );

        this.updateCurriculumForm.patchValue({
            workHoursPerProject: selectedLevel.value,
        });

        console.log('Bạn đã chọn:', selectedLevel);
    }
    //Xóa
    handleDeleteItem(id: number) {
        this.confirmationService.confirm({
            message: 'Bạn có chắc chắn muốn xóa bản ghi này?',
            header: 'Xác nhận',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.curriculumService.delete(id).subscribe((result: any) => {
                    if (result.status) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Thành công',
                            detail: 'Đã xóa hội thảo',
                        });
                        this.getCurriculum(this.queryParameters);
                    }
                });
            },
        });
    }

    // public handleOnSearch(event: any = null): void {
    //     this.userService
    //         .getPaging({ name: this.search })
    //         .subscribe((result: any) => {
    //             if (result.status) {
    //                 this.canbos = result.data.items;
    //             }
    //         });
    // }
    public handleOnSearch(event: any = null): void {
        this.userService
            .getPaging({ name: event.query, pageSize: 100 })
            .subscribe((result: any) => {
                if (result.status) {
                    this.canbos = result.data.items;
                }
            });
    }

    //Phân trang
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

    public handleSearchCurriculum() {
        this.route.queryParams.subscribe((params) => {
            const request = {
                ...params,
                keyWord: this.queryParameters.keyWord
                    ? this.queryParameters.keyWord
                    : '',
                authorName: this.queryParameters.authorName
                    ? this.queryParameters.authorName
                    : '',
            };

            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: request,
                queryParamsHandling: 'merge',
            });
        });
    }
}
