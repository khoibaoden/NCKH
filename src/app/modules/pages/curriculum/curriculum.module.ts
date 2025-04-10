import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurriculumRoutingModule } from './curriculum-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { CurriculumComponent } from './curriculum.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
    imports: [
        CommonModule,
        CurriculumRoutingModule,
        SharedModule,
        ConfirmDialogModule,
    ],
    declarations: [CurriculumComponent],
})
export class CurriculumModule {}
