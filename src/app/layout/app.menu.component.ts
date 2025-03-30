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
                        label: 'Seminar',
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
                        routerLink: ['/research-topic'],
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
                        label: 'Báo cáo khoa học',
                        icon: 'pi pi-fw pi-bookmark',
                        routerLink: ['/scientific-report'],
                    },
                ],
            },
        ];
    }
}
