import { Component } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { RegisterSchoolComponent } from './register-school/register-school.component';



@Component({
  selector: 'app-school-registration',
  templateUrl: './school-registration.component.html',
  styleUrls: ['./school-registration.component.scss']
})
export class SchoolRegistrationComponent {
  constructor(public dialog: MatDialog) {}

  addnew(){
    this.dialog.open(RegisterSchoolComponent, {
      width:'700px'
    });
  }
}
