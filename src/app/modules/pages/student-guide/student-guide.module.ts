import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentGuideComponent } from './student-guide.component';
import { StudentGuideRoutingModule } from './student-guide-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
    imports: [
        CommonModule,
        StudentGuideRoutingModule,
        SharedModule,
        ConfirmDialogModule,
    ],
    declarations: [StudentGuideComponent],
})
export class StudentGuideModule {}
