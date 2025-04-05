import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScienceReportComponent } from './science-report.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ScienceReportRoutingModule } from './science-report-routing.module';

@NgModule({
    imports: [CommonModule, ScienceReportRoutingModule, SharedModule],
    declarations: [ScienceReportComponent],
})
export class ScienceReportModule {}
