import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, Form } from '@angular/forms';
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
import classConstant from 'src/app/core/constants/staff-position.constant';
import { ClassService } from 'src/app/core/services/class.service';
import { AuthService } from 'src/app/core/services/identity/auth.service';
import { UserService } from 'src/app/core/services/identity/user.service';
import { IntellecturalPropertyLevelService } from 'src/app/core/services/intellectural-property-level.service';
import { IntellecturealPropertyService } from 'src/app/core/services/intellectureal-property.service';

@Component({
    selector: 'app-intellectureal-property',
    templateUrl: './intellectureal-property.component.html',
    styleUrls: ['./intellectureal-property.component.css'],
    providers: [MessageService, ConfirmationService],
})
export class IntellecturealPropertyComponent implements OnInit {
    createIntellecturealForm: FormGroup;
    items: any;
    filteredItems: any;
    search: any;
    users: any;
    intellectualPropertyLevels: any = [];
    updateIntellecturealForm: FormGroup;
    totalRecordsCount: any = 0;
    intellecturalPropertyId: any;
    visibleUpdateIntellectureal: boolean = false;
    membersList = [
        { name: 'Nguyễn Văn A', id: 1 },
        { name: 'Trần Thị B', id: 2 },
        { name: 'Lê Văn C', id: 3 },
        // thêm thành viên tùy ý
    ];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private intellecturealPropertyService: IntellecturealPropertyService,
        private intellecturalPropertyLevelService: IntellecturalPropertyLevelService,
        private authService: AuthService
    ) {
        this.createIntellecturealForm = this.formBuilder.group({
            userId: [null, [Validators.required]],
            name: [null, Validators.required],
            acceptanceDate: [null],
            membersName: [null], // Đã đúng rồi nè
            teamNumber: [null],
            intellecturalPropertyLevelId: [null, Validators.required],
            workHoursPerProject: [null],
            hoursCalculated: [null],
            note: [null],
        });

        this.updateIntellecturealForm = this.formBuilder.group({
            userId: ['', [Validators.required]],
            name: ['', Validators.required],
            acceptanceDate: [null],
            membersName: [''], // Đã đúng rồi nè
            teamNumber: [null],
            intellecturalPropertyLevelId: [null, Validators.required],
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

    public constant: any = {
        IntellecturealProperty: classConstant,
        sort: sortConstant,
    };

    //Banners
    public intellecturealPropertys: any = [];

    public paging: any = {
        pageIndex: DEFAULT_PAGE_INDEX,
        pageSize: DEFAULT_PAGE_SIZE,
        sortBy: '',
        orderBy: '',
        totalRecords: 0,
        totalPages: 0,
    };

    IntellecturealProperty: any;
    public selectedclass: any = [];

    public queryParameters: any = {
        ...this.config.paging,
        status: 0,
        keyWord: '',
    };
    canbos: any;
    visibleIntellectureal: boolean = false;
    userCurrent: any;
    ngOnInit() {
        this.items = [{ label: 'Danh sách sở hữu trí tuệ' }];
        this.authService.userCurrent.subscribe((user) => {
            console.log(user);
            this.userCurrent = user;
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
                status: params['status'] ? params['status'] : 0,
                keyWord: params['keyWord'] ? params['keyWord'] : null,
            };
            this.getIntellecturealProperty(request);
        });

        this.loadUser();
        this.loadCanbos();
        this.loadIntellecturealPropertyLevel();
    }

    onSelectCanBo(event: any) {
        this.createIntellecturealForm.get('userId')?.setValue(event.value);
    }

    loadIntellecturealPropertyLevel() {
        this.intellecturalPropertyLevelService
            .getPaging({ pageSize: 1000 })
            .subscribe((result: any) => {
                if (result.status) {
                    this.intellectualPropertyLevels = result.data.items;
                }
            });
    }

    public handleOnSearch(event: any = null): void {
        this.userService
            .getPaging({ name: this.search })
            .subscribe((result: any) => {
                if (result.status) {
                    this.canbos = result.data.items;
                }
            });
    }
    public loadCanbos(event: any = null): void {
        this.userService
            .getPaging({ name: this.search })
            .subscribe((result: any) => {
                if (result.status) {
                    this.canbos = result.data.items;
                }
            });
    }

    showDialogIntellectureal() {
        this.visibleIntellectureal = true;
    }

    public handleSearchIntellecturealProperty() {
        this.route.queryParams.subscribe((params) => {
            const request = {
                ...params,
                keyWord: this.queryParameters.keyWord
                    ? this.queryParameters.keyWord
                    : '',
            };

            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: request,
                queryParamsHandling: 'merge',
            });
        });
    }

    public getIntellecturealProperty(request: any): any {
        console.log(request);
        this.intellecturealPropertyService
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

                    this.intellecturealPropertys = result.data.items;
                    this.totalRecordsCount = result.data.totalRecords;
                    if (this.intellecturealPropertys.length === 0) {
                        this.paging.pageIndex = 1;
                    }

                    const { items, ...paging } = result.data;
                    this.paging = paging;

                    this.selectedclass = [];
                }
            });
    }

    public selectAllclasss(event: any): void {
        if (event.target.checked) {
            this.selectedclass = this.intellecturealPropertys.map(
                (teacher: any) => teacher.id
            );
        } else {
            this.selectedclass = [];
        }
    }

    public handleOnSortAndOrderChange(orderBy: string): void {
        if (this.paging.orderBy === orderBy) {
            this.paging.sortBy =
                this.paging.sortBy === this.constant.sort.asc
                    ? this.constant.sort.desc
                    : this.constant.sort.asc;
        } else {
            this.paging.sortBy = sortConstant.desc;
        }

        this.paging = {
            orderBy: orderBy,
            sortBy: this.paging.sortBy,
        };

        this.route.queryParams.subscribe((params) => {
            const request = {
                ...params,
                orderBy: this.paging.orderBy,
                sortBy: this.paging.sortBy,
            };

            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: request,
                queryParamsHandling: 'merge',
            });
        });
    }

    public handleSelectItem(id: number): void {
        if (this.isSelected(id)) {
            this.selectedclass = this.selectedclass.filter(
                (id: any) => id !== id
            );
        } else {
            this.selectedclass.push(id);
        }
    }

    public isSelected(id: number): boolean {
        return this.selectedclass.includes(id);
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

    public onLevelChange(event: any): void {
        console.log(event);
        const selectedId = event.value;
        const selectedLevel = this.intellectualPropertyLevels.find(
            (level) => level.id === selectedId
        );

        this.createIntellecturealForm.patchValue({
            workHoursPerProject: selectedLevel.value,
        });

        console.log('Bạn đã chọn:', selectedLevel);
    }

    public onEditLevelChange(event: any): void {
        console.log(event);
        const selectedId = event.value;
        const selectedLevel = this.intellectualPropertyLevels.find(
            (level) => level.id === selectedId
        );

        this.updateIntellecturealForm.patchValue({
            workHoursPerProject: selectedLevel.value,
        });

        console.log('Bạn đã chọn:', selectedLevel);
    }

    public handleCreateItem() {
        console.log(this.createIntellecturealForm.value);

        this.intellecturealPropertyService
            .create({
                ...this.createIntellecturealForm.value,
                intellecturalPropertyLevelId:
                    this.createIntellecturealForm.value
                        .intellecturalPropertyLevelId,

                hoursCalculated:
                    this.createIntellecturealForm.value.workHoursPerProject /
                    this.createIntellecturealForm.value.teamNumber,
                userId: this.createIntellecturealForm.value.userId?.id,
            })
            .subscribe((result: any) => {
                if (result.status) {
                    this.visibleIntellectureal = false;
                    this.createIntellecturealForm.reset();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Đã thêm sở hữu trí tuệ mới',
                    });
                    this.getIntellecturealProperty(this.queryParameters);
                }
            });
    }

    public handleOnDeleteMultiple() {
        // const swalWithBootstrapButtons = Swal.mixin({
        //     customClass: {
        //         cancelButton: 'btn btn-danger ml-2',
        //         confirmButton: 'btn btn-success',
        //     },
        //     buttonsStyling: false,
        // });
        // swalWithBootstrapButtons
        //     .fire({
        //         title: `Bạn có muốn xoá các bản ghi có Id: ${this.selectedBanners.join(
        //             ', '
        //         )} không?`,
        //         text: 'Sau khi xoá bản sẽ không thể khôi phục dữ liệu!',
        //         icon: 'warning',
        //         showCancelButton: true,
        //         confirmButtonText: 'Xác nhận',
        //         cancelButtonText: 'Bỏ qua',
        //         reverseButtons: false,
        //     })
        //     .then((result) => {
        //         if (result.isConfirmed) {
        //             const request = {
        //                 ids: this.selectedBanners,
        //             };
        //         }
        //     });
    }

    loadUser() {
        this.userService.getPaging({}).subscribe((result: any) => {
            if (result.status) {
                this.users = result.data.items;
            }
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

    handleDeleteItem(id: number) {
        this.confirmationService.confirm({
            message: 'Bạn có chắc chắn muốn xóa bản ghi này?',
            header: 'Xác nhận',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.intellecturealPropertyService
                    .delete(id)
                    .subscribe((result: any) => {
                        if (result.status) {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Thành công',
                                detail: 'Đã xóa hội thảo',
                            });
                            this.getIntellecturealProperty(
                                this.queryParameters
                            );
                        }
                    });
            },
        });
    }
    handleHideUpdateIntellectureal() {
        this.visibleUpdateIntellectureal = false;
    }

    handleUpdateItem() {
        this.intellecturealPropertyService
            .updateBodyAndQueryParamsStatus(
                { id: this.intellecturalPropertyId },
                {
                    ...this.updateIntellecturealForm.value,
                    intellecturalPropertyLevelId:
                        this.updateIntellecturealForm.value
                            .intellecturalPropertyLevelId,

                    userId: this.updateIntellecturealForm.value.userId,
                    hoursCalculated:
                        this.updateIntellecturealForm.value
                            .workHoursPerProject /
                        this.updateIntellecturealForm.value.teamNumber,
                }
            )
            .subscribe((result: any) => {
                if (result.status) {
                    this.visibleUpdateIntellectureal = false;
                    this.updateIntellecturealForm.reset();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Cập nhật thành công',
                    });
                    this.getIntellecturealProperty(this.queryParameters);
                }
            });
    }
    handleShowUpdateIntellectureal(item: any) {
        this.visibleUpdateIntellectureal = true;
        this.intellecturealPropertyService
            .getById({ id: item.id })
            .subscribe((result: any) => {
                if (result.status) {
                    this.intellecturalPropertyId = item.id;
                    this.updateIntellecturealForm = this.formBuilder.group({
                        userId: [result.data.user.id, [Validators.required]],
                        name: [result.data.name, Validators.required],
                        acceptanceDate: [new Date(result.data.acceptanceDate)],
                        membersName: [result.data.membersName], // Đã đúng rồi nè
                        teamNumber: [result.data.teamNumber],
                        intellecturalPropertyLevelId: [
                            result.data.intellecturalPropertyLevel.id,
                            Validators.required,
                        ],
                        workHoursPerProject: [result.data.workHoursPerProject],
                        hoursCalculated: [result.data.hoursCalculated],
                        note: [result.data.note],
                    });
                }
            });
    }
}
