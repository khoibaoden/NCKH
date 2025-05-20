import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StudentGuideComponent } from './student-guide.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: StudentGuideComponent }]),
    ],
    exports: [RouterModule],
})
export class StudentGuideRoutingModule {}
