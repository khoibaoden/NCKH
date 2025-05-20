import { ClassService } from './../../../core/services/class.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import pagingConfig, {
    DEFAULT_PAGE_INDEX,
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZE_OPTIONS,
    DEFAULT_PER_PAGE_OPTIONS,
} from 'src/app/core/configs/paging.config';
import systemConfig from 'src/app/core/configs/system.config';
import { Form, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/core/services/identity/auth.service';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css'],
    providers: [MessageService],
})
export class AccountComponent implements OnInit {
    items: any;
    accounts: any[] = [];
    filteredName: string = '';
    classes: any;
    expandedRows = {};
    registerForm: any;
    displayRegisterModal: boolean = false;
    displayTable: boolean = true;
    roles: any;
    displayEditAccountModal: boolean = false;

    fullName: any;
    selectedClass: any;

    paging: any = {
        pageIndex: DEFAULT_PAGE_INDEX,
        pageSize: DEFAULT_PAGE_SIZE,
        sortBy: '',
        orderBy: '',
        totalRecords: 0,
        totalPages: 0,
    };

    config: any = {
        paging: pagingConfig.default,
        baseUrl: systemConfig.baseFileSystemUrl,
        perPageOptions: DEFAULT_PER_PAGE_OPTIONS,
        pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
    };
    public math = Math;

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private formBuiler: FormBuilder,
        private classService: ClassService
    ) {
        this.registerForm = this.formBuiler.group({
            userName: ['', [Validators.required]],
            password: ['', [Validators.required]],
            confirmPassword: ['', [Validators.required]],
            selectedClass: [''],
        });
    }

    openModelRegister() {}

    ngOnInit() {
        this.items = [
            { label: 'Quản lý tài khoản', route: '/account-management' },
            { label: 'Danh sách tài khoản' },
        ];
        this.loadAccounts();
        this.loadRoles();
        this.loadClass();
    }

    loadClass() {
        this.classService.getPaging().subscribe((response) => {
            this.classes = response.data.items;
        });
    }
    loadRoles() {
        this.authService.getRoles().subscribe((response) => {
            this.roles = response;
        });
    }
    loadAccounts() {
        const request = {
            params: new HttpParams()
                .set('pageIndex', this.paging.pageIndex.toString())
                .set('pageSize', this.paging.pageSize.toString())
                .set('sortBy', this.paging.sortBy || '')
                .set('orderBy', this.paging.orderBy || '')
                .set('keyword', this.filteredName || ''),
        };

        this.authService.getPagingUser(request).subscribe(
            (response) => {
                this.accounts = response.data.items || [];
                if (this.accounts.length === 0) {
                    this.paging.pageIndex = 1;
                }

                const { items, ...paging } = response.data;
                this.paging = paging;
            },
            (error) => {
                console.error('API Error:', error);
                this.accounts = [];
            }
        );

        this.accounts;
    }

    onPageChange(event: any) {
        this.paging.pageIndex = event.page + 1;
        this.paging.pageSize = event.rows;
        this.loadAccounts();
    }

    filter() {
        this.paging.pageIndex = 1;
        this.loadAccounts();
    }

    onRowExpand(event: TableRowExpandEvent) {
        // Handle row expansion if needed
    }

    onRowCollapse(event: TableRowCollapseEvent) {
        // Handle row collapse if needed
    }

    showCreateDialog() {
        // Implementation for showing create dialog
    }

    handleRegister() {
        if (this.registerForm.invalid) {
            console.error('Form is invalid');
            return;
        }

        this.authService.register(this.registerForm.value).subscribe({
            next: (response) => {
                alert('Registration successful');
                // Thêm xử lý sau khi đăng ký thành công nếu cần
            },
            error: (error) => {
                console.error('Registration failed', error);
                // Thêm xử lý khi đăng ký thất bại nếu cần
            },
        });
    }
}
