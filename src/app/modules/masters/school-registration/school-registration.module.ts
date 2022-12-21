import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchoolRegistrationRoutingModule } from './school-registration-routing.module';
import { SchoolRegistrationComponent } from './school-registration.component';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import { RegisterSchoolComponent } from './register-school/register-school.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    SchoolRegistrationComponent,
    RegisterSchoolComponent
  ],
  imports: [
    CommonModule,
    SchoolRegistrationRoutingModule,
    MatCardModule,
    MatSelectModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class SchoolRegistrationModule { }
