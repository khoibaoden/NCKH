import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurriculumRoutingModule } from './curriculum-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { CurriculumComponent } from './curriculum.component';

@NgModule({
    imports: [CommonModule, CurriculumRoutingModule, SharedModule],
    declarations: [CurriculumComponent],
})
export class CurriculumModule {}
