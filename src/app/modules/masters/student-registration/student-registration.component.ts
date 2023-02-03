import { Component, ViewChild } from '@angular/core';
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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-student-registration',
  templateUrl: './student-registration.component.html',
  styleUrls: ['./student-registration.component.scss'],
})
export class StudentRegistrationComponent {
  filterFrm!: FormGroup;
  talukaArray = new Array();
  centerArray = new Array();
  schoolArray = new Array();
  pageNumber: number = 1;
  lang!: string;
  tableDataArray = new Array();
  tableDatasize!: number;
  @ViewChild('formDirective')
  excelDowobj!: any;
  totalPages!: number;
  levelId!: number;
  subscription!: Subscription;
  loginData: any;
  disabledTaluka: boolean = false;
  highLightRowFlag: boolean = false;
  constructor(
    public dialog: MatDialog,
    private webStorage: WebStorageService,
    private apiService: ApiService,
    private commonMethod: CommonMethodsService,
    private master: MasterService,
    private errorService: ErrorsService,
    private fb: FormBuilder,
    private excelPdf: ExcelPdfDownloadService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res
        ? res
        : sessionStorage.getItem('language')
        ? sessionStorage.getItem('language')
        : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.setTableData();
    });
    this.loginData = this.webStorage.getLoginData();
    this.levelId = this.loginData.designationLevelId;
    this.formData();
    this.levelId == 1 || this.levelId == 2 ? this.getTableData() : ''; // temp
    this.getTaluka();
  }

  //#region  -----------------------------------------------------Filter form Fun start here ---------------------------------------------------//
  formData() {
    this.filterFrm = this.fb.group({
      talukaId: [0],
      centerId: [0],
      schoolId: [0],
      searchText: [''],
    });
  }

  getTaluka() {
    this.master
      .getAllTaluka(this.apiService.translateLang ? this.lang : 'en', 1)
      .subscribe({
        next: (res: any) => {
          if (res.statusCode == '200') {
            this.talukaArray = res.responseData;
            this.levelId == 3 || this.levelId == 4 || this.levelId == 5
              ? (this.filterFrm.controls['talukaId'].setValue(
                  this.loginData.talukaId
                ),
                (this.disabledTaluka = true),
                this.getCenter())
              : '';
            this.levelId == 3 ? this.getTableData('filter') : '';
          } else {
            this.talukaArray = [];
            this.commonMethod.checkEmptyData(res.statusMessage) == false
              ? this.errorService.handelError(res.statusCode)
              : this.commonMethod.snackBar(res.statusMessage, 1);
          }
        },
        error: (error: any) => {
          this.commonMethod.checkEmptyData(error.statusText) == false
            ? this.errorService.handelError(error.statusCode)
            : this.commonMethod.snackBar(error.statusText, 1);
        },
      });
  }

  getCenter() {
    let talukaId = this.filterFrm.value.talukaId;
    this.master
      .getAllCenter(this.apiService.translateLang ? this.lang : 'en', talukaId)
      .subscribe({
        next: (res: any) => {
          if (res.statusCode == '200') {
            this.centerArray = res.responseData;
            this.levelId == 4 || this.levelId == 5
              ? (this.filterFrm.controls['centerId'].setValue(
                  this.loginData.centerId
                ),
                this.getSchool())
              : '';
            this.levelId == 4 ? this.getTableData('filter') : '';
          } else {
            this.centerArray = [];
            this.commonMethod.checkEmptyData(res.statusMessage) == false
              ? this.errorService.handelError(res.statusCode)
              : this.commonMethod.snackBar(res.statusMessage, 1);
          }
        },
        error: (error: any) => {
          this.commonMethod.checkEmptyData(error.statusText) == false
            ? this.errorService.handelError(error.statusCode)
            : this.commonMethod.snackBar(error.statusText, 1);
        },
      });
  }

  getSchool() {
    let centerId = this.filterFrm.value.centerId;
    this.apiService.setHttp(
      'GET',
      'zp_chandrapur/master/GetAllSchoolsByCenter?flag_lang=' +
        (this.apiService.translateLang ? this.lang : 'en') +
        '&CenterId=' +
        centerId,
      false,
      false,
      false,
      'baseUrl'
    );
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.schoolArray = res.responseData;
          this.levelId == 5
            ? (this.filterFrm.controls['schoolId'].setValue(
                this.loginData.schoolId
              ),
              this.getTableData('filter'))
            : '';
        } else {
          this.schoolArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false
            ? this.errorService.handelError(res.statusCode)
            : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      },
      error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false
          ? this.errorService.handelError(error.statusCode)
          : this.commonMethod.snackBar(error.statusText, 1);
      },
    });
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

  clearForm() {
    this.filterFrm.reset();
    this.formData();
    this.centerArray = [];
    this.schoolArray = [];
    this.getTableData();
    // this.pageNumber = 1
    this.getTaluka();
  }
  //#endregion -----------------------------------------------------Filter form Fun End here ---------------------------------------------------//

  //#region  -----------------------------------------------------Table Fun start here ---------------------------------------------------//
  getTableData(flag?: string) {
    this.spinner.show();
    flag == 'filter' ? (this.pageNumber = 1) : '';
    let formData = this.filterFrm.value;
    let str =
      flag != 'excel'
        ? `?pageno=${this.pageNumber}&pagesize=10`
        : `?pageno=1&pagesize=${this.totalPages * 10}`;
    this.apiService.setHttp(
      'GET',
      'zp-Chandrapur/Student/GetAll' +
        str +
        '&TalukaId=' +
        formData?.talukaId +
        '&CenterId=' +
        formData?.centerId +
        '&SchoolId=' +
        (formData?.schoolId || 0) +
        '&lan=' +
        this.lang +
        '&searchText=' +
        formData?.searchText,
      false,
      false,
      false,
      'baseUrl'
    );
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res.responseData;
          this.tableDatasize = res.responseData1?.pageCount;
          this.totalPages = res.responseData1.totalPages;
        } else {
          this.commonMethod.checkEmptyData(res.statusMessage) == false
            ? this.errorService.handelError(res.statusCode)
            : this.commonMethod.snackBar(res.statusMessage, 1);
          this.spinner.hide();
          this.tableDataArray = [];
          this.tableDatasize = 0;
        }
        flag != 'excel'
          ? this.setTableData()
          : (this.excelPdf.downloadExcel(
              this.tableDataArray,
              this.excelDowobj.pageName,
              this.excelDowobj.header,
              this.excelDowobj.column
            ),
            this.getTableData());
      },
      error: (err: any) => {
        this.spinner.hide();
        this.errorService.handelError(err.status);
      },
    });
  }

  setTableData() {
    this.highLightRowFlag = true;
    let displayedColumns;
    displayedColumns =
      this.lang == 'mr-IN' && this.apiService.translateLang
        ? [
            'saralId',
            'englishFullName',
            'gender',
            'standard',
            'parentsMobileNo',
            'action',
          ]
        : [
            'saralId',
            'englishFullName',
            'gender',
            'standard',
            'parentsMobileNo',
            'action',
          ];
    let displayedheaders;
    displayedheaders =
      this.lang == 'mr-IN'
        ? ['सरल आयडी', 'नाव', 'लिंग', 'इयत्ता', 'पालक संपर्क क्रमांक', 'कृती']
        : [
            'Saral ID',
            'Name',
            'Gender',
            'Standard',
            'Parents Contact No.',
            'Action',
          ];
    let tableData = {
      pageNumber: this.pageNumber,
      highlightedrow: true,
      img: '',
      blink: '',
      badge: '',
      isBlock: '',
      pagination: true,
      displayedColumns: displayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
      tableHeaders: displayedheaders,
      edit: true,
      delete: true,
    };
    this.highLightRowFlag
      ? (tableData.highlightedrow = true)
      : (tableData.highlightedrow = false);
    this.apiService.tableData.next(tableData);
  }

  onPagintion(pageNo: number) {
    this.pageNumber = pageNo;
    this.getTableData();
  }
  //#endregion  -----------------------------------------------------Table Fun start here ---------------------------------------------------//
  registerStudent(obj?: any) {
    let dialogRef = this.dialog.open(RegisterStudentComponent, {
      width: '850px',
      data: obj,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      result == 'Yes' ? this.getTableData() : '';
      this.highLightRowFlag = false;
      this.setTableData();
    });
  }

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
        this.globalDialogOpen(obj);
    }
  }

  globalDialogOpen(delObj?: any) {
    let dialogObj = {
      p1:
        this.lang == 'mr-IN'
          ? 'तुम्ही निवडलेले विद्यार्थी रेकॉर्ड हटवू इच्छिता?'
          : 'Do You Want To Delete Selected Student Record?',
      p2: '',
      cardTitle: this.lang == 'mr-IN' ? 'हटवा' : 'Delete',
      successBtnText: this.lang == 'mr-IN' ? 'हटवा' : 'Delete',
      dialogIcon: 'assets/images/trash.gif',
      cancelBtnText: this.lang == 'mr-IN' ? 'रद्द करा' : 'Cancel',
    };
    const dialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '320px',
      data: dialogObj,
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'Yes') {
        this.clearForm();
        let deleteObj = {
          id: delObj.id,
          modifiedBy: 0,
          modifiedDate: new Date(),
          lan: this.lang,
        };
        this.apiService.setHttp(
          'delete',
          'zp-Chandrapur/Student/DeleteStudent?lan=' + this.lang,
          false,
          deleteObj,
          false,
          'baseUrl'
        );
        this.apiService.getHttp().subscribe({
          next: (res: any) => {
            if (res.statusCode == '200') {
              this.commonMethod.snackBar(res.statusMessage, 0);
              this.getTableData();
            } else {
              this.commonMethod.snackBar(res.statusMessage, 1);
            }
          },
          error: (error: any) => {
            this.errorService.handelError(error.status);
          },
        });
      }
      this.highLightRowFlag = false;
      this.setTableData();
    });
  }

  excelDownload() {
    this.getTableData('excel');
    let pageName;
    this.lang == 'mr-IN'
      ? (pageName = 'विद्यार्थी नोंदणी')
      : (pageName = 'Student Registration');
    let header: any;
    this.lang == 'mr-IN'
      ? (header = ['सरल आयडी', 'नाव', 'लिंग', 'इयत्ता', 'पालक संपर्क क्रमांक','शाळेचे नाव', 'कास्टचे नाव', 'पालकांचे मोबाईल क्रमांक', 'जिल्हा', 'तालुका'])
      : (header = [
          'Saral ID',
          'Name',
          'Gender',
          'Standard',
          'Parent Contact No.',
          'School Name','Cast Name','Parents Mobile No','District','Taluka','Center'
        ]);
    let column;
    column =
      this.lang == 'mr-IN' && this.apiService.translateLang
        ? [
            'saralId',
            'englishFullName',
            'gender',
            'standard',
            'parentsMobileNo',
            'schoolName','castName','parentsMobileNo','m_District','m_Taluka','center'
          ]
        : [
            'saralId',
            'englishFullName',
            'gender',
            'standard',
            'parentsMobileNo',
            'schoolName','castName','parentsMobileNo','district','taluka','center'
          ];
    this.excelDowobj = { pageName: pageName, header: header, column: column };
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
