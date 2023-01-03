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
  loginData:any;
  levelId!:number;
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
    private common:CommonMethodsService) {}

  ngOnInit() {
    this.webStorage.setLanguage.subscribe((res:any)=>{
     res=='Marathi'?this.lang='mr-IN':this.lang='en';
    })
  this.loginData=this.webStorage.getLoginData();
  this.levelId=this.loginData.designationLevelId;
  this.getUserForm();
  this.getUserType();
  this.getDistrict();
  }

  getUserForm() {
    this.userRegistrationForm = this.fb.group({
      userTypeId: [this.data?this.data.userTypeId:'', [Validators.required]],
      designationLevelId: [this.data?this.data.designationLevelId:'',[Validators.required]],
      designationId: [this.data?this.data.designationId:'', [Validators.required]],
      districtId: [this.data?this.data.districtId:1, [Validators.required]],
      talukaId: [this.data?this.data.talukaId:'',[Validators.required]],
      centerId: [this.data?this.data.centerId:'', [Validators.required]],
      schoolId: [this.data?this.data.schoolId:'', [Validators.required]],
      agencyId: [this.data?this.data.agencyId:'', [Validators.required]],
      name: [this.data?this.data.name:'', [Validators.required,Validators.pattern(this.validation.fullName)]],
      mobileNo: [this.data?this.data.mobileNo:'', [Validators.required,Validators.pattern(this.validation.mobile_No)]],
      emailId: [this.data?this.data.emailId:'', [Validators.required,Validators.email,Validators.pattern(this.validation.email)]],
      standardModels: [this.data?this.data.standardModels:[],Validators.required],
      subjectModels: [this.data?this.data.subjectModels:[],Validators.required]
    })
    this.data?this.userRegistrationForm.controls['standardModels'].setValue(this.data.standardId? this.data?.standardId.split(',').map(Number):[]):[];
    this.data?this.userRegistrationForm.controls['subjectModels'].setValue(this.data.subjectId? this.data?.subjectId.split(',').map(Number):[]):[];
  }
  //#region----------------------------------------------all dropdown methods start---------------------------------------------------
  getUserType() {  //get user type
    this.master.getUserType(this.lang).subscribe((res:any)=>{
      this.userTypeArr=res.responseData;
    })
    this.data?(this.getUserLevel(this.data.userTypeId),this.addRemoveValidation()):'';
  }

  getUserLevel(typeId:number) {  //get user level   
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
  this.data?this.getDesignation(this.userRegistrationForm.value.designationLevelId):'';
  this.userRegistrationForm.value.userTypeId==3?this.getAllSubject():this.userRegistrationForm.value.userTypeId==4?this.getAgency():'';

}

  getDesignation(levelId:any) {  //get user designation
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

  getDistrict() {   //get district
    this.master.getAllDistrict(this.lang).subscribe((res: any) => {
      this.districtArr = res.responseData;
      this.userRegistrationForm.controls['districtId'].setValue(this.districtArr[0].id);
    })
    this.data?this.getTaluka(this.data.districtId):'';
  }

  getTaluka(distId:number) {   //get taluka
     this.master.getAllTaluka(this.lang,distId).subscribe((res: any) => {
      this.talukaArr = res.responseData;
      this.levelId==3 || this.levelId==4 || this.levelId==5 ?this.userRegistrationForm.controls['talukaId'].setValue(this.loginData.talukaId):'';
      this.levelId==4 || this.levelId==5 ? this.getKendra(this.loginData.talukaId): 
      this.data? this.getKendra(this.data.talukaId):'';
    })
  }

  getKendra(talukaId:number) {  //get kendra
    this.master.getAllCenter(this.lang,talukaId).subscribe((res: any) => {
      this.kendraArr = res.responseData;
      this.levelId==4 || this.levelId==5 ?this.userRegistrationForm.controls['centerId'].setValue(this.loginData.centerId):'';
      (this.levelId==4 || this.levelId==5 && this.userRegistrationForm.value.designationLevelId==5) ? this.getSchoolName(this.loginData.centerId):
      this.data?this.getSchoolName(this.data.centerId):'';
    })
  }

  getSchoolName(centerId:number) {    //get school
    this.master.getSchoolByCenter(this.lang,centerId).subscribe((res:any)=>{ 
      // 2370
      this.schoolArr=res.responseData;
      this.userRegistrationForm.controls['schoolId'].setValue(this.loginData.schoolId)
      this.data?(this.getAllClassGroup(this.userRegistrationForm.value.schoolId),this.getAllSubject()):'';
    })
  }

  getAgency() {    //get agency
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

  getAllClassGroup(schoolId:number) {    //get class group
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

  getAllSubject() {    //get subject 
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
 
  //#region------------------------------------------------clear dropdown method start--------------------------------------------------------------------------
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
    this.designationArr=[];
    this.data?'':this.getUserForm();
  }
//#endregion-----------------------------------------------clear dropdown method end--------------------------------------------------------
 //#region--------------------------------------------------add/update user method start-------------------------------------------------------------------
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
   let obj= {
      "createdBy":this.data?this.data.createdBy:this.webStorage.getUserId(),
      "modifiedBy":this.data?this.data.modifiedBy : this.webStorage.getUserId(),
      "createdDate":this.data?this.data.createdDate:new Date(),
      "modifiedDate":new Date(),
      "isDeleted": false,
      "id":this.data?this.data.id:0,
      "name":this.userRegistrationForm.value.name,
      "userName": this.userRegistrationForm.value.mobileNo,
      "password": "",
      "mobileNo":this.userRegistrationForm.value.mobileNo,
      "stateId":this.userRegistrationForm.value.stateId?this.userRegistrationForm.value.stateId:0,
      "districtId":this.userRegistrationForm.value.districtId?this.userRegistrationForm.value.districtId:0,
      "talukaId":this.userRegistrationForm.value.talukaId?this.userRegistrationForm.value.talukaId:0,
      "centerId":this.userRegistrationForm.value.centerId?this.userRegistrationForm.value.centerId:0,
      "schoolId":this.userRegistrationForm.value.schoolId?this.userRegistrationForm.value.schoolId:0,
      "agencyId":this.userRegistrationForm.value.agencyId?this.userRegistrationForm.value.agencyId:0,
      "emailId":this.userRegistrationForm.value.emailId,
      "userTypeId":this.userRegistrationForm.value.userTypeId?this.userRegistrationForm.value.userTypeId:0,
      "designationLevelId":this.userRegistrationForm.value.designationLevelId?this.userRegistrationForm.value.designationLevelId:0,
      "designationId":this.userRegistrationForm.value.designationId?this.userRegistrationForm.value.designationId:0,
      "isBlock": false,
      "blockDate": "2022-12-29T09:07:47.318Z",
      "blockBy": 0,
      "deviceTypeId": 0,
      "fcmId": "",
      "profilePhoto": "",
      "msg": "",
      "standardModels":this.userRegistrationForm.value.userTypeId==3?standardModels:[] ,
      "subjectModels":this.userRegistrationForm.value.userTypeId==3?subjectModels:[]
    }
    this.apiService.setHttp((this.data? 'put':'post'),(this.data?'zp_chandrapur/user-registration/UpdateRecord':'zp_chandrapur/user-registration/AddRecord'),false,obj,false, 'baseUrl')
    this.apiService.getHttp().subscribe((res: any) => {
      if (res.statusCode == '200') {
        this.common.snackBar(res.statusMessage,0);
        this.dialogRef.close('Yes');
        formDirective.resetForm();
      }
      else{
        this.common.snackBar(res.statusMessage,1);
        this.dialogRef.close('No');
      }
    },
    (error: any) => {
      this.errors.handelError(error.status);
    })
  }
  }
  //#endregion-----------------------------------------------add/update user method end-------------------------------------------------
}
