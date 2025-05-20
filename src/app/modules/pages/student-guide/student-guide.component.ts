import { PrizeService } from './../../../core/services/prize.service';
import { StudentGuideLevelService } from './../../../core/services/student-guide-level.service';
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
import { ClassService } from 'src/app/core/services/class.service';
import { UserService } from 'src/app/core/services/identity/user.service';
import { IntellecturalPropertyLevelService } from 'src/app/core/services/intellectural-property-level.service';
import { StudentGuideService } from 'src/app/core/services/student-guide.service';

@Component({
    selector: 'app-student-guide',
    templateUrl: './student-guide.component.html',
    styleUrls: ['./student-guide.component.css'],
    providers: [MessageService, ConfirmationService],
})
export class StudentGuideComponent implements OnInit {
    createStudentGuideForm: FormGroup;
    items: any;
    filteredItems: any;
    search: any;
    users: any;
    studentGuideLevels: any = [];
    updateStudentGuideForm: FormGroup;
    totalRecordsCount: any = 0;
    studentGuideId: any;
    prizes: any;
    visibleUpdateStudentGuide: boolean = false;
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
        private studentGuideService: StudentGuideService,
        private studentGuideLevelService: StudentGuideLevelService,
        private prizeService: PrizeService
    ) {
        this.createStudentGuideForm = this.formBuilder.group({
            userId: [null, [Validators.required]],
            name: [null, Validators.required],
            acceptanceDate: [null],
            membersName: [null], // Đã đúng rồi nè
            techerNumber: [null],
            teamCode: [null],
            studentGuideLevelId: [null, Validators.required],
            prizeId: [null, Validators.required],
            workHoursPerProject: [null],
            hoursCalculated: [null],
            note: [null],
        });

        this.updateStudentGuideForm = this.formBuilder.group({
            userId: [null, [Validators.required]],
            name: [null, Validators.required],
            acceptanceDate: [null],
            membersName: [null], // Đã đúng rồi nè
            techerNumber: [null],
            teamCode: [null],
            studentGuideLevelId: [null, Validators.required],
            prizeId: [null, Validators.required],
            workHoursPerProject: [null],
            hoursCalculated: [null],
            note: [null],
        });
    }

    public config: any = {
        paging: pagingConfig.default,
        baseUrl: systemConfig.baseFileSystemUrl,
        perPageOptions: DEFAULT_PER_PAGE_OPTIONS,
        pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
    };

    //Banners
    public studentGuides: any = [];

    public paging: any = {
        pageIndex: DEFAULT_PAGE_INDEX,
        pageSize: DEFAULT_PAGE_SIZE,
        sortBy: '',
        orderBy: '',
        totalRecords: 0,
        totalPages: 0,
    };

    StudentGuideProperty: any;
    public selectedclass: any = [];

    public queryParameters: any = {
        ...this.config.paging,
        status: 0,
        keyWord: '',
    };
    canbos: any;
    visibleStudentGuide: boolean = false;

    ngOnInit() {
        this.items = [{ label: 'Danh sách sở hữu trí tuệ' }];
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
            this.getStudentGuide(request);
        });

        // this.loadUser();
        this.loadCanbos();
        this.loadStudentGuideLevel();
        this.loadPrize();
    }

    onSelectCanBo(event: any) {
        this.createStudentGuideForm.get('userId')?.setValue(event.value);
    }

    loadStudentGuideLevel() {
        this.studentGuideLevelService
            .getPaging({ pageSize: 1000 })
            .subscribe((result: any) => {
                if (result.status) {
                    this.studentGuideLevels = result.data.items;
                }
            });
    }

    loadPrize() {
        this.prizeService
            .getPaging({ pageSize: 1000 })
            .subscribe((result: any) => {
                if (result.status) {
                    this.prizes = result.data.items;
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
            .getPaging({ name: this.search, pageSize: 100 })
            .subscribe((result: any) => {
                if (result.status) {
                    this.canbos = result.data.items;
                }
            });
    }

    showDialogStudentGuide() {
        this.visibleStudentGuide = true;
    }

    public handleSearchStudentGuideProperty() {
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

    public getStudentGuide(request: any): any {
        this.studentGuideService.getPaging(request).subscribe((result: any) => {
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

                this.studentGuides = result.data.items;
                this.totalRecordsCount = result.data.totalRecords;
                if (this.studentGuides.length === 0) {
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
            this.selectedclass = this.studentGuides.map(
                (teacher: any) => teacher.id
            );
        } else {
            this.selectedclass = [];
        }
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
        this.createStudentGuideForm.patchValue({
            workHoursPerProject: event.value.value,
        });
    }

    public onPrizeChange(event: any): void {
        console.log(event);
        const selectedId = event.value;
        const selectedPrize = this.prizes.find(
            (item) => item.id === selectedId
        );

        this.createStudentGuideForm.patchValue({
            prizeId: selectedPrize.value,
        });

        console.log('Bạn đã chọn:', selectedPrize);
    }

    public onEditLevelChange(event: any): void {
        // console.log(event);
        // const selectedId = event.value;
        // const selectedLevel = this.studentGuideLevels.find(
        //     (level) => level.id === selectedId
        // );
        // this.updateStudentGuideForm.patchValue({
        //     workHoursPerProject: selectedLevel.value,
        // });
        // console.log('Bạn đã chọn:', selectedLevel);
    }

    public handleCreateItem() {
        console.log(this.createStudentGuideForm.value);
        const formData = {
            ...this.createStudentGuideForm.value,
            userId: this.createStudentGuideForm.value.userId.id,
            prizeId: this.createStudentGuideForm.value.prizeId.id,
            studentGuideLevelId:
                this.createStudentGuideForm.value.studentGuideLevelId.id,

            hoursCalculated:
                this.createStudentGuideForm.value.prizeId.factor *
                this.createStudentGuideForm.value.studentGuideLevelId.value,
        };
        this.studentGuideService.create(formData).subscribe((result: any) => {
            if (result.status) {
                this.visibleStudentGuide = false;
                this.createStudentGuideForm.reset();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Đã thêm sở hữu trí tuệ mới',
                });
                this.getStudentGuide(this.queryParameters);
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
                this.studentGuideService.delete(id).subscribe((result: any) => {
                    if (result.status) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Thành công',
                            detail: 'Đã xóa hội thảo',
                        });
                        this.getStudentGuide(this.queryParameters);
                    }
                });
            },
        });
    }
    handleHideUpdateStudentGuide() {
        this.visibleUpdateStudentGuide = false;
    }

    handleUpdateItem() {
        this.studentGuideService
            .updateBodyAndQueryParamsStatus(
                { id: this.studentGuideId },
                {
                    ...this.updateStudentGuideForm.value,
                    studentGuideLevelId:
                        this.updateStudentGuideForm.value.studentGuideLevelId
                            .id,
                    userId: this.updateStudentGuideForm.value.userId.id,
                    prizeId: this.updateStudentGuideForm.value.prizeId.id,
                    hoursCalculated:
                        this.updateStudentGuideForm.value.workHoursPerProject /
                        this.updateStudentGuideForm.value.teamNumber,
                }
            )
            .subscribe((result: any) => {
                if (result.status) {
                    this.visibleUpdateStudentGuide = false;
                    this.updateStudentGuideForm.reset();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Cập nhật thành công',
                    });
                    this.getStudentGuide(this.queryParameters);
                }
            });
    }
    handleShowUpdateStudentGuide(item: any) {
        console.log(item);
        this.visibleUpdateStudentGuide = true;
        this.studentGuideService
            .getById({ id: item.id })
            .subscribe((result: any) => {
                if (result.status) {
                    this.studentGuideId = item.id;
                    this.updateStudentGuideForm = this.formBuilder.group({
                        userId: [result.data.user, [Validators.required]],
                        name: [result.data.name, Validators.required],
                        acceptanceDate: [new Date(result.data.acceptanceDate)],
                        membersName: [result.data.membersName], // Đã đúng rồi nè
                        teamNumber: [result.data.teamNumber],
                        studentGuideLevelId: [
                            result.data.studentGuideLevel,
                            Validators.required,
                        ],
                        workHoursPerProject: [result.data.workHoursPerProject],
                        hoursCalculated: [result.data.hoursCalculated],
                        note: [result.data.note],

                        techerNumber: [result.data.techerNumber],
                        teamCode: [result.data.teamCode],
                        prizeId: [result.data.prize],
                    });
                }
            });
    }
}
