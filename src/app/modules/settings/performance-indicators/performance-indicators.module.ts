import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerformanceIndicatorsRoutingModule } from './performance-indicators-routing.module';
import { PerformanceIndicatorsComponent } from './performance-indicators.component';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';


@NgModule({
  declarations: [
    PerformanceIndicatorsComponent
  ],
  imports: [
    CommonModule,
    PerformanceIndicatorsRoutingModule,
    MatCardModule,
    MatSelectModule
  ]
})
export class PerformanceIndicatorsModule { }
