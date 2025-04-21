import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScienceProjectComponent } from './science-project.component';
import { ScienceProjectRoutingModule } from './science-project-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        ScienceProjectRoutingModule,
        SharedModule,
        ConfirmDialogModule,
        FormsModule, // bắt buộc nếu dùng ngModel
        MultiSelectModule, // để dùng p-multiSelect
    ],
    declarations: [ScienceProjectComponent],
})
export class ScienceProjectModule {}
