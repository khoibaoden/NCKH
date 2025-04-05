import { IntellecturealPropertyModule } from './intellectureal-property.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IntellecturealPropertyComponent } from './intellectureal-property.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: IntellecturealPropertyComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class IntellecturealPropertyRoutingModule {}
