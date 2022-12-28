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
      linkedToDesignationLevelId: [''],
      designationLevelId: ['', Validators.required],
      linkedToDesignationId: [data?.linkedToDesignationId, Validators.required],
      linkedToDesignationName: [''],
      designationName: [data?.designationName || '', Validators.required],
      designationLevelName: [''],
      linkedToDesignationLevelName: [''],
      isDeleted: [false],
      userId: [data?.userId || this.userLoginDesignationLevelId],
      createdBy: [this.editFlag ? data?.createdBy : this.webStorage.getUserId()],
      createdDate: [this.editFlag ? data?.createdDate : new Date()],
    });
  }

  editMethod() {
    this.editFlag = true;
    this.controlForm(this.data)
    this.getDesignationLevel();
  }

  clearForm(formDirective?: any) {
    formDirective?.resetForm();
    if (this.userLoginDesignationLevelId != 1) {
      this.designationForm.controls['linkedToDesignationLevelId'].setValue(this.userLoginDesignationLevelId);
      this.getDesignationType();
    }
    this.data = null;
    this.editFlag = false;
    this.controlForm();
  }

  //#region------------------------------------------------dropdown api's start-------------------------------------------------------
  getDesignationLevel() {
    this.master.getDesignationLevel(this.lang).subscribe((res: any) => {
      this.desigantionLevel = res.responseData;
      if (this.userLoginDesignationLevelId != 1) {
        this.designationForm.controls['linkedToDesignationLevelId'].setValue(this.userLoginDesignationLevelId);
        this.getDesignationType();
      }
      this.editFlag ? (this.designationForm.controls['linkedToDesignationLevelId'].setValue(this.data.linkedToDesignationLevelId), this.getDesignationType()) : this.getDesignationType();
    })
  }

  getDesignationType() {
    if (this.designationForm.value.linkedToDesignationLevelId) {
      this.apiService.setHttp('GET', 'designation/get-set-designation-types?designationLevelId=' + this.designationForm.value.linkedToDesignationLevelId + '&flag=' + this.lang, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {
          if (res.statusCode == '200') {
            this.desigantionType = res.responseData;
            this.editFlag ? (this.designationForm.controls['linkedToDesignationId'].setValue(this.data.linkedToDesignationId), this.setDesignationLvl()) : '';
          }
        }, error: ((err: any) => { this.errorHandler.handleError(err) })
      })
    }

  }

  setDesignationLvl() {
    this.apiService.setHttp('GET', 'designation/get-set-designation-level?designationLevelId=' + this.designationForm.value.linkedToDesignationLevelId + '&flag=' + this.lang, false, false, false, 'baseUrl');
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
      let data1 = this.desigantionLevel.find((ele: any) => formData.linkedToDesignationLevelId == ele.id);
      let data2 = this.desigantionType.find((ele: any) => formData.linkedToDesignationId == ele.id);
      let data3 = this.setDesignationLevel.find((ele: any) => formData.designationLevelId == ele.id);
      formData.linkedToDesignationName = data2.desingationTypes;
      formData.designationLevelName = data3.desingationLevel;
      formData.linkedToDesignationLevelName = data1.desingationLevel;
      let url = this.data ? 'designation/update-designation-details' : 'designation/save-designation-details'
      this.apiService.setHttp(this.data ? 'PUT' : 'POST', url + '?flag=' + this.lang, false, this.designationForm.value, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          this.spinner.hide();
          if (res.statusCode == '200') {
            let isUpdate= this.data ? true : false
            this.dialogRef.close(isUpdate);
            this.clearForm();
            this.commonMethod.snackBar(res.statusMessage, 0)
          } else {
            this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorHandler.handleError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
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
}
