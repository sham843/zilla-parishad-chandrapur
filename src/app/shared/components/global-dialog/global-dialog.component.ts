import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-global-dialog',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule,MatIconModule,MatFormFieldModule,FormsModule,ReactiveFormsModule,MatInputModule ],
  templateUrl: './global-dialog.component.html',
  styleUrls: ['./global-dialog.component.scss']
})
export class GlobalDialogComponent {
  changePassForm!:FormGroup;
  dialogData: any;
  CurrentPasswordHide: boolean = true;
  newPasswordHide: boolean = true;
  retypePasswordHide: boolean = true;
  language!:string;
  get fpass(){return this.changePassForm.controls}
  constructor(
    public dialogRef: MatDialogRef<GlobalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb:FormBuilder,
    private apiService:ApiService,
    private common:CommonMethodsService,
    private webStorage:WebStorageService,
    private errors:ErrorsService,
    private spinner:NgxSpinnerService) {
    this.dialogData = this.data
  }
  ngOnInit(){
    this.webStorage.setLanguage.subscribe((res:any)=>{
    res=='Marathi'?this.language='mr-IN':this.language='en';
    })
    this.changePassControls();    
  }

  changePassControls(){
    this.changePassForm=this.fb.group({
      newPwd:['',[Validators.required, Validators.pattern('^(?=.*[a-z0-9])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9\d@$!%*?&]{8,20}$')]],
      reTypePwd:['',[Validators.required, Validators.pattern('^(?=.*[a-z0-9])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9\d@$!%*?&]{8,20}$')]]
    })
  }
  onChangePassword(formDirective?:any){
    if(this.changePassForm.invalid){
      return
    }else if(this.changePassForm.value.newPwd != this.changePassForm.value.reTypePwd){
      this.common.snackBar('New Password And Comfirm Password Not Match',1);
    }else{
      this.spinner.show();
      let obj;
      obj={
        "userName":this.common.getUserName(),
        "password": this.changePassForm.value.newPwd,
        "flag": this.language
      }
      this.apiService.setHttp('post','zp_chandrapur/user-registration/forgot-password-for-web', false, obj,false, 'baseUrl')
      this.apiService.getHttp().subscribe((res: any) => {
        if (res.statusCode == '200') {
          this.spinner.hide();
          this.common.snackBar(res.statusMessage,0);
          this.dialogRef.close('Yes');
          formDirective.resetForm();
          
        }else{
          this.spinner.hide();
          this.common.snackBar(res.statusMessage,1);
        }
      },
      (error: any) => {
        this.spinner.hide();
        this.errors.handelError(error.status);
      })
    }
  }
  onNoClick(flag: any): void {
    this.dialogRef.close(flag);
  }
}
