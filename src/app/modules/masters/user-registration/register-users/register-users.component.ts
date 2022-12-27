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
  userRegistrationForm!:FormGroup;
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
    this.getAllClassGroup();
    console.log(this.data);
  }

  getUserControl() {
    this.userRegistrationForm = this.fb.group({
      userType: [this.data?this.data.userTypeId:'', [Validators.required]],
      userLevel: [this.data?this.data.designationLevelId:''],
      designation: [this.data?this.data.designationId:''],
      district: [this.data?this.data.districtId:'', [Validators.required]],
      taluka: [this.data?this.data.talukaId:'', [Validators.required]],
      kendra: [this.data?this.data.centerId:'', [Validators.required]],
      school: [this.data?this.data.schoolId:''],
      agency: [this.data?this.data.agencyId:''],
      name: [this.data?this.data.name:'', [Validators.required,Validators.pattern(this.validation.fullName)]],
      // contact: [this.data?this.data.contactPerson:''],
      mobile: [this.data?this.data.mobileNo:'', [Validators.required,Validators.pattern(this.validation.mobile_No)]],
      email: [this.data?this.data.emailId:'', [Validators.email,Validators.pattern(this.validation.email)]],
      address: [this.data?this.data.agencyAddress:''],
      class: [''],
      subject: [''],

    })
  }
  //#region----------------------------------------------all dropdown methods start---------------------------------------------------
  getUserType() {
    this.master.getUserType(this.lang).subscribe((res:any)=>{
      this.userTypeArr=res.responseData;
    })
    this.data?this.getUserLevel(this.data.userTypeId):'';
    this.addRemoveValidation();
  }

  getUserLevel(typeId:number) { 
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
  this.data?this.getDesignation(this.data.designationId):'';
}

  getDesignation(levelId:any) {
    this.apiService.setHttp('GET', 'designation/get-designation-levels-userTypes?userTypeId='+levelId+'&flag='+this.lang, false, false, false, 'baseUrl');
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
  } 
  getDistrict() {
    this.master.getAllDistrict(this.lang).subscribe((res: any) => {
      this.districtArr = res.responseData;
      this.userRegistrationForm.controls['district'].setValue(this.districtArr[0].id);
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

  getAllClassGroup() {
    this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllGroupClass?flag_lang='+this.lang, false, false, false, 'baseUrl');
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
     this.data?this.getAllSubject(this.data):'';
  }
  getAllSubject(classId:any) {
    classId
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
if(this.userRegistrationForm.value.userType==3){
  this.userRegistrationForm.get('userLevel')?.setValidators([Validators.required]);
  this.userRegistrationForm.get('userLevel')?.updateValueAndValidity();
  this.userRegistrationForm.get('agency')?.setValidators([Validators.required]);
  this.userRegistrationForm.get('agency')?.updateValueAndValidity();
  this.userRegistrationForm.get('contact')?.setValidators([Validators.required]);
  this.userRegistrationForm.get('contact')?.updateValueAndValidity();
  this.userRegistrationForm.get('address')?.setValidators([Validators.required]);
  this.userRegistrationForm.get('address')?.updateValueAndValidity();
  this.userRegistrationForm.get('designation')?.clearValidators();
  this.userRegistrationForm.get('designation')?.updateValueAndValidity();
  this.userRegistrationForm.get('school')?.clearValidators();
  this.userRegistrationForm.get('school')?.updateValueAndValidity();
}else if(this.userRegistrationForm.value.userType==2){
  this.userRegistrationForm.get('designation')?.setValidators([Validators.required]);
  this.userRegistrationForm.get('designation')?.updateValueAndValidity();
  this.userRegistrationForm.get('school')?.setValidators([Validators.required]);
  this.userRegistrationForm.get('school')?.updateValueAndValidity();
  this.userRegistrationForm.get('userLevel')?.clearValidators();
  this.userRegistrationForm.get('userLevel')?.updateValueAndValidity();
  this.userRegistrationForm.get('agency')?.clearValidators();
  this.userRegistrationForm.get('agency')?.updateValueAndValidity();
  this.userRegistrationForm.get('contact')?.clearValidators();
  this.userRegistrationForm.get('contact')?.updateValueAndValidity();
  this.userRegistrationForm.get('address')?.clearValidators();
  this.userRegistrationForm.get('address')?.updateValueAndValidity();
}else if(this.userRegistrationForm.value.userType==1){
  this.userRegistrationForm.get('userLevel')?.setValidators([Validators.required]);
  this.userRegistrationForm.get('userLevel')?.updateValueAndValidity();
  this.userRegistrationForm.get('agency')?.clearValidators();
  this.userRegistrationForm.get('agency')?.updateValueAndValidity();
  this.userRegistrationForm.get('contact')?.clearValidators();
  this.userRegistrationForm.get('contact')?.updateValueAndValidity();
  this.userRegistrationForm.get('address')?.clearValidators();
  this.userRegistrationForm.get('address')?.updateValueAndValidity();
  this.userRegistrationForm.get('school')?.clearValidators();
  this.userRegistrationForm.get('school')?.updateValueAndValidity();
}
  }
  //#endregion-----------------------------------------add and remove validation end----------------------------------------------------
  //#region--------------------------------------------clear dropdown--------------------------------------------------------------------------
  clearDropdown(flag:any){
    if(flag=='userType'){
      this.userRegistrationForm.controls['userLevel'].setValue(' ');
      this.userRegistrationForm.controls['designation'].setValue(' ');
    }else if(flag=='userLevel'){
      this.userRegistrationForm.controls['designation'].setValue(' ');
    }else if(flag=='district'){
      this.userRegistrationForm.controls['taluka'].setValue(' ');
      this.userRegistrationForm.controls['kendra'].setValue(' ');
      this.userRegistrationForm.controls['school'].setValue(' ');
    }else if(flag=='taluka'){
      this.userRegistrationForm.controls['kendra'].setValue(' ');
      this.userRegistrationForm.controls['school'].setValue(' ');
    }else if(flag=='kendra'){
      this.userRegistrationForm.controls['school'].setValue(' ');
    }else if(flag=='class'){
     this.userRegistrationForm.controls['subject'].setValue(' ');
    }
  }

  clearUserForm(formDirective:any){
    formDirective.resetForm();
  }
  registerUser(formDirective:any) {
    formDirective
  }
}
