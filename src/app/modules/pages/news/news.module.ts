import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsComponent } from './news.component';
import { NewsRoutingModule } from './news-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
    imports: [CommonModule, NewsRoutingModule, SharedModule],
    declarations: [NewsComponent],
})
export class NewsModule {}
