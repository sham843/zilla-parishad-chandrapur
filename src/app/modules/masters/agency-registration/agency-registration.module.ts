import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgencyRegistrationRoutingModule } from './agency-registration-routing.module';
import { AgencyRegistrationComponent } from './agency-registration.component';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [
    AgencyRegistrationComponent
  ],
  imports: [
    CommonModule,
    AgencyRegistrationRoutingModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class AgencyRegistrationModule { }
