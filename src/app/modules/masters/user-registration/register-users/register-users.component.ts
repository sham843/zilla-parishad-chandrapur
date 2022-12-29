import { Component, Inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { TranslateService } from '@ngx-translate/core'
import { ApiService } from 'src/app/core/services/api.service'
import { CommonMethodsService } from 'src/app/core/services/common-methods.service'
import { ErrorsService } from 'src/app/core/services/errors.service'
import { MasterService } from 'src/app/core/services/master.service'
import { ValidationService } from 'src/app/core/services/validation.service'
import { WebStorageService } from 'src/app/core/services/web-storage.service'
@Component({
  selector: 'app-register-users',
  templateUrl: './register-users.component.html',
  styleUrls: ['./register-users.component.scss']
})
export class RegisterUsersComponent {
  userRegistrationForm:FormGroup |any;
  userTypeArr=new Array();
  userLevelArr=new Array();
  designationArr=new Array();
  districtArr=new Array();
  talukaArr=new Array();
  kendraArr=new Array();
  agencyArr=new Array();
  schoolArr=new Array();
  classArr=new Array();
  subjectArr=new Array();
  lang:string |any='English';
  get f(){return this.userRegistrationForm.controls}
  constructor(
    private webStorage:WebStorageService,
    private fb: FormBuilder,
    public validation: ValidationService,
    private master: MasterService,
    public translate:TranslateService,
    public dialogRef: MatDialogRef<RegisterUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService:ApiService,
    private errors:ErrorsService,
    private common:CommonMethodsService
  ) {}

  ngOnInit() {
    this.webStorage.setLanguage.subscribe((res:any)=>{
     res=='Marathi'?this.lang='mr-IN':this.lang='en';
    })
    this.getUserControl();
    this.getUserType();
    this.getDistrict();
    this.getAgency();
    this.getAllSubject();
    console.log(this.data);
  }

  getUserControl() {
    this.userRegistrationForm = this.fb.group({
      userTypeId: [this.data?this.data.userTypeId:0, [Validators.required]],
      designationLevelId: [this.data?this.data.designationLevelId:0,[Validators.required]],
      designationId: [this.data?this.data.designationId:0],
      districtId: [this.data?this.data.districtId:0, [Validators.required]],
      talukaId: [this.data?this.data.talukaId:0],
      centerId: [this.data?this.data.centerId:0],
      schoolId: [this.data?this.data.schoolId:0],
      agencyId: [this.data?this.data.agencyId:0],
      name: [this.data?this.data.name:'', [Validators.required,Validators.pattern(this.validation.fullName)]],
      mobileNo: [this.data?this.data.mobileNo:'', [Validators.required,Validators.pattern(this.validation.mobile_No)]],
      emailId: [this.data?this.data.emailId:'', [Validators.required,Validators.email,Validators.pattern(this.validation.email)]],
      standardModels: [[]],
      subjectModels: [[]]
    })
  }
  //#region----------------------------------------------all dropdown methods start---------------------------------------------------
  getUserType() {
    this.master.getUserType(this.lang).subscribe((res:any)=>{
      this.userTypeArr=res.responseData;
    })
    this.data?this.getUserLevel(this.data.userTypeId):'';
  }
  getUserLevel(typeId:number) {
    debugger
  this.apiService.setHttp('GET', 'designation/get-designation-levels-userTypes?userTypeId='+typeId+'&flag='+this.lang, false, false, false, 'baseUrl');
  this.apiService.getHttp().subscribe({
    next: (res: any) => {
    if(res.statusCode == "200"){
      this.userLevelArr=res.responseData;
    }
  else{
      this.common.snackBar(res.statusMessage,1)
    }},
      error: ((err: any) => { this.errors.handelError(err) })
  }) 
  this.data?this.getDesignation(this.userRegistrationForm.value.designationId):'';
}

  getDesignation(levelId:any) {
    this.apiService.setHttp('GET', 'designation/get-set-designation-types?designationLevelId='+levelId+'&flag='+this.lang, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
      if(res.statusCode == "200"){
        this.designationArr=res.responseData;
      }
    else{
        this.common.snackBar(res.statusMessage,1)
      }},
        error: ((err: any) => { this.errors.handelError(err) })
    })
  } 

  getDistrict() {
    this.master.getAllDistrict(this.lang).subscribe((res: any) => {
      this.districtArr = res.responseData;
      this.userRegistrationForm.controls['districtId'].setValue(this.districtArr[0].id);
      this.getTaluka(this.districtArr[0].id)
    })
    this.data?this.getTaluka(this.data.districtId):'';
  }

  getTaluka(distId:number) {
     this.master.getAllTaluka(this.lang,distId).subscribe((res: any) => {
      this.talukaArr = res.responseData;
    })
    this.data?this.getKendra(this.data.talukaId):'';
  }

  getKendra(talukaId:number) {
    this.master.getAllCenter(this.lang,talukaId).subscribe((res: any) => {
      this.kendraArr = res.responseData;
    })
    this.data?this.getSchoolName(this.data.centerId):'';
  }

  getSchoolName(centerId:number) {
    this.master.getSchoolByCenter(this.lang,centerId).subscribe((res:any)=>{
      this.schoolArr=res.responseData;
    })
  }

  getAgency() {
    this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllAgency?flag_lang='+this.lang, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
       next: (res: any) => {
        if(res.statusCode == "200"){
          this.agencyArr=res.responseData;
        }
      else{
          this.common.snackBar(res.statusMessage,1)
        }},
          error: ((err: any) => { this.errors.handelError(err) })
      })
    }

  getAllClassGroup(schoolId:number) {
    this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllClassBySchoolId?flag_lang='+this.lang+'&SchoolId='+schoolId, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
       if(res.statusCode == "200"){
        this.classArr=res.responseData;
       }
     else{
         this.common.snackBar(res.statusMessage,1)
       }},
         error: ((err: any) => { this.errors.handelError(err) })
     })
  }

  getAllSubject() {
    this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllSubject?flag_lang='+this.lang, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
       if(res.statusCode == "200"){
        this.subjectArr=res.responseData;
       }
     else{
         this.common.snackBar(res.statusMessage,1)
       }},
         error: ((err: any) => { this.errors.handelError(err) })
     })
  }

