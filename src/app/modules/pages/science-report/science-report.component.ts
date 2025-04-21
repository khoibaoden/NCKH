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
import { ScienceReportService } from 'src/app/core/services/science-report.service';

@Component({
    selector: 'app-science-reports',
    templateUrl: './science-report.component.html',
    styleUrls: ['./science-report.component.css'],
    providers: [MessageService, ConfirmationService],
})
export class ScienceReportsComponent implements OnInit {
    items: any;
    editDialogVisible: boolean = false;
    addDialogVisible: boolean = false;
    viewDialogVisible: boolean = false;
    submitted: boolean = false;
    searchText: string = '';

    // Mẫu data cho danh sách cấp độ báo cáo
    reportLevels: any[] = [
        {
            id: 1,
            key: 'HT1',
            value: 1200,
            description:
                'Đăng toàn văn trong tuyển tập công trình khoa học tại hội nghị hội thảo quốc tế thuộc hệ thống ISI/Scopus',
        },
        {
            id: 2,
            key: 'HT2',
            value: 800,
            description:
                'Đăng toàn văn trong tuyển tập công trình khoa học tại hội nghị hội thảo quốc tế có phản biện độc lập',
        },
        {
            id: 3,
            key: 'HT3',
            value: 400,
            description:
                'Đăng toàn văn trong tuyển tập công trình khoa học tại hội nghị hội thảo quốc gia',
        },
    ];

    // Mẫu data cho danh sách người dùng
    users: any[] = [
        { id: 1, name: 'Nguyễn Văn A' },
        { id: 2, name: 'Phạm Ngọc Hưng' },
        { id: 3, name: 'Nguyễn Văn Hậu' },
        { id: 4, name: 'Phạm Minh Chuẩn' },
        { id: 5, name: 'Trần Thị B' },
    ];

    editingReport: any = {};
    selectedReport: any = {};

