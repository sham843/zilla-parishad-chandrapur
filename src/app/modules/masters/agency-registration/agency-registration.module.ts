import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgencyRegistrationRoutingModule } from './agency-registration-routing.module';
import { AgencyRegistrationComponent } from './agency-registration.component';


@NgModule({
  declarations: [
    AgencyRegistrationComponent
  ],
  imports: [
    CommonModule,
    AgencyRegistrationRoutingModule
  ]
})
export class AgencyRegistrationModule { }
