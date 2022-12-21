import { Component, Inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { TranslateService } from '@ngx-translate/core'
import { ApiService } from 'src/app/core/services/api.service'
import { MasterService } from 'src/app/core/services/master.service'
import { ValidationService } from 'src/app/core/services/validation.service'
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
  lang:string |any='English';
  get f(){return this.userRegistrationForm.controls}
  constructor(
    private fb: FormBuilder,
    public validation: ValidationService,
    private master: MasterService,
    public translate:TranslateService,
    public dialogRef: MatDialogRef<RegisterUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService:ApiService
  ) {}

  ngOnInit() {
   this.lang=this.apiService.getLanguageFlag();
    this.getUserControl();
    this.getUserType();
    this.getDistrict();
  }

  getUserControl() {
    this.userRegistrationForm = this.fb.group({
      userType: [this.data?this.data.userTypeId:'', Validators.required],
      userLevel: [''],
      designation: [''],
      district: ['', Validators.required],
      taluka: ['', Validators.required],
      kendra: [this.data?this.data.center:'', Validators.required],
      school: [''],
      agency: [''],
      name: [this.data?this.data.name:'', [Validators.required,Validators.pattern(this.validation.fullName)]],
      contact: [''],
      mobile: [this.data?this.data.mobileNo:'', [Validators.required,Validators.pattern(this.validation.mobile_No)]],
      email: ['', Validators.required,Validators.email,Validators.pattern(this.validation.email)],
      address: ['']
    })
  }
  //#region----------------------------------------------all dropdown methods start---------------------------------------------------
  getUserType() {
    this.master.getUserType(this.lang).subscribe((res:any)=>{
      this.userTypeArr=res.responseData;
    })
    this.addRemoveValidation();
  }
  getUserLevel(typeId:number) { 
  this.apiService.setHttp('GET', 'designation/get-designation-levels-userTypes?userTypeId='+typeId+'&flag='+this.lang, false, false, false, 'baseUrl');
  this.apiService.getHttp().subscribe((res:any)=>{
    if(res.statusCode == "200"){
      this.userLevelArr=res.responseData;
      console.log(this.userLevelArr);
    }
  })
  }
  getDesignation(levelId:any) {
    levelId
   /*  this.master.getDesignationType(this.lang,levelId).subscribe((res:any)=>{
      this.designationArr=res;
    })*/
  } 
  getDistrict() {
    this.master.getAllDistrict(this.lang).subscribe((res: any) => {
      this.districtArr = res.responseData;
    })
  }
  getTaluka(distId:number) {
     this.master.getAllTaluka(this.lang,distId).subscribe((res: any) => {
      this.talukaArr = res.responseData;
    })
  }
  getKendra(talukaId:number) {
    this.master.getAllCenter(this.lang,talukaId).subscribe((res: any) => {
      this.kendraArr = res.responseData;
    })
  }
  getSchoolName(centerId:number) {
    this.master.getSchoolByCenter(this.lang,centerId).subscribe((res:any)=>{
      this.schoolArr=res.responseData;
    })
  }
  getAgency() {
    this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllAgency?flag_lang='+this.lang, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe((res:any)=>{
      if(res.statusCode == "200"){
        this.agencyArr=res.responseData;
        console.log(this.agencyArr)
      }
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
  //#endregion-----------------------------------------add and remove validation end
  registerUser() {}
}
