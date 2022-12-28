import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgencyRegistrationRoutingModule } from './agency-registration-routing.module';
import { AgencyRegistrationComponent } from './agency-registration.component';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { RegisterAgencyComponent } from './register-agency/register-agency.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import { TableGridComponent } from 'src/app/shared/components/table-grid/table-grid.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [
    AgencyRegistrationComponent,
    RegisterAgencyComponent
  ],
  imports: [
    CommonModule,
    AgencyRegistrationRoutingModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    TableGridComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTooltipModule
  ]
})
export class AgencyRegistrationModule { }
