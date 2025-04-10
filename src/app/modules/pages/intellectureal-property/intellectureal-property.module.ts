import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntellecturealPropertyComponent } from './intellectureal-property.component';
import { IntellecturealPropertyRoutingModule } from './intellectureal-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { MultiSelectModule } from 'primeng/multiselect';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
@NgModule({
    imports: [
        CommonModule,
        IntellecturealPropertyRoutingModule,
        SharedModule,
        MultiSelectModule,
        ReactiveFormsModule,
        ConfirmDialogModule,
    ],
    declarations: [IntellecturealPropertyComponent],
})
export class IntellecturealPropertyModule {}
