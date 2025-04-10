import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShowComponent } from './show.component';
import { ShowRoutingModule } from './show-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';

// PrimeNG imports
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ShowRoutingModule,
        SharedModule,
        // PrimeNG modules
        ConfirmDialogModule,
        ToolbarModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        DialogModule,
        ToastModule,
        BreadcrumbModule,
        TooltipModule
    ],
    declarations: [ShowComponent],
})
export class ShowModule {}