import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { OfficerComponent } from './officer.component';
import { OfficerRoutingModule } from './officer-routing.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
    imports: [CommonModule,  SharedModule, OfficerRoutingModule, ConfirmDialogModule],
    declarations: [OfficerComponent],
})
export class officerModule {}
