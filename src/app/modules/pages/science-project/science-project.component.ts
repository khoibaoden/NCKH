import { UserService } from 'src/app/core/services/user.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ScienceProjectService } from 'src/app/core/services/science-project.service';
import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import pagingConfig, {
    DEFAULT_PAGE_INDEX,
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZE_OPTIONS,
    DEFAULT_PER_PAGE_OPTIONS,
} from 'src/app/core/configs/paging.config';
import systemConfig from 'src/app/core/configs/system.config';
import sortConstant from 'src/app/core/constants/sort.Constant';
import { ClassService } from 'src/app/core/services/class.service';
import { ScienceProjectLevelService } from 'src/app/core/services/science-project-level.service';
import { AuthService } from 'src/app/core/services/identity/auth.service';

@Component({
    selector: 'app-science-project',
    templateUrl: './science-project.component.html',
    styleUrls: ['./science-project.component.css'],
    providers: [MessageService, ConfirmationService],
})
export class ScienceProjectComponent implements OnInit {
    topicName: any;
    codeSelected: any;
    authorsList: any;
    selectedAuthor: any;
    authorName: any;
    visibleScienceProject: boolean = false;
    visibleUpdateScienceProject: boolean = false;
    createScienceProjectForm: FormGroup;
    updateScienceProjectForm: FormGroup;
    selectedScienceProjectsUpdate: any;
    scienceProjectId: any;
    statusOptions: any[] = [
        { label: 'Đang thực hiện', value: 0 },
        { label: 'Đã hoàn thành', value: 1 },
        { label: 'Tốt', value: 2 },
        { label: 'Thông minh', value: 3 },
    ];
    membersList = [
        { name: 'Nguyễn Văn A', value: 'nguyenvana' },
        { name: 'Trần Thị B', value: 'tranthib' },
        { name: 'Lê Văn C', value: 'levanc' },
    ];

