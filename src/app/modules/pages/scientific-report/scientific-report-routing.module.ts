import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ScientificReportComponent } from './scientific-report.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ScientificReportComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class ScientificReportRoutingModule {}
