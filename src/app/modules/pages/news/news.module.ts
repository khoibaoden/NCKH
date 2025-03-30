import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsComponent } from './news.component';
import { NewsRoutingModule } from './news-routing.module';

@NgModule({
    imports: [CommonModule, NewsRoutingModule],
    declarations: [NewsComponent],
})
export class NewsModule {}
