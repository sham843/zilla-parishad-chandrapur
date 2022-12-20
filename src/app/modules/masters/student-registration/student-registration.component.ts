import { Component } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { RegisterStudentComponent } from './register-student/register-student.component';


@Component({
  selector: 'app-student-registration',
  templateUrl: './student-registration.component.html',
  styleUrls: ['./student-registration.component.scss']
})
export class StudentRegistrationComponent {
  constructor(public dialog: MatDialog) {}

  registerStudent(){
    this.dialog.open(RegisterStudentComponent, {
      width:'700px',
      disableClose: true
    });
  }
}
