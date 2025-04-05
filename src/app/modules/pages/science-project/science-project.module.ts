import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScienceProjectComponent } from './science-project.component';
import { ScienceProjectRoutingModule } from './science-project-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
    imports: [CommonModule, ScienceProjectRoutingModule, SharedModule],
    declarations: [ScienceProjectComponent],
})
export class ScienceProjectModule {}
