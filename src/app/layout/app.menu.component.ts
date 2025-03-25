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
            {
                label: '',
                items: [
                    {
                        label: 'Hệ thống',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Vị trí',
                                icon: 'pi pi-fw pi-bookmark',
                                routerLink: ['/staff-position'],
                            },
                        ],
                    },
                ],
            },
            {
                label: '',
                items: [
                    {
                        label: 'Thông tin nhân sự',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Hồ sơ',
                                icon: 'pi pi-fw pi-bookmark',
                                routerLink: ['/5'],
                            },
                            {
                                label: 'Hợp đồng',
                                icon: 'pi pi-fw pi-bookmark',
                                routerLink: ['/6'],
                            },
                            {
                                label: 'Nghỉ việc',
                                icon: 'pi pi-fw pi-bookmark',
                                routerLink: ['/7'],
                            },
                            {
                                label: 'Khen thưởng',
                                icon: 'pi pi-fw pi-bookmark',
                                routerLink: ['/8'],
                            },
                        ],
                    },
                ],
            },
        ];
    }
}
