import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeminarComponent } from './seminar.component';
import { SeminarRoutingModule } from './seminar-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
    imports: [CommonModule, SeminarRoutingModule, SharedModule],
    declarations: [SeminarComponent],
})
export class SeminarModule {}
