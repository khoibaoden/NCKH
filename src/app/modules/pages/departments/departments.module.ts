import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { DepartmentComponent } from './departments.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DepartmentsRoutingModule } from './departments-routing.module';

@NgModule({
    imports: [CommonModule, SharedModule, ConfirmDialogModule, DepartmentsRoutingModule],
    declarations: [DepartmentComponent],
})
export class DepartmentsModule {}
