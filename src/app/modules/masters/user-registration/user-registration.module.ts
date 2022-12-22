import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import { UserRegistrationRoutingModule } from './user-registration-routing.module';
import { UserRegistrationComponent } from './user-registration.component';
import { RegisterUsersComponent } from './register-users/register-users.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TableGridComponent } from 'src/app/shared/components/table-grid/table-grid.component';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
@NgModule({
  declarations: [
    UserRegistrationComponent,
    RegisterUsersComponent
  ],
  imports: [
    CommonModule,
    UserRegistrationRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatDialogModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TableGridComponent,
    GlobalDialogComponent
  ]
})
export class UserRegistrationModule { }
