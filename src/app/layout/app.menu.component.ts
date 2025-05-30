import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { HasPermissionHelper } from '../core/helpers/has-permission.helper';
import { PermissionConstant } from '../core/constants/permission-constant';
import { AuthService } from '../core/services/identity/auth.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
    model: any[] = [];
    userCurrent: any;
    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        private hasPermissionHelper: HasPermissionHelper
    ) {
        this.authService.userCurrent.subscribe((user) => {
            this.userCurrent = user;
        });
    }

    ngOnInit() {
        this.model = [
            {
                label: '',
                items: [
                    ...(this.hasPermissionHelper.hasPermissions([
                        PermissionConstant.Admin,
                    ])
                        ? [
                              {
                                  label: 'Tổng hợp giờ',
                                  icon: 'pi pi-fw pi-bookmark',
                                  routerLink: ['/statistic'],
                              },
                          ]
                        : []),
                ],
            },

            {
                label: '',
                items: [
                    {
                        label: 'Quản lý hội thảo',
                        icon: 'pi pi-fw pi-bookmark',
                        routerLink: ['/seminar'],
                    },
                ],
            },
            {
                label: '',
                items: [
                    {
                        label: 'Bài báo',
                        icon: 'pi pi-fw pi-bookmark',
                        routerLink: ['/news'],
                    },
                ],
            },
            {
                label: '',
                items: [
                    {
                        label: 'Hướng dẫn sinh viên',
                        icon: 'pi pi-fw pi-bookmark',
                        routerLink: ['/student-guide'],
                    },
                ],
            },
            {
                label: '',
                items: [
                    // ...(this.hasPermissionHelper.hasPermissions([
                    //     PermissionConstant.Teacher,
                    // ])
                    // ? [
                    {
                        label: 'Đề tài nghiên cứu',
                        icon: 'pi pi-fw pi-bookmark',
                        routerLink: ['/science-project'],
                    },
                    //   ]
                    // : []),
                ],
            },
            {
                label: '',
                items: [
                    // ...(this.hasPermissionHelper.hasPermissions([
                    //     PermissionConstant.Teacher,
                    // ])
                    //     ?
                    //     [
                    {
                        label: 'Báo cáo khoa học',
                        icon: 'pi pi-fw pi-bookmark',
                        routerLink: ['/science-report'],
                    },
                    //   ]
                    // : []),
                ],
            },
            {
                label: '',
                items: [
                    // ...(this.hasPermissionHelper.hasPermissions([
                    //     PermissionConstant.Teacher,
                    // ])
                    //     ? [
                    {
                        label: 'Quản lý viết sách',
                        icon: 'pi pi-fw pi-bookmark',
                        routerLink: ['/curriculum'],
                    },
                    //   ]
                    // : []),
                ],
            },
            {
                label: '',
                items: [
                    // ...(this.hasPermissionHelper.hasPermissions([
                    //     PermissionConstant.Teacher,
                    // ])
                    //     ? [
                    {
                        label: 'Sở hữu trí tuệ',
                        icon: 'pi pi-fw pi-bookmark',
                        routerLink: ['/intellectureal-property'],
                    },
                    //   ]
                    // : []),
                ],
            },
            {
                label: '',
                items: [
                    ...(this.hasPermissionHelper.hasPermissions([
                        PermissionConstant.Admin,
                    ])
                        ? [
                              {
                                  label: 'Tài khoản',
                                  icon: 'pi pi-fw pi-bookmark',
                                  routerLink: ['/account'],
                              },
                          ]
                        : []),
                ],
            },
        ];
    }
}
