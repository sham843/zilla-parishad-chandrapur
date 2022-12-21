import { Component, ErrorHandler, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { MasterService } from 'src/app/core/services/master.service';
@Component({
  selector: 'app-add-designation',
  templateUrl: './add-designation.component.html',
  styleUrls: ['./add-designation.component.scss']
})
export class AddDesignationComponent {

  lang:string='English';
  editFlag: boolean = false;
  designationForm!:FormGroup;
  desigantionLevel = new Array();
  desigantionType = new Array();
  setDesignationLevel = new Array();
  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective;


  constructor(private fb: FormBuilder, private commonMethod: CommonMethodsService, private apiService: ApiService,
              private errorHandler: ErrorHandler,@Inject(MAT_DIALOG_DATA) public data: any,private webStorage:WebStorageService,
              private master: MasterService){}
  ngOnInit(){
    this.webStorage.langNameOnChange.subscribe((res: any) => {
      res == 'Marathi' ? (this.lang = 'mr-IN') : (this.lang = 'en');
    })
    this.controlForm();
    this.data ? this.editMethod() : this.getDesignationLevel();
  }

  controlForm(){
    this.designationForm = this.fb.group({
      dummyDesigLvlkey:[],
      linkedToDesignationId:[],
      designationLevelId:[],
      designationName:['']
    })
  }

  clearForm(formDirective?: any){
    formDirective?.resetForm();
  }

  //#region------------------------------------------------dropdown api's start-------------------------------------------------------
  getDesignationLevel() {
    console.log( this.editFlag);
    this.master.getDesignationLevel(this.lang).subscribe((res: any) => {
      this.desigantionLevel = res.responseData;
     
      this.editFlag ? (this.designationForm.controls['dummyDesigLvlkey'].setValue(this.data.designationLevelId),this.getDesignationType()) : '';
    })
  }

  getDesignationType() {
    let dummyDesigLvlkey = this.designationForm.value.dummyDesigLvlkey;
    this.apiService.setHttp('GET', 'designation/get-set-designation-types?designationLevelId=' + dummyDesigLvlkey + '&flag=' + this.lang, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.desigantionType = res.responseData;
          // console.log(this.desigantionType,this.data.linkedToDesignationId ,"Type");
          this.editFlag ? (this.designationForm.controls['linkedToDesignationId'].setValue(this.data.linkedToDesignationId),this.setDesignationLvl()) : '';
        }
      }, error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handleError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  setDesignationLvl() {
    let dummyDesigLvlkey = this.designationForm.value.dummyDesigLvlkey;
    this.apiService.setHttp('GET', 'designation/get-set-designation-level?designationLevelId=' + dummyDesigLvlkey + '&flag=' + this.lang, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.setDesignationLevel = res.responseData;
          // console.log(this.desigantionType,this.data.linkedToDesignationId ,"Type");
          this.editFlag ? this.designationForm.controls['designationLevelId'].setValue(this.data.designationLevelId) : '';
        }
      }, error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handleError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }
  //#endregion---------------------------------------------dropdown api's end---------------------------------------------------

  onClickSubmit(formDirective?: any) {
 if (!this.designationForm.valid) {
      return;
  } else {
    // {
  //   "isDeleted": true,
  //   "userId": 0
  // }
    let postObj = {
      id: 0,
      linkedToDesignationId:this.designationForm.value.linkedToDesignationId,
      designationLevelId:this.designationForm.value.designationLevelId,
      designationName:this.designationForm.value.designationName,
      linkedToDesignationName: "",
      designationLevelName: "",
      isDeleted: true,
      userId: 0
    };
    this.apiService.setHttp('POST', 'designation/save-designation-details?flag=' + this.lang, false, postObj, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          formDirective?.resetForm();
          this.controlForm();
          this.commonMethod.snackBar(res.statusMessage, 0)
        } else {
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorHandler.handleError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handleError(error.statusCode) : this.commonMethod.snackBar(error.statusMessage, 1);
      }
    })
  }
}

editMethod(){
  this.editFlag = true;
  this.designationForm.patchValue({
    id: this.data.id,
    // dummyDesigLvlkey:this.importedEditObj.designationLevelId,
    // linkedToDesignationId:this.importedEditObj.linkedToDesignationId,
    // designationLevelId:this.importedEditObj.designationLevelId,
    designationName:this.data.designationName,
    linkedToDesignationName: "",
    designationLevelName: "",
    isDeleted: false,
    userId: 0
  })
 this.getDesignationLevel();
}

  clearFormDependancy(index:any){
    if(index.value == this.designationForm.value.dummyDesigLvlkey){
      this.designationForm.controls['linkedToDesignationId'].setValue(0),
      this.designationForm.controls['designationLevelId'].setValue(0),
      this.designationForm.controls['designationName'].setValue('')
    }else if(this.designationForm.value.linkedToDesignationId){
      this.designationForm.controls['designationLevelId'].setValue(0),
      this.designationForm.controls['designationName'].setValue('')
    }
  }
}
