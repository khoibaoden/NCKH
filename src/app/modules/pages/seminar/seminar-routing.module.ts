import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SeminarComponent } from './seminar.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: SeminarComponent }]),
    ],
    exports: [RouterModule],
})
export class SeminarRoutingModule {}
