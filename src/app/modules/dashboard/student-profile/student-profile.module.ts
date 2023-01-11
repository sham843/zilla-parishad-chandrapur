import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
 import { TableGridComponent } from '../../../shared/components/table-grid/table-grid.component';
import { StudentProfileRoutingModule } from './student-profile-routing.module';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { StudentProfileComponent } from './student-profile.component';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { NgApexchartsModule } from "ng-apexcharts";
import {MatButtonModule} from '@angular/material/button';
import { ViewDialogComponent } from 'src/app/shared/components/view-dialog/view-dialog.component';

@NgModule({
  declarations: [
    StudentProfileComponent,
    
  ],
  imports: [
    CommonModule,
    StudentProfileRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    TableGridComponent,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    NgApexchartsModule,
    MatButtonModule,
    ViewDialogComponent
  ]
})
export class StudentProfileModule { }
