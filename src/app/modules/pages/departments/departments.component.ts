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
import { DepartmentService } from 'src/app/core/services/deparments.service';

@Component({
    selector: 'app-department',
    templateUrl: './departments.component.html',
    styleUrls: ['./departments.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class DepartmentComponent implements OnInit {
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
        private departmentService: DepartmentService,
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

    public departments: any = [];
    public filteredDepartments: any = [];

    public paging: any = {
        pageIndex: DEFAULT_PAGE_INDEX,
        pageSize: DEFAULT_PAGE_SIZE,
        sortBy: '',
        orderBy: '',
        totalRecords: 0,
        totalPages: 0,
    };

    public selectedDepartments: any = [];

    public queryParameters: any = {
        ...this.config.paging,
        status: 0,
        keyWord: '',
    };

    ngOnInit() {
        this.items = [{ label: 'Phòng ban' }];
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
            this.getDepartments(request);
        });
    }

    openAddDialog() {
        this.submitted = false;
        this.newDepartment = {
            departmentName: '',
            order: 0,
            description: '',
        };
        this.addDialogVisible = true;
    }

    validateDepartmentForm(): boolean {
        let isValid = true;
        if (!this.newDepartment.name) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Vui lòng nhập tên phòng ban',
            });
            isValid = false;
        }
        return isValid;
    }

    saveNewDepartment() {
        this.submitted = true;
        if (!this.validateDepartmentForm()) {
            return;
        }
        const jsonRequest = {
            name: this.newDepartment.name,
            value: this.newDepartment.value || 0,
            description: this.newDepartment.description || null,
        };
        this.departmentService.create(jsonRequest).subscribe(
            (result: any) => {
                if (result.status) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Đã thêm phòng ban mới',
                    });
                    this.addDialogVisible = false;
                    this.submitted = false;
                    this.getDepartments(this.queryParameters);
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: result.message || 'Thêm phòng ban thất bại',
                    });
                }
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Có lỗi xảy ra khi thêm phòng ban',
                });
                console.error('Error creating department:', error);
            }
        );
    }

    public getDepartments(request: any): any {
        this.departmentService.getPaging(request).subscribe((result: any) => {
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
                this.departments = result.data.items;
                this.filteredDepartments = [...this.departments];
                console.log(this.departments);
                if (this.departments.length === 0) {
                    this.paging.pageIndex = 1;
                }
                const { items, ...paging } = result.data;
                this.paging = paging;
                this.paging.totalRecords = this.filteredDepartments.length;
                this.selectedDepartments = [];
            }
        });
    }

    openEditDialog(department: any) {
        // Sao chép dữ liệu department vào editingDepartment
        this.editingDepartment = { ...department };

        // Đảm bảo các trường được ánh xạ đúng
        this.editingDepartment.departmentName = department.name || '';
        this.editingDepartment.order = department.value || 0;
        this.editingDepartment.description = department.description || '';

        // Hiển thị dialog
        this.editDialogVisible = true;
    }

    hideEditDialog() {
        this.editDialogVisible = false;
    }

    saveDepartment() {
        if (this.editingDepartment.name) {
            const updateRequest = {
                id: this.editingDepartment.id,
                name: this.editingDepartment.name,
                value: this.editingDepartment.value || 0,
                description: this.editingDepartment.description || null,
            };
            this.departmentService.update(updateRequest).subscribe(
                (result: any) => {
                    if (result.status) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Thành công',
                            detail: 'Cập nhật thông tin phòng ban thành công',
                        });
                        this.hideEditDialog();
                        this.getDepartments(this.queryParameters);
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Lỗi',
                            detail: result.message || 'Cập nhật thất bại',
                        });
                    }
                },
                (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: 'Có lỗi xảy ra khi cập nhật',
                    });
                }
            );
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Vui lòng nhập tên phòng ban',
            });
        }
    }

    confirmDelete(department: any) {
        this.confirmationService.confirm({
            message: `Bạn có chắc muốn xóa phòng ban "${department.name}" không?`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Có',
            rejectLabel: 'Không',
            accept: () => {
                this.deleteDepartment(department.id);
            },
            reject: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Hủy bỏ',
                    detail: 'Đã hủy thao tác xóa',
                });
            },
        });
    }

    deleteDepartment(id: number) {
        this.departmentService.delete(id).subscribe(
            (result: any) => {
                if (result.status) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Đã xóa phòng ban thành công',
                    });
                    this.getDepartments(this.queryParameters);
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: result.message || 'Xóa phòng ban thất bại',
                    });
                }
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Có lỗi xảy ra khi xóa phòng ban',
                });
                console.error('Error deleting department:', error);
            }
        );
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
        this.paging = { orderBy: orderBy, sortBy: this.paging.sortBy };
        this.applySort();
    }

    private applySort() {
        this.filteredDepartments.sort((a: any, b: any) => {
            const valueA = a[this.paging.orderBy];
            const valueB = b[this.paging.orderBy];
            if (this.paging.sortBy === this.constant.sort.asc) {
                return valueA > valueB ? 1 : -1;
            } else {
                return valueA < valueB ? 1 : -1;
            }
        });
    }

    public handleSelectItem(id: number): void {
        if (this.isSelected(id)) {
            this.selectedDepartments = this.selectedDepartments.filter(
                (departmentId: any) => departmentId !== id
            );
        } else {
            this.selectedDepartments.push(id);
        }
    }

    public isSelected(id: number): boolean {
        return this.selectedDepartments.includes(id);
    }

    public handleSearchDepartment() {
        this.applyFilter();
    }

    onPageChange(event: any) {
        this.paging.pageIndex = event.page + 1;
        this.paging.pageSize = event.rows;
    }

    EvenFilter() {
        this.applyFilter();
    }

    private applyFilter() {
        this.filteredDepartments = [...this.departments];

        if (this.code) {
            this.filteredDepartments = this.filteredDepartments.filter(
                (department: any) =>
                    department.name
                        ?.toLowerCase()
                        .includes(this.code.toLowerCase())
            );
        }

        this.paging.totalRecords = this.filteredDepartments.length;
        this.paging.pageIndex = 1;
    }
}