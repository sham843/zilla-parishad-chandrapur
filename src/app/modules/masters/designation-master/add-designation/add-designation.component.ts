import { Component, ErrorHandler, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';

@Component({
  selector: 'app-add-designation',
  templateUrl: './add-designation.component.html',
  styleUrls: ['./add-designation.component.scss']
})
export class AddDesignationComponent {

  designationForm!:FormGroup;
  desigantionLevel = new Array();
  desigantionType = new Array();
  setDesignationLevel = new Array();
  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective;


  constructor(private fb: FormBuilder, private commonMethod: CommonMethodsService, private apiService: ApiService,
              private errorHandler: ErrorHandler){}

  ngOnInit(){
    this.controlForm();
    this.getDesignationLevel();
  }

  // {
  //   "id": 0,
  //   "designationLevelId": 0,<<<<<<<<<<------------
  //   "linkedToDesignationId": 0,
  //   "designationName": "string",
  //   "linkedToDesignationName": "string",
  //   "designationLevelName": "string",<<<<<<<<<-----------
  //   "isDeleted": true,
  //   "userId": 0
  // }
  controlForm(){
    this.designationForm = this.fb.group({
      dummyDesigLvlkey:[],
      linkedToDesignationId:[],
      designationLevelId:[],
      designationName:[]
    })
  }

  clearForm(formDirective?: any){
    formDirective?.resetForm();
  }

  //#region------------------------------------------------dropdown api's start-------------------------------------------------------
  getDesignationLevel() {
    this.apiService.setHttp('GET', 'designation/get-designation-level?flag=en-US', false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.desigantionLevel = res.responseData;
        }
      }, error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handleError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  getDesignationType() {
    let dummyDesigLvlkey = this.designationForm.value.dummyDesigLvlkey;
    this.apiService.setHttp('GET', 'designation/get-set-designation-types?designationLevelId=' + dummyDesigLvlkey + '&flag=en-US', false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.desigantionType = res.responseData;
        }
      }, error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handleError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  setDesignationLvl() {
    let dummyDesigLvlkey = this.designationForm.value.dummyDesigLvlkey;
    this.apiService.setHttp('GET', 'designation/get-set-designation-level?designationLevelId=' + dummyDesigLvlkey + '&flag=en-US', false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.setDesignationLevel = res.responseData;
          console.log(this.setDesignationLevel);
        }
      }, error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handleError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }
  //#endregion---------------------------------------------dropdown api's end---------------------------------------------------

  onClickSubmit(formDirective?: any){

  }

  clearFormDependancy(index:any){
    if(index == this.designationForm.value.dummyDesigLvlkey){
      this.designationForm.controls['linkedToDesignationId'].setValue(0),
      this.designationForm.controls['designationLevelId'].setValue(0)
    }else if(index == this.designationForm.value.linkedToDesignationId){
      this.designationForm.controls['designationLevelId'].setValue(0)
    }
  }
}
