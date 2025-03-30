import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResearchTopicComponent } from './research-topic.component';
import { ResearchTopicRoutingModule } from './research-topic-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
    imports: [CommonModule, ResearchTopicRoutingModule, SharedModule],
    declarations: [ResearchTopicComponent],
})
export class ResearchTopicModule {}
