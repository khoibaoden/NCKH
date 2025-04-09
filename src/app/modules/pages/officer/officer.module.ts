import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { OfficerComponent } from './officer.component';

@NgModule({
    imports: [CommonModule,  SharedModule],
    declarations: [OfficerComponent],
})
export class officerModule {}
