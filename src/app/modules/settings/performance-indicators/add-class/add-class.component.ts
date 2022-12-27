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
  selector: 'app-add-class',
  templateUrl: './add-class.component.html',
  styleUrls: ['./add-class.component.scss']
})
export class AddClassComponent implements OnInit{

  addClassForm: FormGroup | any;
  @ViewChild('formDirective')
  private formDirective!: NgForm;
  getAllStandardMasterArray:any;


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddClassComponent>,
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
    this.getAllStandardMaster();
    // this.data.language == 'mr-IN'
  }

  get f() { return this.addClassForm.controls }

  defaultForm() {
    this.addClassForm = this.fb.group({
      assesmentParameter: ['', [Validators.required]],
      m_AssesmentParameter: ['', [Validators.required]],
    });
  }
  
  getAllStandardMaster() {
    this.apiService.setHttp('get', 'zp_chandrapur/PerformanceIndicator/GetAllStandardMaster' , true, false, false, 'baseUrl')
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.getAllStandardMasterArray = res.responseData;
        } else {
          this.getAllStandardMasterArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorSerivce.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      },
      error: ((err: any) => { this.errorSerivce.handelError(err) })
    });
  }

checkedAddStandardArray:any[]=[];

  addStandard(event:any,objData:any){
    let obj:any = {
      "createdBy": this.webStorage.getUserId(),
      "modifiedBy": this.webStorage.getUserId(),
      "createdDate": new Date(),
      "modifiedDate": new Date(),
      "id": objData.id,
      "standard": objData.standard,
      "m_Standard": objData.m_Standard,
      "isDeleted": false,
      "isShow": event.checked == true ? 1 : 0,
      "sname": objData.sname
    }
      this.checkedAddStandardArray.push(obj);
      this.checkedAddStandardArray = Object.values(this.checkedAddStandardArray.reduce((acc,cur)=>Object.assign(acc,{[cur.id]:cur}),{}))
      console.log(this.checkedAddStandardArray)
  }

  onSubmit() {
    if (!this.checkedAddStandardArray?.length) {
      this.commonMethod.snackBar('Please Update at least one Class', 1);
    } else {
      this.spinner.show();
      this.apiService.setHttp('POST', 'zp_chandrapur/PerformanceIndicator/UpdateStandard', false, this.checkedAddStandardArray, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          this.spinner.hide();
          if (res.statusCode == '200') {
            this.commonMethod.snackBar(res.statusMessage, 0);
            this.dialogRef.close('Yes');
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
    this.addClassForm.reset();
    this.formDirective && this.formDirective.resetForm();
  }

}
