import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InspectionReportRoutingModule } from './inspection-report-routing.module';
import { InspectionReportComponent } from './inspection-report.component';


@NgModule({
  declarations: [
    InspectionReportComponent
  ],
  imports: [
    CommonModule,
    InspectionReportRoutingModule
  ]
})
export class InspectionReportModule { }
