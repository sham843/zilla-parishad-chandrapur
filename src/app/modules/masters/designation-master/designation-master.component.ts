import { Component } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { AddDesignationComponent } from './add-designation/add-designation.component';


@Component({
  selector: 'app-designation-master',
  templateUrl: './designation-master.component.html',
  styleUrls: ['./designation-master.component.scss']
})
export class DesignationMasterComponent {

  constructor(public dialog: MatDialog) {}

  adddesignation(){
    this.dialog.open(AddDesignationComponent, {
      width:'400px'
    });
  }

}
