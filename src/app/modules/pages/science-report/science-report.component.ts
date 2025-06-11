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
import { AuthService } from 'src/app/core/services/identity/auth.service';
import { ScienceReportLevelService } from 'src/app/core/services/science-report-level.service';
import { ScienceReportService } from 'src/app/core/services/science-report.service';
import { UserService } from 'src/app/core/services/user.service';

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
    users: any;
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
        volumeNo: 'string',
        terminalPage: 'string',
        projectManagerId: null,
        authorScienceReports: [],
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private scienceReportLevelService: ScienceReportLevelService,
        private scienceReportService: ScienceReportService,
        private userService: UserService,
        private authService: AuthService
    ) { }

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
    userCurrent: any;
    public selectedReports: any = [];

    public queryParameters: any = {
        ...this.config.paging,
        status: 0,
        keyWord: '',
    };
    scienceReportLevels: any;
    ngOnInit() {
        this.items = [{ label: 'Báo cáo khoa học' }];
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
            this.getReports(request);
        });
        this.loadScienceReportLevel();
        this.loadUser();
    }

    loadScienceReportLevel() {
        this.scienceReportLevelService.getPaging({}).subscribe((res) => {
            this.scienceReportLevels = res.data.items;
            console.log(this.scienceReportLevels);
        });
    }

    loadUser() {
        this.userService.getPaging({ pageSize: 100 }).subscribe((res) => {
            this.users = res.data.items;
        });
    }

    onScienceReportLevelChange(event: any) {
        // event.value là đối tượng được chọn
        console.log(event);
        if (event && event.value) {
            this.newReport.workHoursPerProject = event.value.value;
            this.calculateHours();
        }
    }
    saveNewReport() {
        console.log(this.newReport);
        if (
            this.newReport.authorScienceReports.some(
                (author) => author.userId === null
            )
        ) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Vui lòng chọn đầy đủ tác giả.',
            });
            return;
        }

        console.log(this.newReport.projectManagerId);
        if (this.newReport.projectManagerId == null) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Vui lòng chọn chủ nhiệm.',
            });
            return;
        }
        const formData = {
            ...this.newReport,
            scienceReportLevelId: this.newReport.scienceReportLevelId?.id,
            // memberCount: this.newReport.authorScienceReports.length,
        };
        this.scienceReportService.create(formData).subscribe({
            next: (response) => {
                this.addDialogVisible = false;
                this.getReports({});
            },
            error: (error) => {
                console.error('Lỗi khi tạo báo cáo:', error);
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Cảnh báo',
                    detail: 'Vui lòng nhập đầy đủ thông tin',
                });
                // hiển thị thông báo lỗi nếu cần
            },
        });
    }

    addNewAuthor() {
        this.newReport.authorScienceReports.push({ userId: null, hoursCalculated: 0 });
        this.calculateHours();

    }
    calculateHours() {
        const authors = this.newReport.authorScienceReports;
        const totalHours = this.newReport.workHoursPerProject || 0; // togGio
        const projectManagerId = this.newReport.projectManagerId;
        // const authorCount = authors.length || 1;

        const oneThird = totalHours / 3;
        const twoThirdShared = (2 * totalHours) / 3;

        authors.forEach(author => {
            if (author.userId === projectManagerId) {
                author.hoursCalculated = oneThird + twoThirdShared / this.newReport.memberCount;
            } else {
                author.hoursCalculated = twoThirdShared / this.newReport.memberCount;
            }
        });
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
            .getPaging({
                ...request,
                // userId: this.userCurrent.id != 1 ? this.userCurrent.id : null,
                authorIds: this.userCurrent.id == 1 ? null : [this.userCurrent.id]
            })
            .subscribe((result: any) => {
                if (result.status) {
                    this.reports = result.data.items;
                    this.reports = this.reports.map((item) => {
                        return {
                            ...item,
                            authorScienceReportHours:item.authorScienceReports,
                            authorScienceReports: item.authorScienceReports
                                .map((item) => item.user.name)
                                .join(', '),
                        };
                    });
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

    //validate

    saveReport() {
        if (!this.validateEditForm()) {
            return;
        }
        // HoursCalculated
        console.log(this.editingReport);

        this.scienceReportService
            .update({ id: this.editingReport.id }, this.editingReport)
            .subscribe((res) => {
                this.editDialogVisible = false;
                this.getReports({});
                this.messageService.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Cập nhật bài báo khoa học thành công',
                });
            });
    }

    updateStatus(id: any, status: any) {
        this.scienceReportService
            .updateStatus({ id: id }, { statusApprove: status })
            .subscribe((res) => {
                this.editDialogVisible = false;
                this.getReports({});
                this.messageService.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Cập nhật bài báo khoa học thành công',
                });
            });
    }
    confirmDelete(report: any) {
        this.confirmationService.confirm({
            message: `Bạn có chắc muốn xóa báo cáo "${report.reportName}" không?`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Có',
            rejectLabel: 'Không',
            acceptButtonStyleClass: 'p-button-danger', // Nút "Có" màu đỏ
            rejectButtonStyleClass: 'p-button-secondary', // Nút "Không" màu xám
            accept: () => {
                this.scienceReportService
                    .delete({ id: report.id }, {})
                    .subscribe(() => {
                        this.getReports({});
                    });
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
