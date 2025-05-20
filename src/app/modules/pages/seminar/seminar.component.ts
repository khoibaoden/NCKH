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
    objects: any;
    seminarLevels: any[] = [];
    code: string = '';
    addDialogVisible: boolean = false;
    formatdate: string = 'dd/mm/yy';
    submitted: boolean = false;

    subjects: any[] = [];

    newSeminar: any = {
        seminarName: '',
        user: { name: '' },
        eventDate: new Date(),
        hourCalculated: null,
        note: '',
        seminarLevel: null,
    };

    Userinfo: any[] = [];
    selectedUser: any;
    Bomon: any[] = [];
    selectedBomon: any;

    //Loc
    keyWord: any;
    deadlineRange: any;

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

    public math = Math;

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

    ngOnInit() {
        this.items = [{ label: 'Danh sách hội thảo' }];
        this.getSeminar();
        this.getUserInfor();
        this.loadBomon();
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

    onPageChange(event: any) {
        console.log(event);
        this.paging.pageIndex = event.page + 1;
        this.paging.pageSize = event.rows;
        this.getSeminar();
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
        if (!this.newSeminar.seminarLevel) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Vui lòng chọn mức độ',
            });
            isValid = false;
        }
        return isValid;
    }

    onSubjectChange(event: any) {
        console.log(event);
        this.newSeminar.hourCalculated = this.newSeminar.seminarLevel.value;
    }

    onEditSubjectChange(event: any) {
        console.log(event);

        console.log(this.editingSeminar.seminarLevel);
        this.editingSeminar.hourCalculated =
            this.editingSeminar.seminarLevel.value;
    }

    loadBomon() {
        this.seminarService.getPaingBM().subscribe((res: any) => {
            this.objects = res.data.items;
            console.log(this.objects);
        });
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
            seminarLevelId: this.newSeminar.seminarLevel.id,
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
                    this.getSeminar();
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

    public getSeminar(): any {
        this.seminarService
            .getPaging({
                keyWord: this.keyWord || null,
                date: this.deadlineRange
                    ? new Date(
                          this.deadlineRange.getTime() + 7 * 60 * 60 * 1000
                      ).toISOString()
                    : null,
                pageIndex: this.paging.pageIndex,
                pageSize: this.paging.pageSize,
            })
            .subscribe((result: any) => {
                if (result.status) {
                    this.seminars = result.data.items;
                    // this.filteredSeminars = [...this.seminars];
                    if (this.seminars.length === 0) {
                        this.paging.pageIndex = 1;
                    }
                    const { items, ...paging } = result.data;
                    this.paging = paging;
                    // this.paging.totalRecords = this.filteredSeminars.length;
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
        this.editingSeminar.note = seminar.note || '';
        this.selectedUser = seminar.user?.id || null; // Dùng cho dropdown người tạo
        this.editingSeminar.seminarLevel = {
            id: seminar.seminarLevel.id,
            name: seminar.seminarLevel.name,
            value: seminar.seminarLevel.value,
            description: seminar.seminarLevel.description,
        };
        // seminar.seminarLevel || null; // Dùng cho dropdown mức độ

        console.log(this.objects);
        console.log(seminar.seminarLevel);
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
                seminarLevelId: this.editingSeminar.seminarLevel.id || null,
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
                        this.getSeminar();
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
                    this.getSeminar();
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

    blurDateRange() {}

    // EvenFilter() {
    //     this.applyFilter();
    // }

    public applyFilter() {
        this.paging.totalRecords = this.filteredSeminars.length;
        this.paging.pageIndex = 1;
        this.getSeminar();
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
