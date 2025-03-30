import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ResearchTopicComponent } from './research-topic.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ResearchTopicComponent },
        ]),
    ],

    exports: [RouterModule],
})
export class ResearchTopicRoutingModule {}