    newReport: any = {
        reportName: '',
        conferenceName: '',
        publishYear: null,
        scienceReportLevelId: null,
        workHoursPerProject: 0,
        hoursCalculated: 0,
        address: '',
        isbn: '',
        notes: '',
        projectManagerId: null,
        authorScienceReports: [{ userId: null }],
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private scienceReportService: ScienceReportService
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

    public reports: any = [];
    public filteredReports: any = [];

    public paging: any = {
        pageIndex: DEFAULT_PAGE_INDEX,
        pageSize: DEFAULT_PAGE_SIZE,
        sortBy: '',
        orderBy: '',
        totalRecords: 0,
        totalPages: 0,
    };

    public selectedReports: any = [];

    public queryParameters: any = {
        ...this.config.paging,
        status: 0,
        keyWord: '',
    };

    ngOnInit() {
        this.items = [{ label: 'Báo cáo khoa học' }];
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
            this.getReports(request);
        });
    }

    saveNewReport() {
        this.scienceReportService.create(this.newReport).subscribe({
            next: (response) => {
                console.log('Tạo báo cáo thành công:', response);
                // có thể reset form hoặc điều hướng người dùng
            },
            error: (error) => {
                console.error('Lỗi khi tạo báo cáo:', error);
                // hiển thị thông báo lỗi nếu cần
            },
        });
    }

    addNewAuthor() {
        this.newReport.authorScienceReports.push({ userId: null });
    }

    openAddDialog() {
        this.submitted = false;
        this.newReport = {
            reportName: '',
            conferenceName: '',
            publishYear: null,
            scienceReportLevelId: null,
            workHoursPerProject: 0,
            hoursCalculated: 0,
            address: '',
            isbn: '',
            notes: '',
            projectManagerId: null,
            authorScienceReports: [{ userId: null }],
        };
        this.addDialogVisible = true;
    }

    validateReportForm(): boolean {
        let isValid = true;
        if (!this.newReport.reportName) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Vui lòng nhập tên báo cáo',
            });
            isValid = false;
        }
        if (!this.newReport.conferenceName) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Vui lòng nhập tên hội nghị',
            });
            isValid = false;
        }
        if (!this.newReport.publishYear) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Vui lòng chọn năm xuất bản',
            });
            isValid = false;
        }
        if (!this.newReport.scienceReportLevelId) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Vui lòng chọn cấp độ báo cáo',
            });
            isValid = false;
        }
        if (!this.newReport.projectManagerId) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Vui lòng chọn chủ nhiệm báo cáo',
            });
            isValid = false;
        }

        // Kiểm tra tác giả
        let hasEmptyAuthor = false;
        this.newReport.authorScienceReports.forEach((author: any) => {
            if (!author.userId) {
                hasEmptyAuthor = true;
            }
        });

        if (hasEmptyAuthor) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Vui lòng chọn tác giả cho tất cả các dòng',
            });
            isValid = false;
        }

        return isValid;
    }

    public getReports(request: any): any {
        this.scienceReportService
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
                    console.log(result.data.items);
                    this.reports = result.data.items;
                    this.filteredReports = [...this.reports];

                    if (this.reports.length === 0) {
                        this.paging.pageIndex = 1;
                    }

                    const { items, ...paging } = result.data;
                    this.paging = paging;
                    this.paging.totalRecords = this.filteredReports.length;
                    this.selectedReports = [];
                }
            });
    }

    viewReportDetails(report: any) {
        this.selectedReport = { ...report };
        this.viewDialogVisible = true;
    }

    openEditDialog(report: any) {
        // Sao chép dữ liệu report vào editingReport
        this.editingReport = { ...report };
        // Hiển thị dialog
        this.editDialogVisible = true;
    }

    hideEditDialog() {
        this.editDialogVisible = false;
    }

    addAuthor() {
        this.editingReport.authorScienceReports.push({ userId: null });
    }

    removeAuthor(index: number) {
        this.editingReport.authorScienceReports.splice(index, 1);
    }

    removeNewAuthor(index: number) {
        this.newReport.authorScienceReports.splice(index, 1);
    }

    validateEditForm(): boolean {
        let isValid = true;
        if (!this.editingReport.reportName) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Vui lòng nhập tên báo cáo',
            });
            isValid = false;
        }
        if (!this.editingReport.conferenceName) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Vui lòng nhập tên hội nghị',
            });
            isValid = false;
        }
        if (!this.editingReport.publishYear) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Vui lòng chọn năm xuất bản',
            });
            isValid = false;
        }

        // Kiểm tra tác giả
        let hasEmptyAuthor = false;
        this.editingReport.authorScienceReports.forEach((author: any) => {
            if (!author.userId) {
                hasEmptyAuthor = true;
            }
        });

        if (hasEmptyAuthor) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Vui lòng chọn tác giả cho tất cả các dòng',
            });
            isValid = false;
        }

        return isValid;
    }

    saveReport() {
        if (!this.validateEditForm()) {
            return;
        }

        // Trong thực tế, bạn sẽ gọi API để cập nhật báo cáo
        setTimeout(() => {
            // Mô phỏng response từ server
            const result = {
                status: true,
                message: 'Cập nhật báo cáo khoa học thành công',
            };

            if (result.status) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Cập nhật thông tin báo cáo khoa học thành công',
                });
                this.hideEditDialog();
                this.getReports(this.queryParameters);
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: result.message || 'Cập nhật thất bại',
                });
            }
        }, 500);
    }

    confirmDelete(report: any) {
        this.confirmationService.confirm({
            message: `Bạn có chắc muốn xóa báo cáo "${report.reportName}" không?`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Có',
            rejectLabel: 'Không',
            accept: () => {
                this.deleteReport(report.id);
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

    deleteReport(id: number) {
        // Trong thực tế, bạn sẽ gọi API để xóa báo cáo
        setTimeout(() => {
            // Mô phỏng xóa báo cáo thành công
            const result = {
                status: true,
                message: 'Xóa báo cáo khoa học thành công',
            };

            if (result.status) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Đã xóa báo cáo khoa học thành công',
                });
                this.getReports(this.queryParameters);
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: result.message || 'Xóa báo cáo thất bại',
                });
            }
        }, 500);
    }

    handleOnSortAndOrderChange(orderBy: string): void {
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
        this.filteredReports.sort((a: any, b: any) => {
            const valueA = a[this.paging.orderBy];
            const valueB = b[this.paging.orderBy];
            if (this.paging.sortBy === this.constant.sort.asc) {
                return valueA > valueB ? 1 : -1;
            } else {
                return valueA < valueB ? 1 : -1;
            }
        });
    }

    onPageChange(event: any) {
        this.paging.pageIndex = event.page + 1;
        this.paging.pageSize = event.rows;
    }

    applyFilter() {
        this.filteredReports = [...this.reports];

        if (this.searchText) {
            this.filteredReports = this.filteredReports.filter(
                (report: any) =>
                    report.reportName
                        ?.toLowerCase()
                        .includes(this.searchText.toLowerCase()) ||
                    report.conferenceName
                        ?.toLowerCase()
                        .includes(this.searchText.toLowerCase())
            );
        }

        this.paging.totalRecords = this.filteredReports.length;
        this.paging.pageIndex = 1;
    }
}
