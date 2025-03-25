import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ChangePasswordRoutingModule } from './change-password-routing.module';
import { ChangePasswordComponent } from './change-password.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
// import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
    imports: [
        CommonModule,
        ChangePasswordRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        SharedModule,
    ],
    declarations: [ChangePasswordComponent],
})
export class ChangePasswordModule {}
