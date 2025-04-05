import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CurriculumComponent } from './curriculum.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: CurriculumComponent }]),
    ],
    exports: [RouterModule],
})
export class CurriculumRoutingModule {}
