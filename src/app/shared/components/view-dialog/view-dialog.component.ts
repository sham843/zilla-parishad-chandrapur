import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-view-dialog',
  templateUrl: './view-dialog.component.html',
  styleUrls: ['./view-dialog.component.scss'],
  standalone: true,
  imports:[CommonModule,TranslateModule,MatCardModule,MatIconModule,MatDialogModule,MatButtonModule ]
})
export class ViewDialogComponent {

constructor(
  public dialogRef: MatDialogRef<ViewDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any){}

  ngOnInit(){
  }
}
