import { Component, ErrorHandler, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { MasterService } from 'src/app/core/services/master.service';
import { DesignationMasterComponent } from '../designation-master.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ValidationService } from 'src/app/core/services/validation.service';
// import { MatSelectChange } from '@angular/material/select';
// import { MatCheckboxChange } from '@angular/material/checkbox';
@Component({
  selector: 'app-add-designation',
  templateUrl: './add-designation.component.html',
  styleUrls: ['./add-designation.component.scss']
})
export class AddDesignationComponent {

  lang: string = 'English';
  editFlag: boolean = false;
  designationForm!: FormGroup;
  desigantionLevel = new Array();
  desigantionType = new Array();
  setDesignationLevel = new Array();
  userLoginDesignationLevelId!: number;
  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective;

  constructor(private fb: FormBuilder, public commonMethod: CommonMethodsService, private apiService: ApiService, public validation: ValidationService,
    private errorHandler: ErrorHandler, @Inject(MAT_DIALOG_DATA) public data: any, private webStorage: WebStorageService,
    private master: MasterService, public dialogRef: MatDialogRef<DesignationMasterComponent>, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    let localVal: any = this.webStorage.getLocalStorageData();
    let loginData = JSON.parse(localVal)
    this.userLoginDesignationLevelId = loginData.responseData.designationLevelId;

    this.webStorage.setLanguage.subscribe((res: any) => {
      res == 'Marathi' ? (this.lang = 'mr-IN') : (this.lang = 'en-US');
    })
    
    this.controlForm();
    this.data ? this.editMethod() : (this.getDesignationLevel());
  }

  get f() { return this.designationForm.controls };

  controlForm(data?: any) {
    this.designationForm = this.fb.group({
      id: [data?.id || 0],
      linkedToDesignationLevelId: ['', Validators.required],
      designationLevelId: ['', Validators.required],
      linkedToDesignationId: ['' , Validators.required],
      linkedToDesignationName: [''],
      designationName: ['', [Validators.required, Validators.pattern(this.validation.addDesignation)]],
      designationLevelName: [''],
      linkedToDesignationLevelName: [''],
      isDeleted: [false],
      userId: [data?.userId || this.userLoginDesignationLevelId],
      createdBy: [data ? data?.createdBy : this.webStorage.getUserId()],
      createdDate: [data ? data?.createdDate : new Date()],
      modifiedBy: [this.webStorage.getUserId()],
      modifiedDate: [new Date()]
    });
  }

  editMethod() {
    this.editFlag = true;
    this.controlForm(this.data)
    this.getDesignationLevel();//
    this.designationForm.controls['designationName'].setValue(this.data?.designationName);
  }

  clearForm(formDirective?: any) {
   if(!this.data){
    formDirective?.resetForm();
    this.editFlag = false;
    this.desigantionType = [];
    this.setDesignationLevel = [];
    this.controlForm();
    if (this.userLoginDesignationLevelId != 1) {
      this.designationForm.controls['linkedToDesignationLevelId'].setValue(this.userLoginDesignationLevelId);
      this.getDesignationType();
    }
   }
    else if(this.data){
      this.dialogRef.close('No');
    }
  }

  //#region------------------------------------------------dropdown api's start-------------------------------------------------------
  getDesignationLevel() {
    this.master.getDesignationLevel(this.apiService.translateLang?this.lang:'en').subscribe((res: any) => {
      this.desigantionLevel = res.responseData;
      if (this.userLoginDesignationLevelId != 1) {
        this.designationForm.controls['linkedToDesignationLevelId'].setValue(this.userLoginDesignationLevelId);
        this.getDesignationType();
      }
      this.editFlag ? (this.designationForm.controls['linkedToDesignationLevelId'].setValue(this.data?.linkedDesignationDetails[0].linkedToDesignationLevelId), this.getDesignationType()) : this.getDesignationType();
    })
  }

  getDesignationType() {
    if (this.designationForm.value.linkedToDesignationLevelId) {
      this.apiService.setHttp('GET', 'designation/get-set-designation-types?designationLevelId=' + this.designationForm.value.linkedToDesignationLevelId + '&flag=' + (this.apiService.translateLang?this.lang:'en'), false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {
          if (res.statusCode == '200') {
            this.desigantionType = res.responseData;
            let  linkedToDesignation :any=[]
            if( this.editFlag){
              linkedToDesignation= this.data?.linkedDesignationDetails.map((ele:any)=> {
              return   +ele.linkedToDesignationId
              } )
            }

            this.editFlag ? (this.designationForm.controls['linkedToDesignationId'].setValue(linkedToDesignation), this.setDesignationLvl()) : '';
          }
        }, error: ((err: any) => { this.errorHandler.handleError(err) })
      })
    }

  }

  setDesignationLvl() {
    this.apiService.setHttp('GET', 'designation/get-set-designation-level?designationLevelId=' + this.designationForm.value.linkedToDesignationLevelId + '&flag=' + (this.apiService.translateLang?this.lang:'en'), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.setDesignationLevel = res.responseData;
          this.editFlag ? this.designationForm.controls['designationLevelId'].setValue(this.data.designationLevelId) : '';
        }
      }, error: ((err: any) => { this.errorHandler.handleError(err) })
    })
  }
  //#endregion---------------------------------------------dropdown api's end---------------------------------------------------

  onClickSubmit() {
    if (!this.designationForm.valid) {
      return;
    } else {
      let formData = this.designationForm.value;
      let desigantionObj = this.desigantionLevel.find((ele: any) => formData.linkedToDesignationLevelId == ele.id);
      let setDesignationObj = this.setDesignationLevel.find((ele: any) => formData.designationLevelId == ele.id);
      formData.designationLevelName = desigantionObj.desingationLevel;
      formData.linkedToDesignationLevelName = setDesignationObj.desingationLevel;
      let linkedDesignationDetailsArray :any =[];
      if(formData.linkedToDesignationId.length){
        this.desigantionType.forEach((ele:any)=>{
          formData.linkedToDesignationId.forEach((res:any)=>{
            if(ele.id == res){
              let obj= {
                "linkedToDesignationId": ele.id,
                "linkedToDesignationLevelId": formData.linkedToDesignationLevelId,
                "linkedToDesignationLevelName": desigantionObj.desingationLevel,
                "linkedToDesignationName": ele.desingationTypes
              }
              linkedDesignationDetailsArray.push(obj);
            }
          })

        });
      }
      formData["linkedDesignationDetails"] =linkedDesignationDetailsArray;
      formData["id"] = this.data  ? this.data.id : 0;
      // delete formData["linkedToDesignationId"]
      let url = this.data ? 'designation/update-designation-details' : 'designation/save-designation-details'
      this.apiService.setHttp(this.data ? 'PUT' : 'POST', url + '?flag=' + (this.apiService.translateLang?this.lang:'en'), false, this.designationForm.value, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          this.spinner.hide();
          if (res.statusCode == '200') {
            let isUpdate = this.data ? true : false;
            this.dialogRef.close(isUpdate);
            this.clearForm();
            if (this.data) {
              this.commonMethod.snackBar(this.lang == 'mr-IN' ? (res.statusMessage = 'माहिती अद्ययावत करण्यात आली') : (res.statusMessage = 'Data updated successfully'), 0)
            } else {
              this.commonMethod.snackBar(this.lang == 'mr-IN' ? (res.statusMessage = 'माहिती यशस्वीरित्या जतन केली') : (res.statusMessage = 'Data Stored Successfully'), 0)
            }
        } else {
            this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorHandler.handleError(res.statusCode) : this.commonMethod.snackBar(this.lang == 'mr-IN' ? (res.statusMessage = 'माहिती आधीच अस्तित्वात आहे') : (res.statusMessage = 'Data already exist'), 1);
          }
        }),
        error: ((err: any) => { this.errorHandler.handleError(err) })
      })
    }
  }

  clearFormDependancy() {
    this.designationForm.controls['linkedToDesignationId'].setValue('');
    this.designationForm.controls['designationLevelId'].setValue('');
  }

  test(event: any) {
event
  }
}
