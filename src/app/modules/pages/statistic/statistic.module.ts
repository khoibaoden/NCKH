import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticComponent } from './statistic.component';
import { StatisticRoutingModule } from './statistic-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
    imports: [CommonModule, StatisticRoutingModule, SharedModule],
    declarations: [StatisticComponent],
})
export class StatisticModule {}
