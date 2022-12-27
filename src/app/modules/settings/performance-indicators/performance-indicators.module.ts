import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerformanceIndicatorsRoutingModule } from './performance-indicators-routing.module';
import { PerformanceIndicatorsComponent } from './performance-indicators.component';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { AddClassComponent } from './add-class/add-class.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { AddLevelComponent } from './add-level/add-level.component';
import { MatSortModule } from '@angular/material/sort';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PerformanceIndicatorsComponent,
    AddClassComponent,
    AddLevelComponent
  ],
  imports: [
    CommonModule,
    PerformanceIndicatorsRoutingModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatSortModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class PerformanceIndicatorsModule { }
