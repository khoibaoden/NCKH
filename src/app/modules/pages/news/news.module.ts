import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsComponent } from './news.component';
import { NewsRoutingModule } from './news-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
    imports: [
        CommonModule,
        NewsRoutingModule,
        SharedModule,
        MultiSelectModule,
        ConfirmDialogModule,
    ],
    declarations: [NewsComponent],
})
export class NewsModule {}
