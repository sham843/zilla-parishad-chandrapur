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
      res == 'Marathi' ? (this.lang = 'mr-IN') : (this.lang = 'en');
    })
    this.controlForm();
    this.data ? this.editMethod() : (this.getDesignationLevel(), this.getDesignationType(), this.setDesignationLvl());
  }


  get f() { return this.designationForm.controls };

  controlForm() {
    this.designationForm = this.fb.group({
      id: [this.data ? this.data.id : ''],
      dummyDesigLvlkey: [!this.data ?  this.userLoginDesignationLevelId:'', Validators.required],
      linkedToDesignationId: ['', Validators.required],
      designationLevelId: ['', Validators.required],
      designationName: [this.data ? this.data.designationName : '', Validators.required]
    })
  }

  editMethod() {
    this.editFlag = true;
    this.getDesignationLevel()
  }

  clearForm(formDirective?: any) {
    formDirective?.resetForm();
  }

  //#region------------------------------------------------dropdown api's start-------------------------------------------------------
  getDesignationLevel() {
    this.master.getDesignationLevel(this.lang).subscribe((res: any) => {
      this.desigantionLevel = res.responseData;
      this.editFlag ?( this.designationForm.controls['dummyDesigLvlkey'].setValue(this.data.linkedToDesignationLevelId) ,this.getDesignationType() ): '';
    })
  }

  getDesignationType() {

    this.apiService.setHttp('GET', 'designation/get-set-designation-types?designationLevelId=' + this.userLoginDesignationLevelId + '&flag=' + this.lang, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.desigantionType = res.responseData;
          this.editFlag ? (this.designationForm.controls['linkedToDesignationId'].setValue(this.data.linkedToDesignationId), this.setDesignationLvl()) : '';
        }
      }, error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handleError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  setDesignationLvl() {
    this.apiService.setHttp('GET', 'designation/get-set-designation-level?designationLevelId=' + this.userLoginDesignationLevelId + '&flag=' + this.lang, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.setDesignationLevel = res.responseData;
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
    } else if (!this.editFlag) {
      this.spinner.show();
      let obj = {
        createdBy: this.webStorage.getUserId(),
        modifiedBy: this.webStorage.getUserId(),
        createdDate: new Date(),
        modifiedDate: new Date()
      }
      let postObj = {
        // id: 0,
        srNo: 0,
        linkedToDesignationId: this.designationForm.value.linkedToDesignationId,
        designationLevelId: this.designationForm.value.designationLevelId,
        designationName: this.designationForm.value.designationName,
        linkedToDesignationLevelName: '',
        linkedToDesignationName: '',
        designationLevelName: '',
        isDeleted: true,
        userId: this.webStorage.getUserId(),
      };
      let finalData = { ...obj, ...postObj };
      this.apiService.setHttp('POST', 'designation/save-designation-details?flag=' + this.lang, false, finalData, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          this.spinner.hide();
          if (res.statusCode == '200') {
            formDirective?.resetForm();
            this.controlForm();
            this.dialogRef.close();
            this.commonMethod.snackBar(res.statusMessage, 0)
          } else {
            this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorHandler.handleError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
          }
        }),
        error: (error: any) => {
          this.spinner.hide();
          this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handleError(error.statusCode) : this.commonMethod.snackBar(error.statusMessage, 1);
        }
      })
    } else if (this.editFlag) {
      this.spinner.show();
      let obj = {
        createdBy: this.data.createdBy,
        modifiedBy: this.webStorage.getUserId(),
        createdDate: this.data.createdDate,
        modifiedDate: new Date()
      }
      let putObj = {
        id: this.data.id,
        linkedToDesignationLevelId: this.designationForm.value.dummyDesigLvlkey,
        linkedToDesignationId: this.designationForm.value.linkedToDesignationId,
        designationLevelId: this.designationForm.value.designationLevelId,
        designationName: this.designationForm.value.designationName,
        linkedToDesignationLevelName: '',
        linkedToDesignationName: '',
        designationLevelName: '',
        isDeleted: false,
        userId: this.webStorage.getUserId(),
      };
      let finalData = { ...obj, ...putObj }
      this.apiService.setHttp('PUT', 'designation/update-designation-details?flag=' + this.lang, false, finalData, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          this.spinner.hide();
          if (res.statusCode == '200') {
            this.editFlag = false;
            formDirective?.resetForm();
            this.controlForm();
            this.dialogRef.close();
            this.commonMethod.snackBar(res.statusMessage, 0)
          } else {
            this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorHandler.handleError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
          }
        }),
        error: (error: any) => {
          this.spinner.hide();
          this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handleError(error.statusCode) : this.commonMethod.snackBar(error.statusMessage, 1);
        }
      })
    }
  }

  clearFormDependancy() {
    this.designationForm.controls['linkedToDesignationId'].setValue(''),
      this.designationForm.controls['designationLevelId'].setValue(''),
      this.designationForm.controls['designationName'].setValue('')
  }
}
