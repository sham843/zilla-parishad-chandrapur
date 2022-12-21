import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesignationMasterRoutingModule } from './designation-master-routing.module';
import { DesignationMasterComponent } from './designation-master.component';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import { AddDesignationComponent } from './add-designation/add-designation.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { TableGridComponent } from 'src/app/shared/components/table-grid/table-grid.component';




@NgModule({
  declarations: [
    DesignationMasterComponent,
    AddDesignationComponent,
  ],
  imports: [
    CommonModule,
    DesignationMasterRoutingModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatMenuModule,
    MatButtonModule,
    TableGridComponent,
    ReactiveFormsModule
  ],
  providers:[]
})
export class DesignationMasterModule { }
