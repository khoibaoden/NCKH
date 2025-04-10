import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ScienceReportsComponent } from './science-report.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ScienceReportsComponent},
        ]),
    ],
    exports: [RouterModule],
})
export class ScienceReportRoutingModule {}
