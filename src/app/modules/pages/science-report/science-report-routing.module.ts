import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ScienceReportComponent } from './science-report.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ScienceReportComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class ScienceReportRoutingModule {}
