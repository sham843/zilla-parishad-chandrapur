import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { StudentProfileComponent } from './student-profile/student-profile.component';

@NgModule({
  declarations: [
    DashboardComponent,
    StudentProfileComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
    TranslateModule,
    ReactiveFormsModule
  ]
})
export class DashboardModule { }
