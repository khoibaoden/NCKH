import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Page } from 'src/app/core/enums/page.enum';
import { AuthService } from 'src/app/core/services/identity/auth.service';
import { ValidationService } from 'src/app/core/utils/validation.utils';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
        `
            :host ::ng-deep .pi-eye,
            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
        `,
    ],
    providers: [MessageService],
})
export class LoginComponent {
    valCheck: string[] = ['rememberMe'];

    password!: string;
    loginForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private validationService: ValidationService,
        public layoutService: LayoutService,
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService
    ) {
        this.loginForm = this.formBuilder.group({
            userName: [null, [Validators.required]],
            password: [null, [Validators.required]],
            rememberMe: false,
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            const formData = {
                userName: this.loginForm.value.userName,
                password: this.loginForm.value.password,
                rememberMe: this.loginForm.value.rememberMe,
            };
            this.authService.login(formData).subscribe((res) => {
                if (res.status === true) {
                    this.authService.setAuthTokenLocalStorage(res.data);
                    setTimeout(() => {
                        this.authService
                            .fetchUserCurrent()
                            .subscribe((data) => {
                                this.authService.setUserCurrent(data.data);
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Thành công',
                                    detail: 'Đăng nhập thành công',
                                });
                                this.router.navigate([Page.Dashboard]);
                            });
                    }, 300);
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Thất bại',
                        detail: res.message,
                    });
                }
            });
        } else {
            this.loginForm.markAllAsTouched();
        }
    }
}
