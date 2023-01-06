import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRegistrationRoutingModule } from './student-registration-routing.module';
import { StudentRegistrationComponent } from './student-registration.component';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import { RegisterStudentComponent } from './register-student/register-student.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { TableGridComponent } from "../../../shared/components/table-grid/table-grid.component";
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
    declarations: [
        StudentRegistrationComponent,
        RegisterStudentComponent
    ],
    imports: [
        CommonModule,
        StudentRegistrationRoutingModule,
        MatCardModule,
        MatSelectModule,
        MatIconModule,
        MatInputModule,
        MatDatepickerModule,
        MatDialogModule,
        MatMenuModule,
        MatButtonModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        FormsModule,
        TableGridComponent,
        TranslateModule,
        MatTooltipModule
    ]
})
export class StudentRegistrationModule { }

