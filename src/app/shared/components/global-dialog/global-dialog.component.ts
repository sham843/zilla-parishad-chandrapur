import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-global-dialog',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule,MatIconModule,MatFormFieldModule,FormsModule,ReactiveFormsModule,MatInputModule,TranslateModule],
  templateUrl: './global-dialog.component.html',
  styleUrls: ['./global-dialog.component.scss']
})
export class GlobalDialogComponent {
  changePassForm!:FormGroup;
  dialogData: any;
  constructor(
    public dialogRef: MatDialogRef<GlobalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dialogData = this.data
  }
  
  onNoClick(flag: any): void {
    this.dialogRef.close(flag);
  }
}
