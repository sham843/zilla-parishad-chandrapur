import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
@Component({
  selector: 'app-global-dialog',
  standalone: true,
  imports: [CommonModule,MatCardModule],
  templateUrl: './global-dialog.component.html',
  styleUrls: ['./global-dialog.component.scss']
})
export class GlobalDialogComponent {
  
  constructor(
    public dialogRef: MatDialogRef<GlobalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit(){
    }

    onNoClick(flag:any){
          this.dialogRef.close(flag);
    }
    
}