//#endregion-------------------------------------------dropdown methods end----------------------------------------------------------------
 //#region---------------------------------------------add and remove validation start-------------------------------------------------
addRemoveValidation(){
if(this.userRegistrationForm.value.userTypeId==2){
  this.userRegistrationForm.get('designationId')?.setValidators([Validators.required]);
  this.userRegistrationForm.get('designationId')?.updateValueAndValidity();
  this.userRegistrationForm.get('talukaId')?.clearValidators();
  this.userRegistrationForm.get('talukaId')?.updateValueAndValidity();
  this.userRegistrationForm.get('centerId')?.clearValidators();
  this.userRegistrationForm.get('centerId')?.updateValueAndValidity();
  this.userRegistrationForm.get('schoolId')?.clearValidators();
  this.userRegistrationForm.get('schoolId')?.updateValueAndValidity();
  this.userRegistrationForm.get('standardModels')?.clearValidators();
  this.userRegistrationForm.get('standardModels')?.updateValueAndValidity();
  this.userRegistrationForm.get('subjectModels')?.clearValidators();
  this.userRegistrationForm.get('subjectModels')?.updateValueAndValidity();
  this.userRegistrationForm.get('agencyId')?.clearValidators();
  this.userRegistrationForm.get('agencyId')?.updateValueAndValidity();
}else if(this.userRegistrationForm.value.userTypeId==3){
  this.userRegistrationForm.get('designationId')?.setValidators([Validators.required]);
  this.userRegistrationForm.get('designationId')?.updateValueAndValidity();
  this.userRegistrationForm.get('talukaId')?.setValidators([Validators.required]);
  this.userRegistrationForm.get('talukaId')?.updateValueAndValidity();
  this.userRegistrationForm.get('centerId')?.setValidators([Validators.required]);
  this.userRegistrationForm.get('centerId')?.updateValueAndValidity();
  this.userRegistrationForm.get('schoolId')?.setValidators([Validators.required]);
  this.userRegistrationForm.get('schoolId')?.updateValueAndValidity();
  this.userRegistrationForm.get('standardModels')?.setValidators([Validators.required]);
  this.userRegistrationForm.get('standardModels')?.updateValueAndValidity();
  this.userRegistrationForm.get('subjectModels')?.setValidators([Validators.required]);
  this.userRegistrationForm.get('subjectModels')?.updateValueAndValidity();
  this.userRegistrationForm.get('agencyId')?.clearValidators();
  this.userRegistrationForm.get('agencyId')?.updateValueAndValidity();
}else if(this.userRegistrationForm.value.userTypeId==4){
  this.userRegistrationForm.get('agencyId')?.setValidators([Validators.required]);
  this.userRegistrationForm.get('agencyId')?.updateValueAndValidity();
  this.userRegistrationForm.get('talukaId')?.setValidators([Validators.required]);
  this.userRegistrationForm.get('talukaId')?.updateValueAndValidity();
  this.userRegistrationForm.get('centerId')?.setValidators([Validators.required]);
  this.userRegistrationForm.get('centerId')?.updateValueAndValidity();
  this.userRegistrationForm.get('designationId')?.clearValidators();
  this.userRegistrationForm.get('designationId')?.updateValueAndValidity();
  this.userRegistrationForm.get('schoolId')?.clearValidators();
  this.userRegistrationForm.get('schoolId')?.updateValueAndValidity();
  this.userRegistrationForm.get('standardModels')?.clearValidators();
  this.userRegistrationForm.get('standardModels')?.updateValueAndValidity();
  this.userRegistrationForm.get('subjectModels')?.clearValidators();
  this.userRegistrationForm.get('subjectModels')?.updateValueAndValidity();
}

  }
  //#endregion-----------------------------------------add and remove validation end----------------------------------------------------
  //#region--------------------------------------------clear dropdown--------------------------------------------------------------------------
  clearDropdown(flag:any){
    if(flag=='userType'){
      this.userRegistrationForm.controls['designationLevelId'].setValue('');
      this.userRegistrationForm.controls['designationId'].setValue('');
    }else if(flag=='designationLevel'){
      this.userRegistrationForm.value.userTypeId==4?this.userRegistrationForm.controls['agencyId'].setValue(''):'';
      this.userRegistrationForm.controls['designationId'].setValue('');
    }else if(flag=='district'){
      this.userRegistrationForm.controls['talukaId'].setValue('');
      this.userRegistrationForm.controls['centerId'].setValue('');
      this.userRegistrationForm.controls['schoolId'].setValue('');
      this.userRegistrationForm.controls['standardModels'].setValue('');
    }else if(flag=='taluka'){
      this.userRegistrationForm.controls['centerId'].setValue('');
      this.userRegistrationForm.controls['schoolId'].setValue('');
      this.userRegistrationForm.controls['standardModels'].setValue('');
    }else if(flag=='center'){
      this.userRegistrationForm.controls['schoolId'].setValue('');
      this.userRegistrationForm.controls['standardModels'].setValue('');
    }else if(flag=='school'){
     this.userRegistrationForm.controls['standardModels'].setValue('');
    }
  }

  clearUserForm(formDirective:any){
    formDirective.resetForm();
  }
  registerUser(formDirective:any) {
    if(this.userRegistrationForm.invalid){
        return;
    }
    else{
      let standardModels:any=[],subjectModels:any=[];
    if(this.userRegistrationForm.value.userTypeId==3){
      this.userRegistrationForm.value.standardModels.forEach((ele:any) => {
        standardModels.push( {
        "standardId":ele
        })
      });
      this.userRegistrationForm.value.subjectModels.forEach((ele:any) => {
         subjectModels.push( {
         "subjectId":ele
         })
       });
    }
    let obj=this.userRegistrationForm.value;
    obj.standardModels=this.userRegistrationForm.value.userTypeId==3?standardModels:[];
    obj.subjectModels=this.userRegistrationForm.value.userTypeId==3?subjectModels:[];
      obj.createdBy=this.data?0:0;
      obj.modifiedBy=this.data?0:0;
      obj.createdDate=this.data?new Date():new Date();
      obj.modifiedDate=this.data?new Date():new Date();
      obj.isDeleted=false;
      this.data?obj.id=this.data.id:0;
      obj.userName="";
      obj.password="";
      obj.stateId=1;
      obj.isBlock=false;
      obj.blockDate="2022-12-28T09:42:55.883Z";
      obj.blockBy=0;
      obj.deviceTypeId=0;
      obj.fcmId="";
      obj.profilePhoto="";
      obj.msg="";
      // obj.timestamp="";
    this.apiService.setHttp((this.data? 'put':'post'),(this.data?'zp_chandrapur/user-registration':'zp_chandrapur/user-registration/AddRecord'),false,obj,false, 'baseUrl')
    this.apiService.getHttp().subscribe((res: any) => {
      if (res.statusCode == '200') {
        this.common.snackBar(res.statusMessage,0);
        this.dialogRef.close('Yes');
        formDirective.resetForm();
      }
    },
    (error: any) => {
      this.errors.handelError(error.status);
    })
  }
  }
}
