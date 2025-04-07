import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/identity/auth.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent {
    @ViewChild('menu') menu!: ElementRef;
    @ViewChild('menubutton', { static: false }) menuButton!: ElementRef;
    @ViewChild('topbarmenubutton', { static: false })
    topbarMenuButton!: ElementRef;

    menuItems: MenuItem[] = [];
    userInfo: any = null;
    showProfileModal: boolean = false;

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit() {
        this.menuItems = [
            {
                label: 'Tài khoản',
                icon: 'pi pi-user',
                command: () => this.goToProfile(),
            },
            {
                label: 'Đăng xuất',
                icon: 'pi pi-sign-out',
                command: () => this.logout(),
            },
        ];
        this.authService.getUserCurrentApi().subscribe((response) => {
            if (response.status) {
                this.userInfo = response.data;
            }
        });
    }

    goToProfile() {
        this.router.navigate(['/profile']);
    }

    logout() {
        this.router.navigate(['/auth/login']);
    }

    openProfileModal() {
        this.showProfileModal = true;
    }

    closeProfileModal() {
        this.showProfileModal = false;
    }
}
