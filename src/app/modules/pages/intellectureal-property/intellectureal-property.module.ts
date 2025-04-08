import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntellecturealPropertyComponent } from './intellectureal-property.component';
import { IntellecturealPropertyRoutingModule } from './intellectureal-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { MultiSelectModule } from 'primeng/multiselect';
@NgModule({
    imports: [
        CommonModule,
        IntellecturealPropertyRoutingModule,
        SharedModule,
        MultiSelectModule,
    ],
    declarations: [IntellecturealPropertyComponent],
})
export class IntellecturealPropertyModule {}
