import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-global-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './global-dialog.component.html',
  styleUrls: ['./global-dialog.component.scss']
})
export class GlobalDialogComponent {
  
  constructor(
    public dialogRef: MatDialogRef<GlobalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
}
