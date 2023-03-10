import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { RegisterSchoolComponent } from './register-school/register-school.component';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { MasterService } from 'src/app/core/services/master.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ExcelPdfDownloadService } from 'src/app/core/services/excel-pdf-download.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-school-registration',
  templateUrl: './school-registration.component.html',
  styleUrls: ['./school-registration.component.scss'],
})
export class SchoolRegistrationComponent {
  stateArr = new Array();
  districtArr = new Array();
  lang!: string;
  pageNumber: Number = 1;
  districtArray = new Array();
  talukaArray = new Array();
  centerArray = new Array();
  filterForm!: FormGroup;
  tableDataArray = new Array();
  tableDatasize!: number;
  totalPages!: number;
  excelDowobj: any;
  subscription!: Subscription;
  loginData: any;
  levelId!: number;
  highLightRowFlag: boolean = true;
  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective;

  constructor(
    private webStorage: WebStorageService,
    public dialog: MatDialog,
    private apiService: ApiService,
    private errorService: ErrorsService,
    private fb: FormBuilder,
    private master: MasterService,
    private commonMethod: CommonMethodsService,
    private excelPdf: ExcelPdfDownloadService,
    public validator: ValidationService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.loginData = this.webStorage.getLoginData();
    this.levelId = this.loginData.designationLevelId;
    this.getFilterFormData();
    this.levelId == 3 || this.levelId == 4 || this.levelId == 5 ? '' : this.getTableData();
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res == 'Marathi' ? 'mr-IN' : 'en';
      this.setTableData();
    })

    this.getTaluka();
  }
  //#region ---------------------------------------Filter Form Data Starts-----------------------------------------------------------------
  getFilterFormData() {
    this.filterForm = this.fb.group({
      talukaId: [0],
      centerId: [0],
      schoolName: ['']
    })
  }

  getTaluka() {
    this.master.getAllTaluka((this.apiService.translateLang ? this.lang : 'en'), this.apiService.disId).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.talukaArray = res.responseData;
          this.levelId == 3 || this.levelId == 4 || this.levelId == 5 ? (this.filterForm.controls['talukaId'].setValue(this.loginData.talukaId), this.getCenter()) : '';
          this.levelId == 3 ? this.getTableData('filter') : '';
        }
        else {
          this.talukaArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.errorService.handelError(error.status);
      }
    })
  }

  getCenter() {
    let formData = this.filterForm.value.talukaId;
    this.master.getAllCenter(this.apiService.translateLang ? this.lang : 'en', formData).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.centerArray = res.responseData;
          this.levelId == 4 || this.levelId == 5 ? (this.filterForm.controls['centerId'].setValue(this.loginData.centerId), this.getTableData('filter')) : '';
        }
        else {
          this.centerArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.errorService.handelError(error.status);
      }
    })
  }

  clearFilter() {
    this.formGroupDirective.resetForm({
      talukaId: 0,
      centerId: this.levelId == 4 || this.levelId == 5 ? this.filterForm.value.centerId : 0,
      schoolName: ''
    });
    this.pageNumber = 1
    this.levelId == 1 || this.levelId == 2 ? '' : this.filterForm.controls['talukaId'].setValue(this.loginData.talukaId);
    this.getTableData();
  }

  //#endregion-----------------------------------Filter Form Data Ends--------------------------------------------------------------------

  //#region -------------------------------------Fetch Table Data------------------------------------------------------------------------
  getTableData(flag?: string) {
    this.spinner.show();
    let formValue = this.filterForm.value || '';
    flag == 'filter' ? this.pageNumber = 1 : '';
    this.tableDataArray = [];
    let str = flag != 'excel' ? `pageno=${this.pageNumber}&pagesize=10` : `pageno=1&pagesize=${this.totalPages * 10}`;
    this.apiService.setHttp('GET', 'zp_chandrapur/School/GetAll?' + str + '&TalukaId=' + formValue.talukaId + '&CenterId=' + formValue.centerId + '&textSearch=' + formValue.schoolName + '&lan=' + (this.apiService.translateLang ? this.lang : 'en'), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == "200") {
          this.tableDataArray = res.responseData.responseData1;
          this.tableDatasize = res.responseData.responseData2.pageCount;
          this.totalPages = res.responseData.responseData2.totalPages;
          this.tableDataArray.map((ele:any)=>{
          ele['udiseCode']=ele.udiseCode.toString();
          return ele;
            })
        } else {
          this.spinner.hide();
          this.tableDataArray = [];
          this.tableDatasize = 0;
        }
        flag != 'excel' ? this.setTableData() : (this.excelPdf.downloadExcel(this.tableDataArray, this.excelDowobj.pageName, this.excelDowobj.header, this.excelDowobj.column), this.getTableData());
      },
      error: ((err: any) => {
        this.spinner.hide();
        this.errorService.handelError(err)
      })
    });
  }

  setTableData() {
    this.highLightRowFlag = true;
    let displayedColumns = ['srNo', 'udiseCode', 'schoolName', 'center', 'taluka', 'action']
    let displayedheaders = this.lang == 'mr-IN' ? ['?????????????????????????????????', '??????????????????????????? ?????????', '?????????????????? ?????????', '??????????????????', '??????????????????', '????????????'] : ['Sr. No.', 'Udise Code', 'School Name', 'Kendra', 'Taluka', 'Action']
    let tableData = {
      pageNumber: this.pageNumber,
      highlightedrow: true,
      img: '', blink: '', badge: '', isBlock: '', pagination: true,
      displayedColumns: displayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
      tableHeaders: displayedheaders,
      edit: true,
      delete: true,
    };
    this.highLightRowFlag ? tableData.highlightedrow = true : tableData.highlightedrow = false,
      this.apiService.tableData.next(tableData);
  }
  excelDownload() {
    this.getTableData('excel');
    let pageName = this.lang == 'mr-IN' ? '???????????? ??????????????????' : 'School Registration'
    let header = this.lang == 'mr-IN' ?
      ['?????????????????????????????????', '??????????????????????????? ?????????', '?????????????????? ?????????', '??????????????????', '??????????????????', '???????????? ??????????????????', '?????????????????? ??????????????????', '????????????', '??????????????? ????????????', '?????????????????????????????????', '?????????????????? ???????????????', '?????????????????? ???????????????']
    : ['Sr.No.', 'UDICE Code', 'School Name','Taluka', 'Kendra', 'School Category', 'School Type', 'Gender', 'Class From', 'Class To', 'School Location', 'School Address'];
    let column = this.lang == 'mr-IN' && this.apiService.translateLang ?
      ['srNo', 'udiseCode', 'schoolName','taluka', 'center', 'categoryName', 'schoolType', 'gender', 'classFrom', 'classTo', 'schoolLocation', 'schoolAddress'] :
      ['srNo', 'udiseCode', 'schoolName', 'taluka', 'center', 'categoryName', 'schoolType', 'gender', 'classFrom', 'classTo', 'schoolLocation', 'schoolAddress'];
    this.excelDowobj = { 'pageName': pageName, 'header': header, 'column': column }
  }

  childCompInfo(obj?: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.getTableData();
        break;
      case 'Edit':
        this.addSchoolData(obj);
        break;
      case 'Delete':
        this.globalDialogOpen(obj);
        break;
        case 'Row':
          // this.viewNgoDetails(obj);
          break
    }
  }

  addSchoolData(obj?: any) {
    const dialogRef = this.dialog.open(RegisterSchoolComponent, {
      width: '950px',
      data: obj,
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      result == 'post' ? this.getTableData() : '';
      result != 'put'  ? this.getTableData() : '';
      this.highLightRowFlag = false;
      this.setTableData();
    });
  }

  globalDialogOpen(delObj?: any) {
    let dataObj = {
      cardTitle: this.lang == 'mr-IN' ? '??????????????? ?????????' : 'Delete',
      p1: this.lang == 'mr-IN' ? '?????????????????? ???????????????????????? ???????????? ????????????????????? ???????????? ??????????????????????' : 'Do You Want To Delete Selected School Record?',
      p2: '',
      cancelBtnText: this.lang == 'mr-IN' ? '???????????? ?????????' : 'Cancel',
      successBtnText: this.lang == 'mr-IN' ? '???????????????' : 'Delete',
      dialogIcon: 'assets/images/trash.gif'
    }
    const dialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '320px',
      data: dataObj,
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        let deleteObj = {
          id: delObj.id,
          modifiedBy: 0,
          modifiedDate: new Date(),
          lan: this.apiService.translateLang ? this.lang : 'en'
        }
        this.apiService.setHttp('delete', 'zp_chandrapur/School/Delete?lan=' + (this.apiService.translateLang ? this.lang : 'en'), false, deleteObj, false, 'baseUrl');
        this.apiService.getHttp().subscribe({
          next: ((res: any) => {
            if (res.statusCode == '200') {
              this.commonMethod.snackBar(res.statusMessage, 0);
              this.getTableData();
            } else {
              this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
            }
          }), error: (error: any) => {
            this.errorService.handelError(error.status);
          }
        })
      }
      this.highLightRowFlag = false;
      this.setTableData();
    });
  }

  clearDropDrown(status: any) {
    if (status == 'taluka') {
      this.filterForm.controls['centerId'].setValue(0);
      this.filterForm.controls['schoolName'].setValue('');
    } else if (status == 'center') {
      this.filterForm.controls['schoolName'].setValue('');
    }
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
  //#endregion -------------------------------------Fetch Table Data------------------------------------------------------------------------

 /*  viewNgoDetails(obj:any){
    let viewObj = {
      cardTitle: this.lang == 'mr-IN' ? '' : 'NGO Master',
      data:[
        {label:'District',value:obj.district},
        {label:'Taluka',value:obj.taluka},
        {label:'NGo Name',value:obj.agencyName},
        {label:'Registration No.',value:obj.registrationNo},
        {label:'Contact No.',value:obj.contactNo},
        {label:'Contact Person Name',value:obj.contactPersonName},
        {label:'Email Id',value:obj.emailId},
      ],
    }
     this.dialog.open(ViewDialogComponent, {
      width: '850px',
      data: viewObj,
      disableClose: true,
      autoFocus: false
    })
  } */

}

