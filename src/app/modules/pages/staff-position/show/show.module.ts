import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowComponent } from './show.component';
import { ShowRoutingModule } from './show-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
    imports: [CommonModule, ShowRoutingModule, SharedModule],
    declarations: [ShowComponent],
})
export class ShowModule {}
