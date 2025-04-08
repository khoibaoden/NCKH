import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { DepartmentsComponent } from './departments.component';

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [DepartmentsComponent],
})
export class DepartmentsModule {}
