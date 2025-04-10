import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScienceReportsComponent } from './science-report.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ScienceReportRoutingModule } from './science-report-routing.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
    imports: [CommonModule, ScienceReportRoutingModule, SharedModule, ConfirmDialogModule],
    declarations: [ScienceReportsComponent],
})
export class ScienceReportModule {}
