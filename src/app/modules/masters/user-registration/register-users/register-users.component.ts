import { Component, Inject, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { TranslateService } from '@ngx-translate/core'
import { NgxSpinnerService } from 'ngx-spinner'
import {map, Observable, startWith} from 'rxjs'
import { ApiService } from 'src/app/core/services/api.service'
import { CommonMethodsService } from 'src/app/core/services/common-methods.service'
import { ErrorsService } from 'src/app/core/services/errors.service'
import { FileUploadService } from 'src/app/core/services/file-upload.service'
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
  filterArray: Observable<string[]> |any;
  classArr=new Array();
  subjectArr=new Array();
  addValidation=new Array();
  schoolArr=new Array();
  clearArr=new Array();
  updatedData:any;
  lang:string |any='English';
  loginData:any;
  levelId!:number;
  schoolId!:number;
  profilePhoto: string | any;
  profilePhotoupd!:string;
  filterSchoolArr: Observable<string[]> |any;
  file: any;
  ImgUrl: any;
  selectedFile: any;
  @ViewChild('profileUpload') profileUpload: any;
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
    private common:CommonMethodsService,
    private spinner:NgxSpinnerService,
    private uploadService:FileUploadService) {
    }

  ngOnInit() {
    this.webStorage.setLanguage.subscribe((res:any)=>{
     res=='Marathi' ? this.lang='mr-IN' : this.lang='en';
    })
    this.loginData=this.webStorage.getLoginData();
    this.levelId=this.loginData.designationLevelId;
    this.data.flag!='Add'? (this.getUpdatedData()):'';
    this.getUserForm();
    this.getUserType();
    this.getDistrict();
 
   this.filterSchoolArr = this.userRegistrationForm.get('schoolId').valueChanges.pipe(
    startWith(''),
    map((ele:any) => (ele ? this.filterInDropdown(ele,this.schoolArr) : this.schoolArr.slice())),
  );
  }

  filterInDropdown(value: string,filterArray:any){
    const filterValue = value.toLowerCase();
    return filterArray.filter((value:any) => value.schoolName.toLowerCase().includes(filterValue));
  }
  getUserForm() {
    let obj=this.updatedData;
    this.userRegistrationForm = this.fb.group({
      userTypeId: [obj?obj.userTypeId:'', [Validators.required]],
      designationLevelId: [obj?obj.designationLevelId:'',[Validators.required]],
      designationId: [obj?obj.designationId:'', [Validators.required]],
      districtId: [obj?obj.districtId:1, [Validators.required]],
      talukaId: [obj?obj.talukaId:'',[Validators.required]],
      centerId: [obj?obj.centerId:'', [Validators.required]],
      schoolId: [obj?obj.schoolId:'', [Validators.required]],
      agencyId: [obj?obj.agencyId:'', [Validators.required]],
      name: [obj?obj.name:'', [Validators.required,Validators.pattern(this.validation.fullName),Validators.maxLength(50)]],
      mobileNo: [obj?obj.mobileNo:'', [Validators.required,Validators.pattern(this.validation.mobile_No)]],
      emailId: [obj?obj.emailId:'', [Validators.email,Validators.pattern(this.validation.email)]],
      standardModels: [obj?obj.standardId:[],Validators.required],
      subjectModels: [obj?obj.subjectId:[],Validators.required]
    })
    this.data.flag=='profile'?this.profilePhoto = obj ? obj.profilePhoto : this.profilePhoto = '':'';
    this.profilePhotoupd=this.profilePhoto;
    }

  getUpdatedData(){
    let id=this.data.flag=='profile'?this.loginData.id:this.data.flag=='Update'?this.data.obj.id:'';
    this.apiService.setHttp('get','zp_chandrapur/user-registration/GetById?Id='+id,false,false,false,'baseUrl');
    this.apiService.getHttp().subscribe({
      next:(res: any) => {
        if(res.statusCode == "200"){
         this.updatedData=res.responseData;
         this.updatedData['standardId']=[]; 
         this.updatedData?.standardDetailsForUsers.forEach((ele:any)=>{
          this.updatedData.standardId.push(ele.standardId);
         })
         this.updatedData['subjectId']=[];
         this.updatedData?.subjectDetailsForUser.forEach((ele:any)=>{
          this.updatedData.subjectId.push(ele.subjectId);
         })
         this.getUserForm();
        }
        else{
          this.updatedData=[];
          this.common.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
        }},
          error: ((err: any) => { this.errors.handelError(err) })
      }) 
  }
  //#region----------------------------------------------all dropdown methods start---------------------------------------------------
  getSchoolId(id:number){
    this.schoolId=id;
  }
  getUserType() {  //get user type
    this.master.getUserType(this.apiService.translateLang?this.lang:'en').subscribe((res:any)=>{
      this.userTypeArr=res.responseData;
      this.data.flag!='Add'?(this.getUserLevel(this.userRegistrationForm.value.userTypeId),this.addRemoveValidation()):'';
    })
  }

  getUserLevel(typeId:number) {  //get user level   
  this.apiService.setHttp('GET', 'designation/get-designation-levels-userTypes?userTypeId='+typeId+'&flag='+(this.apiService.translateLang?this.lang:'en'), false, false, false, 'baseUrl');
  this.apiService.getHttp().subscribe({
    next: (res: any) => {
    if(res.statusCode == "200"){
      this.userLevelArr=res.responseData;
      this.data.flag!='Add'?this.getDesignation(this.userRegistrationForm.value.designationLevelId):'';
      this.userRegistrationForm.value.userTypeId==3?this.getAllSubject():this.userRegistrationForm.value.userTypeId==4?this.getAgency():'';
    }
    else{
      this.common.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
    }},
      error: ((err: any) => { this.errors.handelError(err) })
  }) 
}

  getDesignation(levelId:any) {  //get user designation
    this.apiService.setHttp('GET', 'designation/get-set-designation-types?designationLevelId='+levelId+'&flag='+(this.apiService.translateLang?this.lang:'en'), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
      if(res.statusCode == "200"){
        this.designationArr=res.responseData;
      }
      else{
        this.common.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
      }}),
        error: ((err: any) => { this.errors.handelError(err) })
    })
  } 

  getDistrict() {   //get district
    this.master.getAllDistrict(this.apiService.translateLang?this.lang:'en').subscribe((res: any) => {
      this.districtArr = res.responseData;
      this.userRegistrationForm.controls['districtId'].setValue(this.districtArr[0].id);
      this.data.flag!='Add'?this.getTaluka(this.userRegistrationForm.value.districtId):'';
    })
  }

  getTaluka(distId:number) {   //get taluka
     this.master.getAllTaluka(this.apiService.translateLang?this.lang:'en',distId).subscribe((res: any) => {
      this.talukaArr = res.responseData;
      this.levelId==3 || this.levelId==4 || this.levelId==5 ?this.userRegistrationForm.controls['talukaId'].setValue(this.loginData.talukaId):'';
      this.levelId==3 ||this.levelId==4 || this.levelId==5  && this.userRegistrationForm.value.designationLevelId==5? this.getKendra(this.loginData.talukaId): 
      this.levelId==5 && this.userRegistrationForm.value.designationLevelId==4?this.getKendra(this.loginData.talukaId):'';
      this.data.flag!='Add'? this.getKendra(this.userRegistrationForm.value.talukaId):'';
    })
  }

  getKendra(talukaId:number) {  //get kendra
    this.master.getAllCenter(this.apiService.translateLang?this.lang:'en',talukaId).subscribe((res: any) => {
      this.kendraArr = res.responseData;
      this.levelId==4 || this.levelId==5 ?this.userRegistrationForm.controls['centerId'].setValue(this.loginData.centerId):'';
      (this.levelId==4 || this.levelId==5 && this.userRegistrationForm.value.designationLevelId==5) ? this.getSchoolName(this.loginData.centerId):
      this.data.flag!='Add'?this.getSchoolName(this.userRegistrationForm.value.centerId):'';
    })
  }

  getSchoolName(centerId:number) {    //get school
    this.master.getSchoolByCenter((this.apiService.translateLang?this.lang:'en'),centerId).subscribe((res:any)=>{ 
      this.schoolArr=res.responseData;
      this.levelId==4 || this.levelId==5?(this.userRegistrationForm.controls['schoolId'].setValue(this.loginData.schoolId),this.getAllClassGroup(this.userRegistrationForm.value.schoolId),this.getAllSubject()):'';
      (this.data.flag!='Add' && this.userRegistrationForm.value.designationLevelId==5)?(this.userRegistrationForm.controls['schoolId'].setValue(this.updatedData.schoolId),this.getAllClassGroup(this.userRegistrationForm.value.schoolId),this.getAllSubject()):'';
    })
  }

  getAgency() {    //get agency
    this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllAgency?flag_lang='+(this.apiService.translateLang?this.lang:'en'), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
       next: (res: any) => {
        if(res.statusCode == "200"){
          this.agencyArr=res.responseData;
        }
        else{
          this.common.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
        }},
          error: ((err: any) => { this.errors.handelError(err) })
      })
    }

  getAllClassGroup(schoolId:number) {    //get class group
    this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllClassBySchoolId?flag_lang='+(this.apiService.translateLang?this.lang:'en')+'&SchoolId='+schoolId, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
       if(res.statusCode == "200"){
        this.classArr=res.responseData;
       }
       else{
        this.common.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
      }},
         error: ((err: any) => { this.errors.handelError(err) })
     })
  }

  getAllSubject() {    //get subject 
    this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllSubject?flag_lang='+(this.apiService.translateLang?this.lang:'en'), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
       if(res.statusCode == "200"){
        this.subjectArr=res.responseData;
       }
       else{
        this.common.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
      }},
         error: ((err: any) => { this.errors.handelError(err) })
     })
  }