    selectedMembers: string[] = [];
    items: any;
    scienceProjects: any;
    scienceProjectLevels: any;
    projectLeaders: any;
    members: any;
    selectedMembersUpdate: any;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private classService: ClassService,
        private fb: FormBuilder,
        private scienceProjectService: ScienceProjectService,
        private messageService: MessageService,
        private scienceProjectLevelService: ScienceProjectLevelService,
        private userService: UserService,
        private confirmationService: ConfirmationService,
        private authService: AuthService
    ) {
        this.createScienceProjectForm = this.fb.group({
            projectName: ['', Validators.required],
            scienceProjectLevelId: [null],
            startYear: [null],
            endYear: [null],
            projectLeader: [''],
            memberCount: [null],
            projectCode: [''],
            durationInYears: [null],
            workHoursPerProject: [null],
            hoursCalculated: [null],
            projectManagerId: [null],
            managingAgency: [''],
            scienceProjecStatus: [null],
            notes: [''],
            acceptanceDate: [null],
            membersName: [''],
        });

        this.updateScienceProjectForm = this.fb.group({
            projectName: ['', Validators.required],
            scienceProjectLevelId: [null],
            startYear: [null],
            endYear: [null],
            projectLeader: [''],
            memberCount: [null],
            projectCode: [''],
            durationInYears: [null],
            workHoursPerProject: [null],
            hoursCalculated: [null],
            projectManagerId: [null],
            managingAgency: [''],
            scienceProjecStatus: [0],
            notes: [''],
            acceptanceDate: [null],
            membersName: [''],
        });
    }

    public config: any = {
        paging: pagingConfig.default,
        baseUrl: systemConfig.baseFileSystemUrl,
        perPageOptions: DEFAULT_PER_PAGE_OPTIONS,
        pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
    };

    // public constant: any = {
    //     class: classConstant,
    //     sort: sortConstant,
    // };

    public paging: any = {
        pageIndex: DEFAULT_PAGE_INDEX,
        pageSize: DEFAULT_PAGE_SIZE,
        sortBy: '',
        orderBy: '',
        totalRecords: 0,
        totalPages: 0,
    };

    public selectedScienceProjects: any = [];

    public queryParameters: any = {
        ...this.config.paging,
        status: 0,
        keyWord: '',
        codeName: '',
    };
    userCurrent: any;
    ngOnInit() {
        this.items = [{ label: 'Đề tài nghiên cứu' }];
        this.authService.userCurrent.subscribe((user) => {
            this.userCurrent = user;
        });
        this.getScience({});
        this.loadMembers();
        this.loadProjectLeaders();
        this.loadScienceProjectLevel();
        this.loadAuthors();
    }

    loadProjectLeaders() {
        this.userService
            .getPaging({
                pageSize: 1000,
            })
            .subscribe((result: any) => {
                if (result.status) {
                    this.projectLeaders = result.data.items;
                }
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

    loadScienceProjectLevel() {
        this.scienceProjectLevelService.getPaging().subscribe((result: any) => {
            if (result.status) {
                this.scienceProjectLevels = result.data.items;
            }
        });
    }

    public getScience(request: any): any {
        this.scienceProjectService
            .getPaging({
                ...request,
                // userId: this.userCurrent.id != 1 ? this.userCurrent.id : null,
                // authorIds:[this.userCurrent.id]
                authorIds: this.userCurrent.id == 1 ? null : [this.userCurrent.id]

            })
            .subscribe((result: any) => {
                if (result.status) {
                    this.scienceProjects = result.data.items;
                    this.scienceProjects = this.scienceProjects.map(
                        (item: any) => ({
                            ...item,
                            authorScienceProjects: item.authorScienceProjects
                                .map((item2) => item2.user.name)
                                .join(', '),
                        })
                    );

                    if (this.scienceProjects.length === 0) {
                        this.paging.pageIndex = 1;
                    }

                    const { items, ...paging } = result.data;
                    this.paging = paging;

                    this.selectedScienceProjects = [];
                }
            });
    }

    public selectAllScience(event: any): void {
        if (event.target.checked) {
            this.selectedScienceProjects = this.scienceProjects.map(
                (teacher: any) => teacher.id
            );
        } else {
            this.selectedScienceProjects = [];
        }
    }

    public handleSelectItem(id: number): void {
        if (this.isSelected(id)) {
            this.selectedScienceProjects = this.selectedScienceProjects.filter(
                (id: any) => id !== id
            );
        } else {
            this.selectedScienceProjects.push(id);
        }
    }

    public isSelected(id: number): boolean {
        return this.selectedScienceProjects.includes(id);
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
    formatUsersUpdate(data: any): [] {
        return data.map((item) => ({
            id: item.user.id,
            name: item.user.name,
        }));
    }

    handleDeleteItem(id: number) {
        this.confirmationService.confirm({
            message: 'Bạn có chắc chắn muốn xóa bản ghi này?',
            header: 'Xác nhận',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.scienceProjectService
                    .delete(id)
                    .subscribe((result: any) => {
                        if (result.status) {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Thành công',
                                detail: 'Đã xóa hội thảo',
                            });
                            this.getScience(this.queryParameters);
                        }
                    });
            },
        });
    }

    public handleCreateItem() {
        const authorScienceProjects = this.selectedMembers.map((item: any) => ({
            userId: item.id,
        }));

        this.selectedMembersUpdate = this.selectedMembers.map((item: any) => ({
            userId: item.id,
        }));
        console.log(this.createScienceProjectForm.value);
        this.scienceProjectService
            .create({
                ...this.createScienceProjectForm.value,
                scienceProjectLevelId:
                    this.createScienceProjectForm.value.scienceProjectLevelId
                        ?.id,
                projectManagerId:
                    this.createScienceProjectForm.value.projectLeader,
                authorScienceProjects: authorScienceProjects,
                memberCount: authorScienceProjects.length,
                workHoursPerProject:
                    this.createScienceProjectForm.value.scienceProjectLevelId
                        .value *
                    this.createScienceProjectForm.value.durationInYears,
            })
            .subscribe((result: any) => {
                if (result.status) {
                    this.visibleScienceProject = false;
                    this.createScienceProjectForm.reset();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Đã thêm hội thảo mới',
                    });
                    this.getScience(this.queryParameters);
                }
            });
    }

    public handleUpdateItem() {
        console.log(this.updateScienceProjectForm.value);
        this.scienceProjectService
            .updateBodyAndQueryParamsStatus(
                { id: this.scienceProjectId.id },
                {
                    ...this.updateScienceProjectForm.value,
                    scienceProjectLevelId:
                        typeof this.updateScienceProjectForm.value
                            .scienceProjectLevelId === 'object'
                            ? this.updateScienceProjectForm.value
                                  .scienceProjectLevelId?.id
                            : this.updateScienceProjectForm.value
                                  .scienceProjectLevelId,

                    projectLeader: 'string',
                    projectManagerId:
                        this.updateScienceProjectForm.value.projectLeader,
                    authorScienceProjects: this.selectedMembersUpdate.map(
                        (item: any) => ({
                            userId: item.id,
                        })
                    ),
                }
            )
            .subscribe((result: any) => {
                if (result.status) {
                    this.visibleUpdateScienceProject = false;
                    this.updateScienceProjectForm.reset();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Đã cập nhật đề tài!',
                    });
                    this.getScience(this.queryParameters);
                }
            });
    }

    handleShowUpdateCurriculum(item: any) {
        this.visibleUpdateScienceProject = true;
        this.scienceProjectService
            .getById({ id: item.id })
            .subscribe((result: any) => {
                if (result.status) {
                    this.scienceProjectId = result.data;
                    const scienceProject = result.data;
                    this.updateScienceProjectForm = this.fb.group({
                        id: [item.id],
                        projectName: [item.projectName, Validators.required],
                        scienceProjectLevelId: [
                            item.scienceProjectLevel,
                            Validators.required,
                        ],
                        startYear: [new Date(item.startYear)],
                        endYear: [new Date(item.endYear)],
                        projectLeader: [item.projectManager?.id],
                        memberCount: [item.memberCount],
                        projectCode: [item.projectCode],
                        durationInYears: [item.durationInYears],
                        workHoursPerProject: [item.workHoursPerProject],
                        hoursCalculated: [item.hoursCalculated],
                        projectManagerId: [item.projectManagerId],
                        managingAgency: [item.managingAgency],
                        scienceProjecStatus: [
                            item.scienceProjecStatus,
                            Validators.required,
                        ],
                        notes: [item.notes],
                        acceptanceDate: [item.acceptanceDate],
                    });
                    this.selectedMembersUpdate = this.convertUserList(
                        scienceProject.authorScienceProjects
                    );
                }
            });

        // this.selectedMembersUpdate = this.sel;
    }

    formatUsers(data: any): [] {
        return data.map((item) => ({
            id: item.id,
            name: item.name,
        }));
    }

    convertUserList(data: any) {
        return data.map((item) => ({
            id: item.userId,
            name: item.user.name,
        }));
    }

    loadAuthors() {}

    handleSearchAuthor(event: any) {
        this.userService
            .getPaging({ name: event.query, pageSize: 1000 })
            .subscribe((result: any) => {
                if (result.status) {
                    this.authorsList = result.data.items;
                    // this.authorsList = this.authorsList.map((item: any) => ({
                    //     id: item.id,
                    //     name: item.name,
                    // }));
                }
            });
    }

    handleFilterScienceProject() {
        const payload = {
            KeyWord: this.topicName,
            AuthorIds: this.selectedAuthor
                ? [this.selectedAuthor].map((author) => author?.id)
                : null,

            authorName: this.authorName,
        };
        this.getScience(payload);
    }
}
