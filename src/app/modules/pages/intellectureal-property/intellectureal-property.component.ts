import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, Form } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { UserService } from 'src/app/core/services/identity/user.service';
import { IntellecturalPropertyLevelService } from 'src/app/core/services/intellectural-property-level.service';
import { IntellecturealPropertyService } from 'src/app/core/services/intellectureal-property.service';

@Component({
    selector: 'app-intellectureal-property',
    templateUrl: './intellectureal-property.component.html',
    styleUrls: ['./intellectureal-property.component.css'],
})
export class IntellecturealPropertyComponent implements OnInit {
    createIntellecturealForm: FormGroup;
    items: any;
    filteredItems: any;
    search: any;
    users: any;
    intellectualPropertyLevels: any = [];
    updateIntellecturealForm: FormGroup;
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
        private intellecturealPropertyService: IntellecturealPropertyService,
        private intellecturalPropertyLevelService: IntellecturalPropertyLevelService
    ) {
        this.createIntellecturealForm = this.formBuilder.group({
            code: ['', [Validators.required]],
            name: ['', Validators.required],
            acceptanceDate: [null],
            membersName: [''], // Đã đúng rồi nè
            teamNumber: [null],
            intellecturalPropertyLevelId: [null, Validators.required],
            workHoursPerProject: [null],
            hoursCalculated: [null],
            note: [''],
        });

        this.updateIntellecturealForm = this.formBuilder.group({
            code: ['', [Validators.required]],
            name: ['', Validators.required],
            acceptanceDate: [null],
            membersName: [''], // Đã đúng rồi nè
            teamNumber: [null],
            intellecturalPropertyLevelId: [null, Validators.required],
            workHoursPerProject: [null],
            hoursCalculated: [null],
            note: [''],
        });
        this.loadUser();
        this.loadIntellecturealPropertyLevel();
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
            this.getIntellecturealProperty(request);
        });

        this.loadIntellecturealPropertyLevel();
    }

    loadIntellecturealPropertyLevel() {
        this.intellecturalPropertyLevelService
            .getPaging()
            .subscribe((result: any) => {
                if (result.status) {
                    this.intellectualPropertyLevels = result.data.items;
                    const { items, ...paging } = result.data;
                    this.paging = paging;
                }
            });
    }

    public handleOnSearch(event: any = null): void {
        // this.search = event.target.value;
        // this.filteredItems = this.items.filter((item: any) =>
        //     item.name.toLowerCase().includes(this.search.toLowerCase())
        // );

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

    showDialogIntellectureal() {
        this.visibleIntellectureal = true;
    }

    public getIntellecturealProperty(request: any): any {
        this.intellecturealPropertyService
            .getPaging(request)
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

                    this.IntellecturealProperty = result.data.items;
                    console.log(this.intellecturealPropertys);
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

    public handleDeleteItem(id: number) {}

    public handleCreateItem() {
        console.log(this.createIntellecturealForm.value);
        this.intellecturealPropertyService
            .create(this.createIntellecturealForm.value)
            .subscribe((result: any) => {
                if (result.status) {
                    this.visibleIntellectureal = false;
                    this.createIntellecturealForm.reset();
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
            console.log(result);
            if (result.status) {
                this.users = result.data.items;
                const { items, ...paging } = result.data;
                this.paging = paging;
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

    handleShowUpdateIntellectureal(id: any) {
        this.intellecturealPropertyService
            .getById({ id: id })
            .subscribe((result: any) => {
                if (result.status) {
                    this.updateIntellecturealForm.patchValue(result.data);
                    this.visibleIntellectureal = true;
                }
            });
    }
}
