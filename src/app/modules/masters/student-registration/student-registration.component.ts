import { Component} from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { ExcelPdfDownloadService } from 'src/app/core/services/excel-pdf-download.service';
import { MasterService } from 'src/app/core/services/master.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { RegisterStudentComponent } from './register-student/register-student.component';


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
  dataObj: any;
  fname!: undefined;
  lname!: undefined;
  lang: string | any = 'English';
  // @ViewChild('formDirective')
  // private formDirective!: NgForm;
   tableDataArray = new Array()

  constructor(public dialog: MatDialog,
    private webStorage: WebStorageService,
    private apiService: ApiService,
    private commonMethod: CommonMethodsService,
    private master: MasterService,
    private errorService: ErrorsService,
    private fb: FormBuilder,
    private excelPdf: ExcelPdfDownloadService
  ) { }

  ngOnInit() {
    this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res
      // console.log("lannnnnn", this.lang)
    })
    this.formData();
    this.getTableData();
    this.getTaluka();
  }
  //#region -----------------------------Filter Form Start-----------------------------------
  formData() {
    this.filterFrm = this.fb.group({
      "talukaId": [0],
      "centerId": [0],
      "schoolId": [0],
      "searchText": ['']
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
    this.pageNumber = flag == 'filter' ? 1 : this.pageNumber;
    let tableDatasize!: Number;
    let str = `?pageno=${this.pageNumber}&pagesize=10`;
    let formData = this.filterFrm.value;
    this.apiService.setHttp('GET', 'zp-Chandrapur/Student/GetAll' + str +
      '&TalukaId=' + (formData?.talukaId) + '&CenterId=' + (formData?.centerId)
      + '&SchoolId=' + (formData?.centerId) + '&lan=' + (this.lang) + '&searchText=' + (formData?.searchText), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.tableDataArray = res.responseData.responseData1;
          this.tableDataArray.map((ele: any) => {
            ele.fullName = ele.f_Name + ' ' + ele.m_Name + ' ' + ele.l_Name;
          })
          tableDatasize = res.responseData.responseData2.pageCount;
        } else {
          this.tableDataArray = [];
          tableDatasize = 0;
        }
        // let displayedColumns = ['saralId', 'fullName', 'gender', 'standard', 'parentsMobileNo', 'action'];
        // let displayedheaders = ['Saral ID', 'Name', 'Gender', 'Standard', 'Parents Contact No.', 'Action'];
        
        let displayedColumns;
    this.lang =='Marathi'? displayedColumns=['srNo','saralId','fullName','gender','standard','parentsMobileNo','action']:displayedColumns=[ 'srNo', 'saralId','fullName','gender','standard','parentsMobileNo','action']
    let displayedheaders;
    this.lang =='Marathi'? displayedheaders=['अनुक्रमणिका','सरल आयडी','नाव','लिंग','इयत्ता','पालक संपर्क क्रमांक','कृती']:displayedheaders=[ 'Sr.No.','Saral ID','Name','Gender','Standard','Parent MobileNo','Action']

        
        let tableData = {
          pageNumber: this.pageNumber,
          img: '', blink: '', badge: '', isBlock: '', pagintion: true,
          displayedColumns: displayedColumns, tableData: this.tableDataArray,
          tableSize: tableDatasize,
          tableHeaders: displayedheaders,
          // edit:true,delete:true
        };
        this.apiService.tableData.next(tableData);
      },
      error: ((err: any) => { this.errorService.handelError(err) })
    });
  }
//#endregion -----------------------------Table Logic End----------------------------------------

//#region -----------------------------Add/Update Dialog Box Start---------------------------------
  registerStudent(obj?: any) {
    console.log("obj", obj)
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
//#region -----------------------------Delete Dialog Box Start---------------------------------
  // globalDialogOpen(delObj?: any) {
  //   let dataObj = {
  //     p1: 'Are you want To Delete Student Record ?',
  //     p2: '', cardTitle: 'Delete',
  //     successBtnText: 'Delete',
  //     dialogIcon: '',
  //     cancelBtnText: 'Cancel'
  //   }
  //   const dialogRef = this.dialog.open(GlobalDialogComponent, {
      // width: '320px',
      // data: dataObj,
      // disableClose: true,
      // autoFocus: false,
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     result == 'Yes' ? this.getTableData() : ''
  //     let deleteObj;
  //     deleteObj = {
  //       id: delObj.id,
  //       modifiedBy: 0,
  //       modifiedDate: new Date(),
  //       lan: this.lang
  //     }
  //     this.apiService.setHttp('delete', 'zp-Chandrapur/Student/DeleteStudent?lan=' + this.lang, false, deleteObj, false, 'baseUrl');
  //     this.apiService.getHttp().subscribe({
  //       next: ((res: any) => {
  //         if (res.statusCode == '200') {
  //           this.commonMethod.snackBar(res.statusMessage, 0);
  //           this.getTableData();
  //         }
  //         else {
  //           this.commonMethod.snackBar(res.statusMessage, 1);
  //         }
  //       }),
        // error: (error: any) => {
        //   this.errorService.handelError(error.status);
        // }
  //     })
  //   });
  // }

  globalDialogOpen(delObj?: any) {
    let dialogObj = {
      p1:this.lang== 'Marathi' ? 'तुम्हाला खात्री आहे की तुम्ही निवडलेला विद्यार्थी हटवू इच्छिता?': 'Are You Sure You Want To Delete Selected Student?',
      p2: '',
      cardTitle: this.lang == 'Marathi' ? 'हटवा' : 'Delete',
      successBtnText: this.lang == 'Marathi' ? 'हटवा' : 'Delete',
      dialogIcon: 'assets/images/logout.gif',
      cancelBtnText: this.lang == 'Marathi' ? 'रद्द करा' : 'Cancel',

      // p1: 'Are you want To Delete Student Record ?',
      // p2: '', cardTitle: 'Delete',
      // successBtnText: 'Delete',
      // dialogIcon: '',
      // cancelBtnText: 'Cancel'
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
//#endregion--------------------------Clear Form Logic End---------------------------------- 
}