//#endregion-------------------------------------------dropdown methods end----------------------------------------------------------------
 //#region---------------------------------------------add and remove validation start-------------------------------------------------
setValidation(formControl:any){
  this.userRegistrationForm.get(formControl)?.setValidators([Validators.required]);
  this.userRegistrationForm.get(formControl)?.updateValueAndValidity();
}
clearValidation(formControl:any){
  this.userRegistrationForm.get(formControl)?.clearValidators();
  this.userRegistrationForm.get(formControl)?.updateValueAndValidity();
}

 addRemoveValidation(){
  if(this.data.flag=='profile'){
    this.clearArr=['userTypeId','designationLevelId','designationId','districtId','talukaId','centerId','schoolId','agencyId','standardModels','subjectModels'];
    this.clearArr.forEach(ele=>{
      this.clearValidation(ele);
  }) 
  }
  else{
  if(this.userRegistrationForm.value.userTypeId==2){
    if(this.userRegistrationForm.value.designationLevelId==3){
      this.addValidation=['designationId','talukaId'];
      this.clearArr=['centerId','schoolId','standardModels','subjectModels','agencyId'];
    }
    else if(this.userRegistrationForm.value.designationLevelId==4){
      this.addValidation=['designationId','talukaId','centerId'];
      this.clearArr=['schoolId','standardModels','subjectModels','agencyId'];
    }
    else if(this.userRegistrationForm.value.designationLevelId==2){
      this.addValidation=['designationId'];
      this.clearArr=['talukaId','centerId','schoolId','standardModels','subjectModels','agencyId'];
    }
    this.addValidation.forEach(ele=>{
      this.setValidation(ele);
    })
      this.clearArr.forEach(ele=>{
          this.clearValidation(ele);
      }) 
    }else if(this.userRegistrationForm.value.userTypeId==3){
      this.addValidation=['designationId','talukaId','centerId','schoolId','standardModels','subjectModels'];
      this.addValidation.forEach(ele=>{
        this.setValidation(ele);
      })
      this.clearArr=['agencyId'];
      this.clearValidation(this.clearArr);
    }else if(this.userRegistrationForm.value.userTypeId==4){
      if(this.userRegistrationForm.value.designationLevelId==3){
        this.addValidation=['agencyId','talukaId'];
        this.clearArr=['centerId','schoolId','standardModels','subjectModels','designationId'];
      }
      else if(this.userRegistrationForm.value.designationLevelId==4){
        this.addValidation=['agencyId','talukaId','centerId'];
        this.clearArr=['schoolId','standardModels','subjectModels','designationId'];
      }
      else if(this.userRegistrationForm.value.designationLevelId==2){
        this.addValidation=['agencyId'];
        this.clearArr=['talukaId','centerId','schoolId','standardModels','subjectModels','designationId'];
      }
      this.addValidation.forEach(ele=>{
        this.setValidation(ele);
      })
        this.clearArr.forEach(ele=>{
            this.clearValidation(ele);
        }) 
  
  }

 /*  this.addValidation=[];
  this.clearArr=[]; */

 }
  }
  //#endregion-----------------------------------------add and remove validation end----------------------------------------------------
 
  //#region------------------------------------------------clear dropdown method start--------------------------------------------------------------------------
  clearDropdown(flag:any){
    if(flag=='userType'){
      this.userRegistrationForm.controls['designationLevelId'].setValue('');
      this.userRegistrationForm.controls['designationId'].setValue('');
      this.userRegistrationForm.controls['centerId'].setValue('');
      this.userRegistrationForm.controls['schoolId'].setValue('');this.schoolArr=[];
      this.userRegistrationForm.controls['standardModels'].setValue('');this.classArr=[];
      this.userRegistrationForm.controls['subjectModels'].setValue('');this.subjectArr=[];
      this.designationArr=[];this.talukaArr=[];
    }else if(flag=='designationLevel'){
      this.userRegistrationForm.controls['agencyId'].setValue('');
      this.userRegistrationForm.controls['designationId'].setValue('');this.designationArr=[];
      this.userRegistrationForm.controls['talukaId'].setValue('');this.talukaArr=[];
      this.userRegistrationForm.controls['centerId'].setValue('');this.kendraArr=[];
    }else if(flag=='taluka'){
      this.userRegistrationForm.controls['centerId'].setValue('');
      this.userRegistrationForm.controls['schoolId'].setValue('');this.schoolArr=[];
      this.userRegistrationForm.controls['standardModels'].setValue('');this.classArr=[];
    }else if(flag=='center'){
      this.userRegistrationForm.controls['schoolId'].setValue('');
      this.userRegistrationForm.controls['standardModels'].setValue('');this.classArr=[];
    }else if(flag=='school'){
      this.userRegistrationForm.controls['standardModels'].setValue('');
    }
  }

  clearUserForm(formDirective:any){
    if(this.data.flag=='profile'){
      this.userRegistrationForm.controls['name'].setValue('');
      this.userRegistrationForm.controls['mobileNo'].setValue('');
      this.userRegistrationForm.controls['emailId'].setValue('');
    }else{
      formDirective.resetForm();
      this.userLevelArr=[];
      this.designationArr=[];this.talukaArr=[];
      this.data.obj?'':this.getUserForm();
    } 
  }
