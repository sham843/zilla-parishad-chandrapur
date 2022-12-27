import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-add-level',
  templateUrl: './add-level.component.html',
  styleUrls: ['./add-level.component.scss']
})
export class AddLevelComponent implements OnInit {

  addLevelForm: FormGroup | any;
  @ViewChild('formDirective')
  private formDirective!: NgForm;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddLevelComponent>,
    public valiService: ValidationService,
    private apiService: ApiService,
    private errorSerivce: ErrorsService,
    private spinner: NgxSpinnerService,
    private webStorage: WebStorageService,
    private commonMethod: CommonMethodsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.defaultForm();
    // this.data.language == 'mr-IN'
  }

  get f() { return this.addLevelForm.controls }

  defaultForm() {
    this.addLevelForm = this.fb.group({
      assesmentParameter: ['', [Validators.required]],
      m_AssesmentParameter: ['', [Validators.required]],
    });
  }

  onSubmit() {
    let formData = this.addLevelForm.value;
    if (this.addLevelForm.invalid) {
      return;
    } else {
      let obj = {
        "createdBy": this.webStorage.getUserId(),
        "modifiedBy": this.webStorage.getUserId(),
        "createdDate": new Date(),
        "modifiedDate": new Date(),
        "id": 0,
        "assesmentParameter": formData.assesmentParameter,
        "m_AssesmentParameter": formData.m_AssesmentParameter,
        "subjectId": this.data.subjectId,
        "isDeleted": false
      }
      this.spinner.show();
      // let formType: string = !this.editFlag ? 'POST' : 'PUT';
      this.apiService.setHttp('POST', 'zp_chandrapur/PerformanceIndicator/AddLanguageLevel', false, obj, false, 'bidderUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          this.spinner.hide();
          if (res.statusCode == '200') {
            this.commonMethod.snackBar(res.statusMessage, 0);
            this.dialogRef.close('Yes');
            // this.clearForm();
          } else {
            this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorSerivce.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
          }
        }),
        error: (error: any) => {
          this.spinner.hide();
          this.commonMethod.checkEmptyData(error.statusMessage) == false ? this.errorSerivce.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusMessage, 1);
        }
      })
    }
  }

  clearForm(){
    this.addLevelForm.reset();
    this.formDirective && this.formDirective.resetForm();
  }

}
