import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FacultyComponent } from './faculty.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: FacultyComponent }]),
    ],
    exports: [RouterModule],
})
export class FacultyRoutingModule {}
