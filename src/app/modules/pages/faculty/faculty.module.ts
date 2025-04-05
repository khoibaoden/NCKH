import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacultyComponent } from './faculty.component';
import { FacultyRoutingModule } from './faculty-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
    imports: [CommonModule, FacultyRoutingModule, SharedModule],
    declarations: [FacultyComponent],
})
export class FacultyModule {}
