import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
    model: any[] = [];

    constructor(public layoutService: LayoutService) {}

    ngOnInit() {
        this.model = [
            // {
            //     label: '',
            //     items: [
            //         {
            //             label: 'Quản lý sinh viên',
            //             icon: 'pi pi-fw pi-bookmark',
            //             routerLink: ['/student'],
            //         },
            //     ],
            // },
            {
                label: '',
                items: [
                    {
                        label: 'Quản lý cán bộ',
                        icon: 'pi pi-fw pi-bookmark',
                        routerLink: ['/officer'],
                    },
                ],
            },

            {
                label: '',
                items: [
                    {
                        label: 'Quản lý phòng ban',
                        icon: 'pi pi-fw pi-bookmark',
                        routerLink: ['/departments'],
                    },
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
                        label: 'Đề tài nghiên cứu',
                        icon: 'pi pi-fw pi-bookmark',
                        routerLink: ['/science-project'],
                    },
                ],
            },
            {
                label: '',
                items: [
                    {
                        label: 'Quản lý chức danh',
                        icon: 'pi pi-fw pi-bookmark',
                        routerLink: ['/staff-position'],
                    },
                ],
            },
            {
                label: '',
                items: [
                    {
                        label: 'Báo cáo khoa học',
                        icon: 'pi pi-fw pi-bookmark',
                        routerLink: ['/science-report'],
                    },
                ],
            },
            {
                label: '',
                items: [
                    {
                        label: 'Quản lý viết sách',
                        icon: 'pi pi-fw pi-bookmark',
                        routerLink: ['/curriculum'],
                    },
                ],
            },
            {
                label: '',
                items: [
                    {
                        label: 'Quản lý sở hữu trí tuệ',
                        icon: 'pi pi-fw pi-bookmark',
                        routerLink: ['/intellectureal-property'],
                    },
                ],
            },
        ];
    }
}
