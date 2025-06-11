import { UserService } from 'src/app/core/services/identity/user.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
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
import { NewsService } from 'src/app/core/services/news.service';
import { ArticleProjectLevelService } from 'src/app/core/services/article-project-level.service';
import { AuthService } from 'src/app/core/services/identity/auth.service';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.css'],
    providers: [MessageService, ConfirmationService],
})
export class NewsComponent implements OnInit {
    items: any;

    //create
    visibleNews: boolean = false;
    search: any;
    //update
    updateNewsForm: FormGroup;
    users: any;
    createNewsForm: FormGroup;
    articleLevels: any;
    members: any;
    selectedMembers: any[] = [];
    newsId: any;
    selectedMembersUpdate: any[] = [];
    visibleUpdateNews: boolean = false;
    userCurrent: any;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private newsService: NewsService,
        private articleProjectLevelService: ArticleProjectLevelService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private userService: UserService,
        private confirmationService: ConfirmationService,
        private authService: AuthService
    ) {
        this.createNewsForm = this.fb.group({
            userId: [''],
            projectName: [''],
            memberCount: [0],
            articleProjectLevelId: [0],
            workHoursPerProject: [0],
            hoursCalculated: [0],
            projectManagerId: [0],
            magazineName: [''],
            issn: [''],
            volumeNo: [''],
            terminalPage: [''],
            publishYear: [new Date()],
            notes: [''],
            // authorArticleProjects: this.fb.array([
            //     this.fb.group({
            //         userId: [0],
            //     }),
            // ]),
        });

        this.updateNewsForm = this.fb.group({
            userId: [''],
            projectName: [''],
            memberCount: [0],
            articleProjectLevelId: [0],
            workHoursPerProject: [0],
            hoursCalculated: [0],
            projectManagerId: [0],
            magazineName: [''],
            issn: [''],
            volumeNo: [''],
            terminalPage: [''],
            publishYear: [new Date()],
            notes: [''],
        });
    }

    public config: any = {
        paging: pagingConfig.default,
        baseUrl: systemConfig.baseFileSystemUrl,
        perPageOptions: DEFAULT_PER_PAGE_OPTIONS,
        pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
    };

    public constant: any = {
        news: classConstant,
        sort: sortConstant,
    };

    //Banners
    public News: any = [];

    public paging: any = {
        pageIndex: DEFAULT_PAGE_INDEX,
        pageSize: DEFAULT_PAGE_SIZE,
        sortBy: '',
        orderBy: '',
        totalRecords: 0,
        totalPages: 0,
    };
    news: any;
    public selectedclass: any = [];

    public queryParameters: any = {
        ...this.config.paging,
        status: 0,
        keyWord: '',
    };

    ngOnInit() {
        this.items = [{ label: 'Danh sách bài báo' }];
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
            this.getNews(request);
        });

        this.loadArticleLevels();
        this.loadMembers();
    }
    public handleSearchNews() {
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
    loadMembers() {
        this.userService
            .getPaging({ pageSize: 1000 })
            .subscribe((result: any) => {
                if (result.status) {
                    this.members = this.formatUsers(result.data.items);
                }
            });
    }

    formatUsers(data: any): [] {
        return data.map((item) => ({
            id: item.id,
            userId: item.id,
            name: item.name,
        }));
    }

    public loadUser(event: any = null): void {
        this.userService
            .getPaging({ name: this.search, pageSize: 100 })
            .subscribe((result: any) => {
                if (result.status) {
                    this.users = result.data.items;
                }
            });
    }

    loadArticleLevels() {
        this.articleProjectLevelService
            .getPaging({ pageSize: 1000 })
            .subscribe((res) => {
                this.articleLevels = res.data.items;
            });
    }

    public onLevelChange(event: any): void {
        this.createNewsForm.patchValue({
            workHoursPerProject: event.value.value,
        });
    }

    public handleOnSearch(event: any = null): void {
        this.userService
            .getPaging({ name: event.query })
            .subscribe((result: any) => {
                if (result.status) {
                    this.users = result.data.items;
                }
            });
    }

    public getNews(request: any): any {
        this.newsService
            .getPaging({
                ...request,
                // userId: this.userCurrent.id != 1 ? this.userCurrent.id : null,
                // authorIds:[this.userCurrent.id]
                authorIds: this.userCurrent.id != 1 ? [this.userCurrent.id] : null
            })
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

                    this.news = result.data.items.map((item) => {
                        return {
                            ...item,
                            authorNames: item.authorArticleProjects.map(
                                (a) => a.user.name
                            ),
                        };
                    });
                    console.log(this.news);
                    if (this.news.length === 0) {
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
            this.selectedclass = this.news.map((teacher: any) => teacher.id);
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

    public handleCreateItem() {
        const formValue = this.createNewsForm.value;

        const projectManagerId = formValue.projectManagerId.id;
        // const memberCount = this.selectedMembers.length;
        const memberCount = formValue.memberCount;

        const workHours = formValue.articleProjectLevelId.value;

        // Tìm xem người đang tạo bài báo có phải là project manager không
        const isMainAuthor = formValue.userId.id === projectManagerId;

        // Tính số giờ quy đổi theo công thức Excel
        let hoursCalculated = 0;
        if (memberCount > 0) {
            if (isMainAuthor) {
                hoursCalculated =
                    workHours / 3 + (2 * (workHours / 3)) / memberCount;
            } else {
                hoursCalculated = ((2 * (workHours / 3)) / memberCount);
            }
        }

        const formData = {
            ...formValue,
            articleProjectLevelId: formValue.articleProjectLevelId.id,
            projectManagerId: projectManagerId,
            userId: formValue.userId.id,
            authorArticleProjects: this.selectedMembers,
            // memberCount: memberCount,
            hoursCalculated: Math.round(hoursCalculated), // làm tròn nếu cần
        };

        this.newsService.create(formData).subscribe((result: any) => {
            if (result.status) {
                this.visibleNews = false;
                this.createNewsForm.reset();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Đã thêm bài báo mới',
                });
                this.getNews(this.queryParameters);
            }
        });
    }
    handleShowUpdateNews(item: any) {
        this.visibleUpdateNews = true;
        this.newsService.getById({ id: item.id }).subscribe((result: any) => {
            if (result.status) {
                this.newsId = item.id;

                const newsItem = result.data;
                this.updateNewsForm.patchValue({
                    userId: {
                        id: newsItem.user?.id,
                        userId: newsItem.user?.id,
                        name: newsItem.user?.name,
                    }, // nếu có
                    projectName: newsItem.projectName,
                    memberCount: newsItem.memberCount,
                    articleProjectLevelId: newsItem.articleProjectLevel || 0,
                    workHoursPerProject: newsItem.workHoursPerProject,
                    hoursCalculated: newsItem.hoursCalculated,
                    projectManagerId: newsItem.projectManager || 0,
                    magazineName: newsItem.magazineName,
                    issn: newsItem.issn,
                    volumeNo: newsItem.volumeNo,
                    terminalPage: newsItem.terminalPage,
                    publishYear: new Date(newsItem.publishYear),
                    notes: newsItem.notes,
                });

                this.selectedMembersUpdate = newsItem.authorArticleProjects.map(
                    (author) => ({
                        id: author.user.id,
                        userId: author.userId,
                        name: author.user.name,
                    })
                );
            }
        });
    }

    updateStatus(id: any, status: any) {
        this.newsService
            .updateBodyAndQueryParamsStatusStatus(
                { id: id },
                {
                   statusApprove:status
                }
            )
            .subscribe((result: any) => {
                if (result.status) {
                    this.visibleUpdateNews = false;
                    this.updateNewsForm.reset();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Cập nhật thành công',
                    });
                    this.getNews(this.queryParameters);
                }
            });
    }

    handleUpdateItem() {
        console.log(this.updateNewsForm.value);
        const formValue = this.updateNewsForm.value;
        const projectManagerId = formValue.projectManagerId.id;
        const memberCount = formValue.memberCount;
        const workHours = formValue.articleProjectLevelId.value;

        // Tìm xem người đang tạo bài báo có phải là project manager không
        const isMainAuthor = formValue.userId.id === projectManagerId;

        // Tính số giờ quy đổi theo công thức Excel
        let hoursCalculated = 0;
        if (memberCount > 0) {
            if (isMainAuthor) {
                hoursCalculated =
                    workHours / 3 + ((2 * (workHours / 3)) / memberCount);
            } else {
                hoursCalculated = ((2 * (workHours / 3)) / memberCount);
            }
        }
        console.log(
            this.selectedMembersUpdate.map((item: any) => ({
                userId: item.id,
            }))
        );
        this.newsService
            .updateBodyAndQueryParamsStatus(
                { id: this.newsId },
                {
                    ...this.updateNewsForm.value,
                    articleProjectLevelId:
                        this.updateNewsForm.value.articleProjectLevelId.id,
                    memberCount: memberCount,
                    projectManagerId:
                        this.updateNewsForm.value.projectManagerId.id,
                    userId: this.updateNewsForm.value.userId.id,
                    hoursCalculated: Math.round(hoursCalculated),
                    authorArticleProjects: this.selectedMembersUpdate.map(
                        (item: any) => ({
                            userId: item.id,
                        })
                    ),
                }
            )
            .subscribe((result: any) => {
                if (result.status) {
                    this.visibleUpdateNews = false;
                    this.updateNewsForm.reset();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Cập nhật thành công',
                    });
                    this.getNews(this.queryParameters);
                }
            });
    }

    handleDeleteItem(id: number) {
        this.confirmationService.confirm({
            message: 'Bạn có chắc chắn muốn xóa bản ghi này?',
            header: 'Xác nhận',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                console.log(id);
                this.newsService
                    .delete({ id: id }, {})
                    .subscribe((result: any) => {
                        if (result.status) {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Thành công',
                                detail: 'Đã xóa bài báo',
                            });
                            this.getNews(this.queryParameters);
                        }
                    });
            },
        });
    }
}
