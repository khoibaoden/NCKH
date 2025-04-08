import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OfficerComponent } from './officer.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: OfficerComponent }])],
    exports: [RouterModule],
})
export class OfficerRoutingModule {}
