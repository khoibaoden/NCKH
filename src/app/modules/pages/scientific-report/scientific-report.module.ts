import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScientificReportComponent } from './scientific-report.component';
import { ScientificReportRoutingModule } from './scientific-report-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
    imports: [CommonModule, ScientificReportRoutingModule, SharedModule],
    declarations: [ScientificReportComponent],
})
export class ScientificReportModule {}
