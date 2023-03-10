import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../services/api.service';
import { CommonMethodsService } from '../services/common-methods.service';
import { ErrorsService } from '../services/errors.service';
import { WebStorageService } from '../services/web-storage.service';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ValidationService } from '../services/validation.service';

@Component({
  selector: 'app-change-password',
  standalone:true,
  imports: [MatButtonModule, MatIconModule,MatFormFieldModule,ReactiveFormsModule,MatInputModule,TranslateModule,FormsModule,MatCardModule,CommonModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  changePassForm!:FormGroup;
  dialogData: any;
  CurrentPasswordHide: boolean = true;
  newPasswordHide: boolean = true;
  retypePasswordHide: boolean = true;
  language!:string;
  get fpass(){return this.changePassForm.controls}
  constructor(
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb:FormBuilder,
    private apiService:ApiService,
    private common:CommonMethodsService,
    private webStorage:WebStorageService,
    private errors:ErrorsService,
    private spinner:NgxSpinnerService,
    public validation:ValidationService) {
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
      oldPwd:['',[Validators.required, Validators.pattern('^(?=.*[a-z0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&#])[A-Za-z0-9\d@$!%*?&#]{6,15}$')]],
      newPwd:['',[Validators.required, Validators.pattern('^(?=.*[a-z0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&#])[A-Za-z0-9\d@$!%*?&#]{6,15}$')]],
      reTypePwd:['',[Validators.required, Validators.pattern('(?=.*[a-z0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&#])[A-Za-z0-9\d@$!%*?&#]{6,15}$')]]
    })                                    
  }
  onChangePassword(formDirective?:any){
    if(this.changePassForm.invalid){
      return
    }else if(this.changePassForm.value.newPwd != this.changePassForm.value.reTypePwd){
      this.common.snackBar('New Password And Comfirm Password Not Match',1);
    }else if(this.changePassForm.value.oldPwd == this.changePassForm.value.newPwd){
      this.common.snackBar('The Entered Old Password is the Same as the New Password',1);
    }else{
      this.spinner.show();
      this.apiService.setHttp('put','zp_chandrapur/user-registration/UpdatePassward?OldPassword='+this.changePassForm.value.oldPwd+'&UserName='+this.common.getUserName()+'&Password='+this.changePassForm.value.newPwd+'&MobileNo='+this.common.getUserName(), false, false,false, 'baseUrl')
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

  clearForm(formDirective:any){
    formDirective.resetForm();
  }

    onNoClick(flag: any): void {
      this.dialogRef.close(flag);
    }
}
