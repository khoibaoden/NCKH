import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeminarComponent } from './seminar.component';
import { SeminarRoutingModule } from './seminar-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog'; // Import module này

@NgModule({
    imports: [CommonModule, SeminarRoutingModule, SharedModule, ConfirmDialogModule],
    declarations: [SeminarComponent],
})
export class SeminarModule {}
