import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerformanceIndicatorsRoutingModule } from './performance-indicators-routing.module';
import { PerformanceIndicatorsComponent } from './performance-indicators.component';


@NgModule({
  declarations: [
    PerformanceIndicatorsComponent
  ],
  imports: [
    CommonModule,
    PerformanceIndicatorsRoutingModule
  ]
})
export class PerformanceIndicatorsModule { }
