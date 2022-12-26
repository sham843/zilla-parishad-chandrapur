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
@Component({
  selector: 'app-school-registration',
  templateUrl: './school-registration.component.html',
  styleUrls: ['./school-registration.component.scss'],
})
export class SchoolRegistrationComponent {
  stateArr = new Array();
  districtArr = new Array();
  lang: string = 'en';
  pageNumber: Number = 1;
  districtArray = new Array();
  talukaArray = new Array();
  centerArray = new Array();
  filterForm!: FormGroup;
  tableDataArray = new Array();
  tableDatasize!: number;
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
    public validator: ValidationService
  ) { }

  ngOnInit() {
    this.getFilterFormData();
    this.getTableData();

    this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res == 'Marathi' ? 'mr-IN' : 'en';
      this.setTableData();
    })
    this.getTaluka();
  }

  //#region ---------------------------------------Filter Form Data-----------------------------------------------------------------
  getFilterFormData() {
    this.filterForm = this.fb.group({
      talukaId: [0],
      centerId: [0],
      schoolName: ['']
    })
  }
  //#endregion-----------------------------------Filter Form Data--------------------------------------------------------------------

  //#region -------------------------------------Fetch Table Data------------------------------------------------------------------------
  getTableData(flag?: string) {
    let formValue = this.filterForm.value || '';
    this.pageNumber = flag == 'filter' ? 1 : this.pageNumber;
    this.tableDataArray = [];
    let str = `pageno=${this.pageNumber}&pagesize=10`;
    this.apiService.setHttp('GET', 'zp_chandrapur/School/GetAll?' + str + '&TalukaId=' + formValue.talukaId + '&CenterId=' + formValue.centerId + '&textSearch=' + formValue.schoolName + '&lan=' + this.lang, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.tableDataArray = res.responseData.responseData1;
          this.tableDatasize = res.responseData.responseData2.pageCount;
        } else {
          this.tableDataArray = [];
          this.tableDatasize = 0;
        }
        this.setTableData();
      },
      error: ((err: any) => { this.errorService.handelError(err) })
    });
  }

  setTableData() {
    let displayedColumns = ['srNo', 'schoolName', 'center', 'taluka', 'action']
    let displayedheaders = this.lang == 'mr-IN' ? ['अनुक्रमणिका', 'शाळेचे नाव', 'केंद्र', 'तालुका', 'कृती'] : ['Sr.No.', 'School Name', 'Kendra', 'Taluka', 'Action']
    let tableData = {
      pageNumber: this.pageNumber,
      img: '', blink: '', badge: '', isBlock: '', pagination: true,
      displayedColumns: displayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
      tableHeaders: displayedheaders
    };
    this.apiService.tableData.next(tableData);
  }

  //#endregion -------------------------------------Fetch Table Data------------------------------------------------------------------------

  //#region ---------------------------------------------------Excel Download------------------------------------------------------------ 
  excelPdfDownload(status?: string) {
    let pageName = 'School Registration';
    let header = ['Sr.No.', 'School Name', 'Kendra', 'Taluka'];
    let column = ['srNo', 'schoolName', 'center', 'taluka'];
    status == 'excel' ? this.excelPdf.downloadExcel(this.tableDataArray, pageName, header, column) : this.excelPdf.downLoadPdf(this.tableDataArray, pageName, header, column)

  }
  //#endregion ---------------------------------------------------Excel Download------------------------------------------------------------ 

  //#region -----------------------------------------------------------Clear Filter Form-----------------------------------------------------
  clearFilter() {
    this.formGroupDirective.reset({
      talukaId: [0],
      centerId: [0],
      schoolName: ['']
    });
    this.getTableData();
  }
  //#endregion----------------------------------------------------------Clear Filter Form----------------------------------------------------

  //#region ---------------------------------------------------Open Dialogue Data-------------------------------------------------------------
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
    }
  }
  //#endregion ---------------------------------------------------Open Dialogue Data-------------------------------------------------------------

  //#region -------------------------------------------------------Add & Edit Dialogue Open-----------------------------------------------------
  addSchoolData(obj?: any) {
    const dialogRef = this.dialog.open(RegisterSchoolComponent, {
      width: '700px',
      data: obj,
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getTableData()
    });
  }
  //#endregion -------------------------------------------------------Add & Edit Dialogue Open-----------------------------------------------------

  //#region -------------------------------------------------Filter Form Dropdowns--------------------------------------------------------
  getTaluka() {
    this.master.getAllTaluka(this.lang, this.apiService.disId).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.talukaArray = res.responseData;
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
    this.master.getAllCenter(this.lang, formData).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.centerArray = res.responseData;
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
  //#endregion-------------------------------------------------Filter Form Dropdowns--------------------------------------------------------

  //#region -------------------------------------------------------Delete Data-----------------------------------------------------------
  globalDialogOpen(delObj?: any) {
    let dataObj = {
      cardTitle: this.lang == 'mr-IN' ? 'हटवा' : 'Delete',
      p1: this.lang == 'mr-IN' ? 'तुम्ही निवडलेले पदनाम रेकॉर्ड हटवू इच्छिता?' : 'Do you want to delete selected designation record?',
      p2: '',
      cancelBtnText: this.lang == 'mr-IN' ? 'रद्द करा' : 'Cancel',
      successBtnText: this.lang == 'mr-IN' ? 'हटवा' : 'Delete',
      dialogIcon: 'assets/images/logout.gif'
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
          lan: this.lang
        }
        this.apiService.setHttp('delete', 'zp_chandrapur/School/Delete?lan=' + this.lang, false, deleteObj, false, 'baseUrl');
        this.apiService.getHttp().subscribe({
          next: ((res: any) => {
            if (res.statusCode == '200') {
              this.getTableData();
            } else {
              this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
            }
          }), error: (error: any) => {
            this.errorService.handelError(error.status);
          }
        })
      }
    });
  }
}
//#endregion -------------------------------------------------------Delete Data-----------------------------------------------------------

