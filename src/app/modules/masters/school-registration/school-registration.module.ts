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
import { TableGridComponent } from 'src/app/shared/components/table-grid/table-grid.component';
import { TranslateModule } from '@ngx-translate/core';
import {MatRadioModule} from '@angular/material/radio';
import { NgxSpinnerModule } from "ngx-spinner";
import { MatTooltipModule } from '@angular/material/tooltip';
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
    TableGridComponent,
    TranslateModule,
    MatRadioModule,
    NgxSpinnerModule,
    MatTooltipModule
  ]
})
export class SchoolRegistrationModule { }
