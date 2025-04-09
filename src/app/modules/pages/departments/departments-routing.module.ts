import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DepartmentComponent } from './departments.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: DepartmentComponent }])],
    exports: [RouterModule],
})
export class DepartmentsRoutingModule {}
