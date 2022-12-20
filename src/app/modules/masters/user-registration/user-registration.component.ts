import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegisterUsersComponent } from './register-users/register-users.component';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss']
})
export class UserRegistrationComponent {
  constructor(public dialog: MatDialog) {}

  registerusers(){
    this.dialog.open(RegisterUsersComponent, {
      width:'700px',
      disableClose: true
    });
  }

}
