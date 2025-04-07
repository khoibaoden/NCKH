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

    //Banners
    public seminars: any = [];

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
    }

    getUserInfor(){
        this.seminarService.getPaingProcess({}).subscribe((response: any)=> {
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
            user: '',
            eventDate: null,
            hourCalculated: null,
            note: '',
            seminarLevel: null
        };
        this.addDialogVisible = true;
    }

    saveNewSeminar() {
        this.submitted = true;

        if (!this.newSeminar.seminarName || !this.newSeminar.eventDate || 
            this.newSeminar.hourCalculated === null || !this.newSeminar.seminarLevel) {
            return;
        }
        // Kiểm tra dữ liệu
        if (!this.newSeminar.seminarName) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Vui lòng nhập tên hội thảo'
            });
            return;
        }
        
        // Tạo FormData để gửi đến API
        const formData = new FormData();
        
        // Thêm dữ liệu từ newSeminar vào FormData
        formData.append('seminarName', this.newSeminar.seminarName);
        
        // Xử lý ngày tổ chức
        if (this.newSeminar.eventDate) {
            formData.append('date', this.formatDateForApi(this.newSeminar.eventDate));
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Vui lòng chọn ngày tổ chức'
            });
            return;
        }
        
        // Thêm các thông tin khác
        if (this.newSeminar.hourCalculated !== null) {
            formData.append('hourCalculated', this.newSeminar.hourCalculated.toString());
        }
        
        if (this.newSeminar.note) {
            formData.append('note', this.newSeminar.note);
        }
        
        if (this.newSeminar.seminarLevel) {
            formData.append('seminarLevelId', this.newSeminar.seminarLevel.id.toString());
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Vui lòng chọn mức độ'
            });
            return;
        }
        
        // Gọi API thêm mới
        this.seminarService.create(formData).subscribe(
            (result: any) => {
                if (result.status) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Đã thêm hội thảo mới'
                    });
                    
                    // Đóng dialog thêm mới
                    this.addDialogVisible = false;
                    
                    // Làm mới danh sách seminar để hiển thị dữ liệu vừa thêm
                    this.getSeminar(this.queryParameters);
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: result.message || 'Thêm hội thảo thất bại'
                    });
                }
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Có lỗi xảy ra khi thêm hội thảo'
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

                this.seminars = result.data.items;
                console.log(this.seminars);
                if (this.seminars.length === 0) {
                    this.paging.pageIndex = 1;
                }

                const { items, ...paging } = result.data;
                this.paging = paging;

                this.selectedclass = [];
            }
        });
    }

    // Phương thức mở dialog chỉnh sửa
    openEditDialog(seminar: any) {
        this.editingSeminar = { ...seminar };
        // Nếu date là chuỗi, chuyển thành đối tượng Date
        if (typeof this.editingSeminar.date === 'string') {
            this.editingSeminar.date = new Date(this.editingSeminar.date);
        }
        this.editDialogVisible = true;
    }

    // Phương thức đóng dialog
    hideEditDialog() {
        this.editDialogVisible = false;
    }

    // Phương thức lưu thông tin đã chỉnh sửa
    saveSeminar() {
        if (this.editingSeminar.seminarName) {
            // Gọi service để cập nhật thông tin
            this.seminarService.update(this.editingSeminar).subscribe(
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

    // Phương thức xác nhận xóa
    confirmDelete(seminar: any) {
        this.confirmationService.confirm({
            message: `Bạn có chắc muốn xóa hội thảo "${seminar.seminarName}" không?`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteSeminar(seminar.id);
            },
        });
    }

    // Phương thức xóa seminar
    deleteSeminar(id: number) {
        this.seminarService.delete(id).subscribe(
            (result: any) => {
                if (result.status) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Đã xóa hội thảo',
                    });
                    this.getSeminar(this.queryParameters);
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: result.message || 'Xóa thất bại',
                    });
                }
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Có lỗi xảy ra khi xóa',
                });
            }
        );
    }

    public selectAllclasss(event: any): void {
        if (event.target.checked) {
            this.selectedclass = this.seminars.map(
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

    // Phương thức lọc theo ngày
    blurDateRange() {
        // Logic xử lý khi blur date range (có thể thêm nếu cần)
    }

    // Phương thức lọc
    EvenFilter() {
        // Logic xử lý khi nhấn nút lọc
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
                ...this.queryParameters,
                creator: this.code ? this.code : null,
                fromDate:
                    this.deadlineRange && this.deadlineRange[0]
                        ? this.formatDate(this.deadlineRange[0])
                        : null,
                toDate:
                    this.deadlineRange && this.deadlineRange[1]
                        ? this.formatDate(this.deadlineRange[1])
                        : null,
            },
            queryParamsHandling: 'merge',
        });
    }

    // Hàm hỗ trợ định dạng ngày
    formatDate(date: Date): string {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Hàm hỗ trợ định dạng ngày cho API
    formatDateForApi(date: Date): string {
        // Tùy thuộc vào định dạng mà API của bạn yêu cầu
        // Ví dụ: yyyy-MM-dd
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`; // Định dạng yyyy-MM-dd cho API
    }
}
