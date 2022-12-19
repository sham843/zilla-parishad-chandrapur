import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesignationMasterRoutingModule } from './designation-master-routing.module';
import { DesignationMasterComponent } from './designation-master.component';


@NgModule({
  declarations: [
    DesignationMasterComponent
  ],
  imports: [
    CommonModule,
    DesignationMasterRoutingModule
  ]
})
export class DesignationMasterModule { }