//#endregion-----------------------------------------------clear dropdown method end--------------------------------------------------------
 //#region-------------------------------------------------profile photo upload methods start-----------------------------------------------
 profilePhotoMethod(event: any) {
  this.spinner.show();
  let documentUrl: any = this.uploadService.uploadDocuments(event, 'profile', "png,jpg,jpeg,JPEG,PNG,JPG");
  documentUrl.subscribe({
    next: (ele: any) => {
      if (ele.statusCode == "200") {
        this.spinner.hide();
        if (event.target.files && event.target.files[0]) {
          if(10485760 > event.target.files[0].size){
           var reader = new FileReader();
           reader.onload = (event: any) => {
             this.profilePhoto = event.target.result;
           }
           reader.readAsDataURL(event.target.files[0]);
          }
         }
        this.profilePhotoupd = ele.responseData;
      }else{
        this.spinner.hide();
      }
    }
  },
    (error: any) => {
      this.spinner.hide();
      this.errors.handelError(error.status);
    })
}
clearProfile(){
 this.profilePhotoupd = '', this.profilePhoto = '';
}
//#endregion---------------------------------------------profile photo upload methods start----------------------------------------------------
//#region--------------------------------------------------add/update user method start-------------------------------------------------------------------
registerUser(formDirective?:any) {
  this.data.flag=='profile'? this.addRemoveValidation():'';
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
   delete obj.standardId;
   delete obj.subjectId
   obj.profilePhoto=this.profilePhotoupd != 'assets/images/user.png' ? this.profilePhotoupd : '';
   obj.createdBy=this.data.obj?this.data.obj.createdBy:this.webStorage.getUserId(),
   obj.modifiedBy=this.data.obj?this.data.obj.modifiedBy : this.webStorage.getUserId(),
   obj.createdDate=this.data.obj?this.data.obj.createdDate:new Date(),
   obj.modifiedBy=this.data.obj?this.data.obj.modifiedBy : this.webStorage.getUserId(),
   obj.modifiedDate=new Date(),
   obj.isDeleted=false,
   obj.id=this.updatedData?this.updatedData.id:0,
   obj.userName=this.userRegistrationForm.value.mobileNo,
   obj.password='',
   obj.stateId=this.apiService.stateId,
   obj.talukaId=this.userRegistrationForm.value.talukaId?this.userRegistrationForm.value.talukaId:0,
   obj.centerId=this.userRegistrationForm.value.centerId?this.userRegistrationForm.value.centerId:0,
   obj.schoolId=this.userRegistrationForm.value.schoolId?this.userRegistrationForm.value.schoolId:0,
   obj.agencyId=this.userRegistrationForm.value.agencyId?this.userRegistrationForm.value.agencyId:0,
   obj.designationId=this.userRegistrationForm.value.designationId?this.userRegistrationForm.value.designationId:0,
   obj.isBlock=false,
   obj.blockDate="2022-12-29T09:07:47.318Z",
   obj.blockBy=0,
   obj.deviceTypeId=0,
   obj.fcmId="",
   obj.msg="",
   obj.standardModels=this.userRegistrationForm.value.userTypeId==3?standardModels:[],
   obj.subjectModels=this.userRegistrationForm.value.userTypeId==3?subjectModels:[],
    this.apiService.setHttp((this.updatedData? 'put':'post'),(this.updatedData?'zp_chandrapur/user-registration/UpdateRecord':'zp_chandrapur/user-registration/AddRecord'),false,obj,false, 'baseUrl')
    this.apiService.getHttp().subscribe((res: any) => {
      if (res.statusCode == '200') {
        this.common.snackBar(res.statusMessage,0);
        this.onClick('Yes');
        formDirective.resetForm();
        this.data.flag=='profile'?this.webStorage.setProfile(this.profilePhotoupd != 'assets/images/user.png' ? this.profilePhotoupd:''):'';
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
  //#endregion-----------------------------------------------add/update user method end-------------------------------------------------
  onClick(flag:any){
    this.dialogRef.close(flag);
  }
}




