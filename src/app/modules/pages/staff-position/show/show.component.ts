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
import { StaffPossitionService } from 'src/app/core/services/staffpossition.service';

@Component({
    selector: 'app-show',
    templateUrl: './show.component.html',
    styleUrls: ['./show.component.css'],
    providers: [MessageService, ConfirmationService],
})
export class ShowComponent implements OnInit {
    items: any;
    editDialogVisible: boolean = false;
    editingPosition: any = {};
    code: string = '';
    addDialogVisible: boolean = false;
    submitted: boolean = false;
    newPosition: any = {
        positionCode: '',
        positionName: '',
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private StafffPositionService: StaffPossitionService,
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

    public positions: any = [];
    public filteredPositions: any = [];

    public paging: any = {
        pageIndex: DEFAULT_PAGE_INDEX,
        pageSize: DEFAULT_PAGE_SIZE,
        sortBy: '',
        orderBy: '',
        totalRecords: 0,
        totalPages: 0,
    };

    public selectedPositions: any = [];

    public queryParameters: any = {
        ...this.config.paging,
        status: 0,
        keyWord: '',
        staffPositionName: '',
    };

    ngOnInit() {
        this.items = [{ label: 'Chức danh' }];
        this.route.queryParams.subscribe((params) => {
            const request = {
                ...params,
                pageIndex: params['pageIndex']
                    ? Number(params['pageIndex'])
                    : this.config.paging.pageIndex,
                pageSize: params['pageSize']
                    ? Number(params['pageSize'])
                    : this.config.paging.pageSize,
                keyWord: params['keyWord'] || null,
                staffPositionName: params['staffPositionName'] || null,
            };
            this.queryParameters = { ...request };
            this.getPositions(request);
        });
    }

    openAddDialog() {
        this.submitted = false;
        this.newPosition = {
            positionCode: '',
            positionName: '',
        };
        this.addDialogVisible = true;
    }

    validatePositionForm(): boolean {
        let isValid = true;
        if (!this.newPosition.positionName) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Vui lòng nhập tên chức danh',
            });
            isValid = false;
        }
        return isValid;
    }

    saveNewPosition() {
        this.submitted = true;
        if (!this.validatePositionForm()) {
            return;
        }

        const jsonRequest = {
            positionCode: this.newPosition.positionCode || null,
            positionName: this.newPosition.positionName,
        };

        this.StafffPositionService.create(jsonRequest).subscribe(
            (result: any) => {
                if (result.status) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Đã thêm chức danh mới',
                    });
                    this.addDialogVisible = false;
                    this.submitted = false;

                    if (result.data && result.data.id) {
                        const newItem = {
                            id: result.data.id,
                            positionCode: this.newPosition.positionCode || null,
                            positionName: this.newPosition.positionName,
                        };

                        if (this.paging.pageIndex === 1) {
                            this.positions.unshift(newItem);
                            if (this.positions.length > this.paging.pageSize) {
                                this.positions.pop();
                            }
                            this.filteredPositions = [...this.positions];
                        }

                        this.paging.totalRecords += 1;
                        this.paging.totalPages = Math.ceil(
                            this.paging.totalRecords / this.paging.pageSize
                        );
                    }

                    const request = {
                        pageIndex: 1,
                        pageSize: this.paging.pageSize,
                        status: 0,
                        keyWord: this.code || null,
                    };
                    this.router.navigate([], {
                        relativeTo: this.route,
                        queryParams: request,
                        queryParamsHandling: 'merge',
                    });

                    this.newPosition = {
                        positionCode: '',
                        positionName: '',
                    };
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: result.message || 'Thêm chức danh thất bại',
                    });
                }
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Có lỗi xảy ra khi thêm chức danh',
                });
                console.error('Error creating position:', error);
            }
        );
    }

    public getPositions(request: any): any {
        this.StafffPositionService.getPaging(request).subscribe(
            (result: any) => {
                if (result.status) {
                    if (
                        request.pageIndex !== 1 &&
                        result.data.items.length === 0
                    ) {
                        this.router.navigate([], {
                            relativeTo: this.route,
                            queryParams: { ...request, pageIndex: 1 },
                            queryParamsHandling: 'merge',
                        });
                    }

                    // Chỉ hiển thị các items được trả về từ API cho trang hiện tại
                    this.positions = result.data.items;
                    this.filteredPositions = [...this.positions];

                    const { items, ...paging } = result.data;
                    this.paging = {
                        ...this.paging,
                        ...paging,
                        pageIndex: request.pageIndex,
                        pageSize: request.pageSize,
                    };
                    this.selectedPositions = [];
                }
            },

            (error) => {
                console.error('Error fetching positions:', error);
            }
        );
    }

    openEditDialog(position: any) {
        this.editingPosition = { ...position };
        this.editDialogVisible = true;
    }

    hideEditDialog() {
        this.editDialogVisible = false;
    }

    savePosition() {
        if (this.editingPosition.positionName) {
            const updateRequest = {
                id: this.editingPosition.id,
                positionCode: this.editingPosition.positionCode || null,
                positionName: this.editingPosition.positionName,
            };
            this.StafffPositionService.update(updateRequest).subscribe(
                (result: any) => {
                    if (result.status) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Thành công',
                            detail: 'Cập nhật thông tin chức danh thành công',
                        });
                        this.hideEditDialog();
                        this.getPositions(this.queryParameters);
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
                detail: 'Vui lòng nhập tên chức danh',
            });
        }
    }

    confirmDelete(position: any) {
        this.confirmationService.confirm({
            message: `Bạn có chắc muốn xóa chức danh "${position.positionName}" không?`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Có',
            rejectLabel: 'Không',
            accept: () => {
                this.deletePosition(position.id);
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

    deletePosition(id: number) {
        this.StafffPositionService.delete(id).subscribe(
            (result: any) => {
                if (result.status) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Đã xóa chức danh thành công',
                    });
                    this.getPositions(this.queryParameters);
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: result.message || 'Xóa chức danh thất bại',
                    });
                }
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Có lỗi xảy ra khi xóa chức danh',
                });
                console.error('Error deleting position:', error);
            }
        );
    }

    onPageChange(event: any) {
        // Lưu lại các giá trị pageIndex và pageSize hiện tại để so sánh
        const currentPageIndex = this.paging.pageIndex;
        const currentPageSize = this.paging.pageSize;

        // Phần tử đầu tiên hiện đang hiển thị (1-based index)
        const currentFirstItem = (currentPageIndex - 1) * currentPageSize + 1;

        // Cập nhật giá trị mới từ sự kiện
        this.paging.pageSize = event.rows;

        // Tính toán trang mới dựa trên phần tử đầu tiên đang hiển thị
        if (event.rows === 25 && currentFirstItem <= 10) {
            // Nếu chọn pageSize là 25 và đang xem các phần tử từ 1-10
            // Chuyển đến trang 2 để hiển thị phần tử thứ 11 đầu tiên
            this.paging.pageIndex = 2;
        } else if (event.first !== undefined) {
            // Nếu sự kiện là chuyển trang (không phải thay đổi pageSize)
            this.paging.pageIndex = event.page + 1;
        } else {
            // Tính trang mới dựa trên phần tử đầu tiên đang hiển thị
            this.paging.pageIndex = Math.ceil(
                currentFirstItem / this.paging.pageSize
            );
        }

        const request = {
            ...this.queryParameters,
            pageIndex: this.paging.pageIndex,
            pageSize: this.paging.pageSize,
            keyWord: this.code || null,
        };

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: request,
            queryParamsHandling: 'merge',
        });
    }

    EvenFilter() {
        this.applyFilter();
    }

    private applyFilter() {
        const request = {
            ...this.queryParameters,
            pageIndex: 1,
            keyWord: this.code || null,
        };
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: request,
            queryParamsHandling: 'merge',
        });
    }

    // Các hàm khác không cần thay đổi
    public handleOnSortAndOrderChange(orderBy: string): void {
        if (this.paging.orderBy === orderBy) {
            this.paging.sortBy =
                this.paging.sortBy === this.constant.sort.asc
                    ? this.constant.sort.desc
                    : this.constant.sort.asc;
        } else {
            this.paging.sortBy = sortConstant.desc;
        }
        this.paging.orderBy = orderBy;
        const request = {
            ...this.queryParameters,
            sortBy: this.paging.sortBy,
            orderBy: this.paging.orderBy,
        };
        this.getPositions(request);
    }

    public handleSelectItem(id: number): void {
        if (this.isSelected(id)) {
            this.selectedPositions = this.selectedPositions.filter(
                (positionId: any) => positionId !== id
            );
        } else {
            this.selectedPositions.push(id);
        }
    }

    public isSelected(id: number): boolean {
        return this.selectedPositions.includes(id);
    }

    public handleSearchStaffPosition() {
        this.route.queryParams.subscribe((params) => {
            const request = {
                ...params,
                // status: this.queryParameters.status
                //     ? this.queryParameters.status
                //     : null,
                keyWord: this.queryParameters.keyWord
                    ? this.queryParameters.keyWord
                    : null,

                staffPositionName: this.queryParameters.staffPositionName
                    ? this.queryParameters.staffPositionName
                    : null,
            };

            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: request,
                queryParamsHandling: 'merge',
            });
        });
    }
}
