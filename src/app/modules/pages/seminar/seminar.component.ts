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
import classConstant from 'src/app/core/constants/staff-position.constant';
import { SeminarService } from 'src/app/core/services/seminar.service';

@Component({
    selector: 'app-seminar',
    templateUrl: './seminar.component.html',
    styleUrls: ['./seminar.component.css'],
    providers: [MessageService, ConfirmationService],
})
export class SeminarComponent implements OnInit {
    items: any;
    editDialogVisible: boolean = false;
    editingSeminar: any = {};
    seminarLevels: any[] = [];
    code: string = '';
    deadlineRange: any;
    addDialogVisible: boolean = false;
    formatdate: string = 'dd/mm/yy';
    submitted: boolean = false;
    bomon: any;

    newSeminar: any = {
        seminarName: '',
        user: { name: '' },
        eventDate: null,
        hourCalculated: null,
        note: '',
        seminarLevel: null,
    };

    Userinfo: any[] = [];
    selectedUser: any;
    Bomon: any[] = [];
    selectedBomon: any;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private seminarService: SeminarService,
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
        class: classConstant,
        sort: sortConstant,
    };

    public seminars: any = [];
    public filteredSeminars: any = [];

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
            this.getSeminar(request);
        });

        this.getUserInfor();
        this.getBomon();
    }

    getUserInfor() {
        this.seminarService.getPaingProcess({}).subscribe((response: any) => {
            if (response.status && response.data) {
                this.Userinfo = response.data.items.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                }));
            }
        });
    }

    getBomon() {
        this.seminarService.getPaingBM({}).subscribe((response: any) => {
            if (response.status && response.data) {
                this.Bomon = response.data.items.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                }));
                this.bomon = this.Bomon;
            }
        });
    }

    openAddDialog() {
        this.submitted = false;
        this.newSeminar = {
            seminarName: '',
            eventDate: null,
            hourCalculated: null,
            note: '',
        };
        this.selectedUser = null;
        this.selectedBomon = null;
        this.addDialogVisible = true;
    }

    validateSeminarForm(): boolean {
        let isValid = true;
        if (!this.newSeminar.seminarName) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Vui lòng nhập tên hội thảo',
            });
            isValid = false;
        }
        if (!this.newSeminar.eventDate) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Vui lòng chọn ngày tổ chức',
            });
            isValid = false;
        }
        if (this.newSeminar.hourCalculated === null) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Vui lòng nhập số giờ',
            });
            isValid = false;
        }
        if (!this.selectedBomon) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Vui lòng chọn mức độ',
            });
            isValid = false;
        }
        return isValid;
    }

    saveNewSeminar() {
        this.submitted = true;
        if (!this.validateSeminarForm()) {
            return;
        }
        const jsonRequest = {
            seminarName: this.newSeminar.seminarName,
            date: this.formatDateForApi(this.newSeminar.eventDate),
            hourCalculated: this.newSeminar.hourCalculated,
            note: this.newSeminar.note || null,
            userId: this.selectedUser || null,
            seminarLevelId: this.selectedBomon,
        };
        this.seminarService.create(jsonRequest).subscribe(
            (result: any) => {
                if (result.status) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Đã thêm hội thảo mới',
                    });
                    this.addDialogVisible = false;
                    this.submitted = false;
                    this.getSeminar(this.queryParameters);
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: result.message || 'Thêm hội thảo thất bại',
                    });
                }
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Có lỗi xảy ra khi thêm hội thảo',
                });
                console.error('Error creating seminar:', error);
            }
        );
    }

    public getSeminar(request: any): any {
        this.seminarService.getPaging(request).subscribe((result: any) => {
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
                this.seminars = result.data.items;
                this.filteredSeminars = [...this.seminars];
                console.log(this.seminars);
                if (this.seminars.length === 0) {
                    this.paging.pageIndex = 1;
                }
                const { items, ...paging } = result.data;
                this.paging = paging;
                this.paging.totalRecords = this.filteredSeminars.length;
                this.selectedclass = [];
            }
        });
    }

    openEditDialog(seminar: any) {
        this.editingSeminar = { ...seminar };

        if (
            this.editingSeminar.date &&
            typeof this.editingSeminar.date === 'string'
        ) {
            this.editingSeminar.date = new Date(this.editingSeminar.date);
        }

        // Đảm bảo các trường khác được ánh xạ đúng
        this.editingSeminar.seminarName = seminar.seminarName || '';
        this.editingSeminar.hourCalculated = seminar.hourCalculated || 0;
        this.editingSeminar.note = seminar.note || '';
        this.selectedUser = seminar.user?.id || null; // Dùng cho dropdown người tạo
        this.selectedBomon = seminar.seminarLevel?.id || null; // Dùng cho dropdown mức độ

        // Hiển thị dialog
        this.editDialogVisible = true;
    }

    hideEditDialog() {
        this.editDialogVisible = false;
    }

    saveSeminar() {
        if (this.editingSeminar.seminarName) {
            const updateRequest = {
                id: this.editingSeminar.id,
                seminarName: this.editingSeminar.seminarName,
                date: this.formatDateForApi(this.editingSeminar.date),
                hourCalculated: this.editingSeminar.hourCalculated,
                note: this.editingSeminar.note || null,
                userId: this.selectedUser || null,
                seminarLevelId: this.selectedBomon || null,
            };
            this.seminarService.update(updateRequest).subscribe(
                (result: any) => {
                    if (result.status) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Thành công',
                            detail: 'Cập nhật thông tin hội thảo thành công',
                        });
                        this.hideEditDialog();
                        this.getSeminar(this.queryParameters);
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
                detail: 'Vui lòng nhập tên hội thảo',
            });
        }
    }

    confirmDelete(seminar: any) {
        this.confirmationService.confirm({
            message: `Bạn có chắc muốn xóa hội thảo "${seminar.seminarName}" không?`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Có',
            rejectLabel: 'Không',
            accept: () => {
                this.deleteSeminar(seminar.id);
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

    deleteSeminar(id: number) {
        this.seminarService.delete(id).subscribe(
            (result: any) => {
                if (result.status) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Đã xóa hội thảo thành công',
                    });
                    this.getSeminar(this.queryParameters);
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: result.message || 'Xóa hội thảo thất bại',
                    });
                }
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Có lỗi xảy ra khi xóa hội thảo',
                });
                console.error('Error deleting seminar:', error);
            }
        );
    }

    public selectAllclasss(event: any): void {
        if (event.target.checked) {
            this.selectedclass = this.filteredSeminars.map(
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
        this.paging = { orderBy: orderBy, sortBy: this.paging.sortBy };
        this.applySort();
    }

    private applySort() {
        this.filteredSeminars.sort((a: any, b: any) => {
            const valueafsir = a[this.paging.orderBy];
            const valueB = b[this.paging.orderBy];
            if (this.paging.sortBy === this.constant.sort.asc) {
                return valueB > valueB ? 1 : -1;
            } else {
                return valueB < valueB ? 1 : -1;
            }
        });
    }

    public handleSelectItem(id: number): void {
        if (this.isSelected(id)) {
            this.selectedclass = this.selectedclass.filter(
                (classId: any) => classId !== id
            );
        } else {
            this.selectedclass.push(id);
        }
    }

    public isSelected(id: number): boolean {
        return this.selectedclass.includes(id);
    }

    public handleSearchclass() {
        this.applyFilter();
    }

    onPageChange(event: any) {
        this.paging.pageIndex = event.page + 1;
        this.paging.pageSize = event.rows;
    }

    blurDateRange() {}

    EvenFilter() {
        this.applyFilter();
    }

    private applyFilter() {
        this.filteredSeminars = [...this.seminars];

        if (this.code) {
            this.filteredSeminars = this.filteredSeminars.filter(
                (seminar: any) =>
                    seminar.user?.name
                        ?.toLowerCase()
                        .includes(this.code.toLowerCase())
            );
        }

        if (
            this.deadlineRange &&
            (this.deadlineRange[0] || this.deadlineRange[1])
        ) {
            const fromDate = this.deadlineRange[0]
                ? new Date(this.deadlineRange[0])
                : null;
            const toDate = this.deadlineRange[1]
                ? new Date(this.deadlineRange[1])
                : null;

            this.filteredSeminars = this.filteredSeminars.filter(
                (seminar: any) => {
                    const seminarDate = new Date(seminar.date);
                    if (fromDate && toDate) {
                        return seminarDate >= fromDate && seminarDate <= toDate;
                    } else if (fromDate) {
                        return seminarDate >= fromDate;
                    } else if (toDate) {
                        return seminarDate <= toDate;
                    }
                    return true;
                }
            );
        }

        this.paging.totalRecords = this.filteredSeminars.length;
        this.paging.pageIndex = 1;
    }

    formatDate(date: Date): string {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    formatDateForApi(date: Date): string {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }
}
