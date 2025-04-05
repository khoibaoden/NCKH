import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ScienceProjectComponent } from './science-project.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ScienceProjectComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class ScienceProjectRoutingModule {}
