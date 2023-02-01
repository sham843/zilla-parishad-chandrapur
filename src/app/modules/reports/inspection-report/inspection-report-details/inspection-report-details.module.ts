import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InspectionReportDetailsRoutingModule } from './inspection-report-details-routing.module';
import { InspectionReportDetailsComponent } from './inspection-report-details.component';


@NgModule({
  declarations: [
    InspectionReportDetailsComponent
  ],
  imports: [
    CommonModule,
    InspectionReportDetailsRoutingModule
  ]
})
export class InspectionReportDetailsModule { }
