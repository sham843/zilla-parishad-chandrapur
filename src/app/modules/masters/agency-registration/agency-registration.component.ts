import { Component } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { RegisterAgencyComponent } from './register-agency/register-agency.component';

@Component({
  selector: 'app-agency-registration',
  templateUrl: './agency-registration.component.html',
  styleUrls: ['./agency-registration.component.scss']
})
export class AgencyRegistrationComponent {
  constructor(public dialog: MatDialog){}

  registeragency(){
    this.dialog.open(RegisterAgencyComponent, {
      width:'750px',
      disableClose: true
    });
  }

}
