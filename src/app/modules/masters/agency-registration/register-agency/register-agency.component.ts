import { Component, Inject, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { ApiService } from 'src/app/core/services/api.service'
import { CommonMethodsService } from 'src/app/core/services/common-methods.service'
import { ErrorsService } from 'src/app/core/services/errors.service'
import { MasterService } from 'src/app/core/services/master.service'
import { ValidationService } from 'src/app/core/services/validation.service'
import { WebStorageService } from 'src/app/core/services/web-storage.service'

@Component({
  selector: 'app-register-agency',
  templateUrl: './register-agency.component.html',
  styleUrls: ['./register-agency.component.scss'],
})
export class RegisterAgencyComponent {
  agencyForm: FormGroup | any;
  districtArr = new Array();
  talukaArr = new Array();
  levelId!:number;
  lang: any;
  loginData:any;
  subscription!: Subscription;
  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective;
  get f() {return this.agencyForm.controls}
  constructor(
    public dialogRef: MatDialogRef<RegisterAgencyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private master: MasterService,
    private apiService: ApiService,
    private errors:ErrorsService,
    public validation:ValidationService,
    public translate:TranslateService,
    private webstorage:WebStorageService,
    private common:CommonMethodsService
  ) {}

  ngOnInit() {
   this.subscription= this.webstorage.setLanguage.subscribe((res:any)=>{
      res=='Marathi'?this.lang='mr-IN':this.lang='en';
    })
    this.loginData=this.webstorage.getLoginData();
    this.levelId=this.loginData.designationLevelId;
    this.getAgencyControl()
    this.getDistrict();
  }
  getAgencyControl() {
    this.agencyForm = this.fb.group({
      agencyName: [this.data.obj?this.data.obj.agencyName:'', [Validators.required,Validators.pattern(this.validation.ngoName)]],
      m_AgencyName: [this.data.obj?this.data.obj.m_AgencyName:'',[Validators.pattern(this.validation.marathi)]],
      registrationNo: [this.data.obj?this.data.obj.registrationNo:'', [Validators.required,Validators.pattern(/^\S*$/),Validators.minLength(5),Validators.maxLength(50)]],
      contactPersonName: [this.data.obj?this.data.obj.contactPersonName:'', [Validators.required,Validators.pattern(this.validation.fullName)]],
      districtId: [this.data.obj?this.data.obj.districtId:this.apiService.disId, [Validators.required]],
      talukaId: [this.data.obj?this.data.obj.talukaId:0],
      contactNo: [this.data.obj?this.data.obj.contactNo:'',[Validators.pattern(this.validation.mobile_No)]],
      emailId: [this.data.obj?this.data.obj.emailId:'', [Validators.email,Validators.pattern(this.validation.email)]],
      address: [this.data.obj?this.data.obj.address:''],
    })
  }
  getDistrict() {
    this.master.getAllDistrict(this.apiService.translateLang?this.lang:'en-IN').subscribe((res: any) => {
      this.districtArr = res.responseData;
      this.agencyForm.controls['districtId'].setValue(this.apiService.disId);
      this.data.obj?this.getTalukaArr(this.data.obj.districtId):this.getTalukaArr(this.districtArr[0].id);;
    })
  }
  getTalukaArr(distId: number) {
    this.master.getAllTaluka((this.apiService.translateLang?this.lang:'en-IN'), distId).subscribe((res: any) => {
      this.talukaArr = res.responseData
      this.levelId!=1 && this.levelId!=2 ?this.agencyForm.controls['talukaId'].setValue(this.loginData.talukaId):'';
    })
  }
  agencyRegister(formDirective:any) {
    if (this.agencyForm.invalid) {
      return
    } else {
      let obj = this.agencyForm.value;
      obj.createdBy=this.data.obj?this.data.createdBy:this.webstorage.getUserId();
      obj.modifiedBy=this.webstorage.getUserId();
      obj.createdDate=this.data.obj?this.data.createdDate:new Date();
      obj.modifiedDate=new Date();
      obj.isDeleted=false;
      obj.id=this.data.obj?this.data.obj.id:0;
      obj.lan=this.lang;
      this.apiService.setHttp((this.data.obj? 'put':'post'),(this.data.obj?'zp_chandrapur/agency/Update':'zp_chandrapur/agency/Add'),false,obj,false, 'baseUrl')
      this.apiService.getHttp().subscribe((res: any) => {
        if (res.statusCode == '200') {
          this.common.snackBar(res.statusMessage,0);
          this.dialogRef.close('Yes');
          formDirective.resetForm();
        }
        else{
            this.common.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
           }
      },
      (error: any) => {
        this.errors.handelError(error.status);
      })
    }
  }
  clearForm(formDirective:any){
    formDirective.resetForm();
    this.getAgencyControl();
  }
  contactNo(){
    this.agencyForm.value.contactNo==0?this.agencyForm.controls['contactNo'].setValue(''):'';
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
