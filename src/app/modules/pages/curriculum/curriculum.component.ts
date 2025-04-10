import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { CurriculumService } from 'src/app/core/services/curriculum.service';

@Component({
    selector: 'app-curriculum',
    templateUrl: './curriculum.component.html',
    styleUrls: ['./curriculum.component.css'],
    providers: [MessageService, ConfirmationService],
})
export class CurriculumComponent implements OnInit {
    items: any;
    curriculums: any[] = [];
    filteredCurriculums: any[] = [];
    addDialogVisible: boolean = false;
    editDialogVisible: boolean = false;
    submitted: boolean = false;
    code: string = '';
    publishYearRange: Date[] | null = null;

    createCurriculumForm: FormGroup;
    editCurriculumForm: FormGroup;
    editingCurriculum: any = {};

    public config: any = {
        paging: pagingConfig.default,
        baseUrl: systemConfig.baseFileSystemUrl,
        perPageOptions: DEFAULT_PER_PAGE_OPTIONS,
        pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
    };

    public constant: any = {
        sort: sortConstant,
    };

    public paging: any = {
        pageIndex: DEFAULT_PAGE_INDEX,
        pageSize: DEFAULT_PAGE_SIZE,
        sortBy: '',
        orderBy: '',
        totalRecords: 0,
        totalPages: 0,
    };

    public queryParameters: any = {
        ...this.config.paging,
        status: 0,
        keyWord: '',
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private curriculumService: CurriculumService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {
        this.createCurriculumForm = this.fb.group({
            name: ['', Validators.required],
            publishYear: [null],
            isAuthor: [false],
            memberNumber: [null],
            publishingHouse: [''],
            isbn: [''],
            note: [''],
        });

        this.editCurriculumForm = this.fb.group({
            name: ['', Validators.required],
            publishYear: [null],
            isAuthor: [false],
            memberNumber: [null],
            publishingHouse: [''],
            isbn: [''],
            note: [''],
        });
    }

    ngOnInit() {
        this.items = [{ label: 'Danh sách sách' }];
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
            this.getCurriculums(request);
        });
    }

    getCurriculums(request: any) {
        this.curriculumService.getPaging(request).subscribe(
            (result: any) => {
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
                    this.curriculums = result.data.items;
                    this.filteredCurriculums = [...this.curriculums];
                    if (this.curriculums.length === 0) {
                        this.paging.pageIndex = 1;
                    }
                    const { items, ...paging } = result.data;
                    this.paging = paging;
                    this.paging.totalRecords = this.filteredCurriculums.length;
                }
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Không thể tải danh sách sách',
                });
            }
        );
    }

    openAddDialog() {
        this.submitted = false;
        this.createCurriculumForm.reset();
        this.addDialogVisible = true;
    }

    formatDateForApi(date: any): string | null {
        return date ? new Date(date).toISOString() : null; 
    }

    saveNewCurriculum() {
        this.submitted = true;
    
        // Kiểm tra form hợp lệ
        if (this.createCurriculumForm.invalid) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Vui lòng nhập đầy đủ thông tin bắt buộc',
            });
            return;
        }
    
        // Lấy giá trị từ form
        const formValue = this.createCurriculumForm.value;
    
        const jsonRequest = {
            name: formValue.name || '',
            publishYear: this.formatDateForApi(formValue.publishYear), 
            isAuthor: formValue.isAuthor || false, 
            memberNumber: formValue.memberNumber || null, 
            publishingHouse: formValue.publishingHouse || '', 
            note: formValue.note || null, 
        };
    
        // Gọi API
        this.curriculumService.create(jsonRequest).subscribe(
            (result: any) => {
                if (result.status) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Đã thêm sách mới',
                    });
                    this.addDialogVisible = false;
                    this.submitted = false;
                    this.getCurriculums(this.queryParameters);
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: result.message || 'Thêm sách thất bại',
                    });
                }
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Có lỗi xảy ra khi thêm sách',
                });
                console.error('Error creating curriculum:', error);
            }
        );
    }

    openEditDialog(book: any) {
        this.editingCurriculum = { ...book };
        this.editCurriculumForm.patchValue({
            name: book.name,
            publishYear: book.publishYear ? new Date(book.publishYear) : null,
            isAuthor: book.isAuthor,
            memberNumber: book.memberNumber,
            publishingHouse: book.publishingHouse,
            isbn: book.isbn,
            note: book.note,
        });
        this.editDialogVisible = true;
    }

    hideEditDialog() {
        this.editDialogVisible = false;
        this.submitted = false;
    }

    saveCurriculum() {
        this.submitted = true;
        if (this.editCurriculumForm.invalid) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Vui lòng nhập đầy đủ thông tin bắt buộc',
            });
            return;
        }

        // Chuyển đổi publishYear thành định dạng DateTime (ISO 8601) nếu có giá trị
        const publishYearValue = this.editCurriculumForm.value.publishYear;
        const publishYearFormatted = publishYearValue
            ? new Date(publishYearValue).toISOString() // Chuyển thành định dạng ISO 8601
            : null;

        const updateRequest = {
            request: {
                id: this.editingCurriculum.id,
                ...this.editCurriculumForm.value,
                publishYear: publishYearFormatted, // Gửi dưới dạng chuỗi ISO 8601
            },
        };

        this.curriculumService.update(updateRequest).subscribe(
            (result: any) => {
                if (result.status) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Cập nhật thông tin sách thành công',
                    });
                    this.hideEditDialog();
                    this.getCurriculums(this.queryParameters);
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
                    detail: 'Có lỗi xảy ra khi cập nhật: ' + (error.message || 'Không xác định'),
                });
            }
        );
    }

    confirmDelete(book: any) {
        this.confirmationService.confirm({
            message: `Bạn có chắc muốn xóa sách "${book.name}" không?`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Có',
            rejectLabel: 'Không',
            accept: () => {
                this.deleteCurriculum(book.id);
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

    deleteCurriculum(id: number) {
        this.curriculumService.delete(id).subscribe(
            (result: any) => {
                if (result.status) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Đã xóa sách thành công',
                    });
                    this.getCurriculums(this.queryParameters);
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: result.message || 'Xóa sách thất bại',
                    });
                }
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Có lỗi xảy ra khi xóa sách',
                });
            }
        );
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

    applyFilter() {
        this.filteredCurriculums = [...this.curriculums];

        if (this.code) {
            this.filteredCurriculums = this.filteredCurriculums.filter((book) =>
                book.name?.toLowerCase().includes(this.code.toLowerCase())
            );
        }

        if (this.publishYearRange && this.publishYearRange[0] && this.publishYearRange[1]) {
            const startYear = this.publishYearRange[0].getFullYear();
            const endYear = this.publishYearRange[1].getFullYear();
            this.filteredCurriculums = this.filteredCurriculums.filter(
                (book) =>
                    book.publishYear &&
                    book.publishYear >= startYear &&
                    book.publishYear <= endYear
            );
        }

        this.paging.totalRecords = this.filteredCurriculums.length;
        this.paging.pageIndex = 1;
    }
}