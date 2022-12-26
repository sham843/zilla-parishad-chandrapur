import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { ExcelPdfDownloadService } from 'src/app/core/services/excel-pdf-download.service';
import { MasterService } from 'src/app/core/services/master.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { RegisterStudentComponent } from './register-student/register-student.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-student-registration',
  templateUrl: './student-registration.component.html',
  styleUrls: ['./student-registration.component.scss']
})
export class StudentRegistrationComponent {
  filterFrm!: FormGroup;
  talukaArray = new Array();
  centerArray = new Array();
  schoolArray = new Array();
  pageNumber: number = 1;
  lang!:string;
  tableDataArray = new Array();
  tableDatasize!:number;

  constructor(public dialog: MatDialog,
    private webStorage: WebStorageService,
    private apiService: ApiService,
    private commonMethod: CommonMethodsService,
    private master: MasterService,
    private errorService: ErrorsService,
    private fb: FormBuilder,
    private excelPdf: ExcelPdfDownloadService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    this.formData();
    this.getTableData();

    this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN'
      this.setTableData();
    })
    this.getTaluka();
  }
  //#region -----------------------------Filter Form Start-----------------------------------
  formData() {
    this.filterFrm = this.fb.group({
      talukaId: [0],
      centerId: [0],
      schoolId: [0],
      searchText: ['']
    })
  }
  //#endregion -----------------------------Filter Form End-----------------------------------

  //#region -----------------------------Pagination Logic Start-----------------------------------
  onPagintion(pageNo: number) {
    this.pageNumber = pageNo;
    this.getTableData()
  }
  //#endregion -----------------------------Pagination Logic End-----------------------------------

  //#region -----------------------------Table Logic Start-----------------------------------
  getTableData(flag?: string) {
    this.spinner.show();
    this.pageNumber = flag == 'filter' ? 1 : this.pageNumber;
    let formData = this.filterFrm.value;
    let str = `?pageno=${this.pageNumber}&pagesize=10`;

    this.apiService.setHttp('GET', 'zp-Chandrapur/Student/GetAll' + str +
      '&TalukaId=' + (formData?.talukaId) + '&CenterId=' + (formData?.centerId)
      + '&SchoolId=' + (formData?.centerId) + '&lan=' + this.lang + '&searchText=' + (formData?.searchText), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == "200") {
          this.tableDataArray = res.responseData.responseData1;
          this.tableDataArray.map((ele: any) => {
            ele.fullName = ele.f_Name + ' ' + ele.m_Name + ' ' + ele.l_Name;
          })
          this.tableDatasize = res.responseData.responseData2.pageCount;
        } else {
          this.spinner.hide();
          this.tableDataArray = [];
          this.tableDatasize = 0;
        }
        this.setTableData();
      },
      error: ((err: any) => {
        this.spinner.hide();
        this.errorService.handelError(err)
      })
    });
  }

  setTableData() {
    let displayedColumns;
    displayedColumns = this.lang == 'Marathi' ? ['srNo', 'saralId', 'fullName', 'gender', 'standard', 'parentsMobileNo', 'action'] : ['srNo', 'saralId', 'fullName', 'gender', 'standard', 'parentsMobileNo', 'action']
    let displayedheaders;
    displayedheaders = this.lang == 'Marathi' ? ['अनुक्रमणिका', 'सरल आयडी', 'नाव', 'लिंग', 'इयत्ता', 'पालक संपर्क क्रमांक', 'कृती'] : ['Sr.No.', 'Saral ID', 'Name', 'Gender', 'Standard', 'Parent MobileNo', 'Action']

    let tableData = {
      pageNumber: this.pageNumber,
      img: '', blink: '', badge: '', isBlock: '', pagination: true,
      displayedColumns: displayedColumns, tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
      tableHeaders: displayedheaders,
      // edit:true,delete:true
    };
    console.log(tableData);
    this.apiService.tableData.next(tableData);
  }
  //#endregion -----------------------------Table Logic End----------------------------------------

  //#region -----------------------------Add/Update Dialog Box Start---------------------------------
  registerStudent(obj?: any) {
    let dialogRef = this.dialog.open(RegisterStudentComponent, {
      width: '700px',
      data: obj,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      result == 'Yes' ? this.getTableData() : '';
    });
  }

  //#endregion -----------------------------Add/Update Dialog Box End---------------------------------
  childCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.getTableData();
        break;
      case 'Edit':
        this.registerStudent(obj);
        break;
      case 'Delete':
        this.globalDialogOpen(obj)
    }
  }

  globalDialogOpen(delObj?: any) {
    let dialogObj = {
      p1: this.lang == 'mr-IN' ? 'तुम्हाला खात्री आहे की तुम्ही निवडलेला विद्यार्थी हटवू इच्छिता?' : 'Are You Sure You Want To Delete Selected Student?',
      p2: '',
      cardTitle: this.lang == 'mr-IN' ? 'हटवा' : 'Delete',
      successBtnText: this.lang == 'mr-IN' ? 'हटवा' : 'Delete',
      dialogIcon: 'assets/images/logout.gif',
      cancelBtnText: this.lang == 'mr-IN' ? 'रद्द करा' : 'Cancel',
    }

    const dialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '320px',
      data: dialogObj,
      disableClose: true,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        this.clearForm();
        let deleteObj = {
          id: delObj.id,
          modifiedBy: 0,
          modifiedDate: new Date(),
          lan: this.lang
        }

        this.apiService.setHttp('delete', 'zp-Chandrapur/Student/DeleteStudent?lan=' + this.lang, false, deleteObj, false, 'baseUrl');
        this.apiService.getHttp().subscribe({
          next: ((res: any) => {
            if (res.statusCode == "200") {
              this.commonMethod.snackBar(res.statusMessage, 0);
              this.getTableData();
            }
            else {
              this.commonMethod.snackBar(res.statusMessage, 1);
            }
          }),
          error: (error: any) => {
            this.errorService.handelError(error.status);
          }
        })
      }
    });
  }
  //#endregion -----------------------------Delete Dialog Box Start---------------------------------
  //#region--------------------------Filter Dropdown Start----------------------------------
  getTaluka() {
    this.master.getAllTaluka(this.lang, 1).subscribe({
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
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorService.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  getCenter() {
    let talukaId = this.filterFrm.value.talukaId;
    this.master.getAllCenter(this.lang, talukaId).subscribe({
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
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorService.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  getSchool() {
    let centerId = this.filterFrm.value.centerId;
    this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllSchoolsByCenter?flag_lang=' + this.lang + '&CenterId=' + centerId, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.schoolArray = res.responseData;
        }
        else {
          this.schoolArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorService.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }
  //#endregion--------------------------Filter Dropdown End----------------------------------

  //#region--------------------------Excel Download Logic Start----------------------------------
  excelDownload() {
    let pageName = 'Student Registration';
    let header = ['Saral Id', 'Full Name', 'Taluka', 'Kendra', 'School Name'];
    let column = ['saralId', 'fullName', 'taluka', 'center', 'schoolName'];
    this.excelPdf.downloadExcel(this.tableDataArray, pageName, header, column);
  }
  //#endregion--------------------------Excel Download Logic End----------------------------------

  //#region--------------------------Clear Form Logic Start---------------------------------- 

  clearForm() {
    this.filterFrm.reset();
    this.filterFrm.setValue({
      talukaId: 0,
      centerId: 0,
      schoolId: 0,
      searchText: ''
    });
    // this.formDirective && this.formDirective.resetForm();
    this.getTableData();
  }

  clearDropdown(flag: any) {
    switch (flag) {
      case 'talukaId':
        this.filterFrm.controls['centerId'].setValue(0);
        this.filterFrm.controls['schoolId'].setValue(0);
        break;
      case 'centerId':
        this.filterFrm.controls['schoolId'].setValue(0);
        break;
    }
  }
  //#endregion--------------------------Clear Form Logic End---------------------------------- 
}

