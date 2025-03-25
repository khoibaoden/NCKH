import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from 'src/app/core/services/identity/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
// import { UserService } from 'src/app/core/services/user.service';
import { Page } from 'src/app/core/enums/page.enum';
import { ValidationService } from 'src/app/core/utils/validation.utils';
import { UserService } from 'src/app/core/services/user.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent implements OnInit {
    valCheck: string[] = ['rememberMe'];
    messages: any[] = [];
    password!: string;
    changePasswordForm: FormGroup;
    otpSent: boolean = false;
    showPassword: boolean = false;
    showPasswordConfim: boolean = false;
    errorMessages: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private validationService: ValidationService,
        public layoutService: LayoutService,
        private authService: AuthService,
        private userService: UserService,
        private router: Router,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.changePasswordForm = this.formBuilder.group(
            {
                oldPassword: [null, [Validators.required]],
                newPassword: [null, [Validators.required]],
            },
            { validator: this.passwordMatchValidator }
        );
        this.changePasswordForm
            .get('newPassword')
            ?.valueChanges.subscribe(() => {
                this.errorMessages = false;
            });
    }

    passwordMatchValidator(form: FormGroup) {
        const newPassword = form.get('newPassword')?.value;
        const confirmPassword = form.get('confirmPassword')?.value;

        return newPassword === confirmPassword
            ? null
            : { passwordMismatch: true };
    }

    onSubmit() {
        const formData = this.changePasswordForm.value;

        if (formData.oldPassword === formData.newPassword) {
            this.errorMessages = true;
            return;
        }

        this.userService.ChangePassword(formData).subscribe({
            next: (response) => {
                this.changePasswordForm.reset();
                this.messages = [];
                this.messages.push({
                    severity: 'success',
                    summary: '',
                    detail: 'Mật khẩu đã được đổi thành công!',
                    life: 2000,
                });
                setTimeout(() => {
                    this.handleLogout();
                }, 2000);
                this.errorMessages = false;
            },
            error: (err) => {
                // Handle error, show a PrimeNG error message
                this.messages = [];
                this.messages.push({
                    severity: 'error',
                    summary: '',
                    detail: 'Có lỗi xảy ra. Vui lòng kiểm tra lại thông tin.',
                    life: 3000,
                });
                this.errorMessages = true;
            },
        });
    }

    handleLogout() {
        this.authService.logout().subscribe(
            (res) => {
                if (res.status) {
                    this.authService.setUserCurrent(null);
                    this.authService.setAuthTokenLocalStorage(null);
                    this.router.navigate([Page.Home]);
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Thông báo',
                        detail: 'Mật khẩu đã thay đổi. Hãy đăng nhập lại',
                        life: 3000,
                    });
                }
            },
            (exception) => {
                this.messageService.add({
                    severity: 'warning',
                    summary: 'Cảnh báo',
                    detail: 'Lỗi hệ thống',
                });
            }
        );
    }

    navigateToSetPassword() {
        this.router.navigate(['']);
    }
}
