import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { RegisterSchoolComponent } from './register-school/register-school.component';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MasterService } from 'src/app/core/services/master.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ExcelPdfDownloadService } from 'src/app/core/services/excel-pdf-download.service';
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
  tableDataArray=new Array();
  constructor(
    private webStorage: WebStorageService,
    public dialog: MatDialog,
    private apiService: ApiService,
    private errorService: ErrorsService,
    private fb: FormBuilder,
    private master: MasterService,
    private commonMethod: CommonMethodsService,
    private excelPdf: ExcelPdfDownloadService
  ) { }

  ngOnInit() {
    this.webStorage.setLanguage.subscribe((res: any) => {
      res == 'Marathi' ? (this.lang = 'm_') : (this.lang = 'en')
    })
    this.getFilterFormData();
    this.getTaluka();
    this.getTableData();
  }

  getFilterFormData() {
    this.filterForm = this.fb.group({
      talukaId: [0],
      centerId: [0]
    })
  }
  getTableData(flag?: string) {
    let formValue = this.filterForm.value || '' ;
    this.pageNumber = flag == 'filter' ? 1 : this.pageNumber;
    this.tableDataArray = new Array();
    let tableDatasize!: Number;
    let str = `pageno=${this.pageNumber}&pagesize=10`;
    this.apiService.setHttp('GET', 'zp_chandrapur/School/GetAll?' + str + '&TalukaId=' + formValue.talukaId + '&CenterId=' + formValue.centerId + '&lan=' + this.lang, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.tableDataArray = res.responseData.responseData1;
          tableDatasize = res.responseData.responseData2.pageCount;
        } else {
          alert('try one more time')
          this.tableDataArray = [];
          tableDatasize = 0;
        }
        let displayedColumns = ['srNo', 'schoolName', 'center', 'taluka'];
        let displayedheaders = ['Sr. No.', 'School Name', 'Kendra', 'Taluka'];
        let tableData = {
          pageNumber: this.pageNumber,
          img: '', blink: '', badge: '', isBlock: '', pagination: true,
          displayedColumns: displayedColumns,
          tableData: this.tableDataArray,
          tableSize: tableDatasize,
          tableHeaders: displayedheaders
        };
        this.apiService.tableData.next(tableData);
      },
      error: ((err: any) => { this.errorService.handelError(err) })
    });
  }

  excelDownload() {
    let pageName='Designation Master';
    let header=['Sr. No.', 'School Name', 'Kendra', 'Taluka', 'Action'];
    let column= ['srNo', 'schoolName', 'center', 'taluka', 'action'];
    this.excelPdf.downloadExcel(this.tableDataArray,pageName,header,column);
  }

  clearFilter() {
    
    this.getFilterFormData()
    this.getTableData();
    this.filterForm.reset();
  }

  childCompInfo(obj?: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.getTableData();
        break;
      case 'Edit':
        this.addSchoolData(obj);
        // this.getTableData();
        break;
      case 'Block':
        this.globalDialogOpen();
        break;
      case 'Delete':
        this.globalDialogOpen(obj);
        // this.getTableData();
    }
  }

  addSchoolData(obj?: any) {
    const dialogRef = this.dialog.open(RegisterSchoolComponent, {
      width: '700px',
      data: obj,
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.getTableData()
    });
    
  }

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
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorService.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  globalDialogOpen(delObj?: any) {
    let dataObj = {
      cancelBtnText: 'Cancel',
      successBtnText: 'Delete'
    }
    const dialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '320px',
      data: dataObj,
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        let deleteObj
        deleteObj = {
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
            }
          }), error: (error: any) => {
            this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorService.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
          }
        })
      } else {
        this.getTableData();
      }
    });
  }
}


// downloadExcel(){
//   this.excelDataArr = [];
//   this.service.setHttp('get', 'whizhack_cms/register/GetAllByPagination?IsDownload=true', false, false, false, 'whizhackService');
//   this.service.getHttp().subscribe({
//     next: ((res: any) => {
//       if (res.statusCode == '200') {
//         this.excelDataArr = res.responseData?.responseData;
//         if(this.excelDataArr.length == 0){
//           this.snack.matSnackBar('No Data Found !!', 1)
//         }else{
//           let keyExcelHeader = ['Register ID', 'Name', 'Email ID', 'Date of Birth', 'Contact Number', 'Course Selected', 'Course', 'Gender', 'Country', 'City', 'Qualification', 'Institute Name', 'Degree', 'Year of Passing', 'Percentage', 'Total Experience', 'Message', 'IP Address', 'Operating System', 'Browser'];;
//           let apiKeys = ['registerId', 'fullName', 'email', 'date_of_Birth', 'mobileNo', 'course_Title', 'pageName', 'gender', 'country', 'city', 'qualification', 'instituteName', 'degree', 'year_of_passing', 'percentage', 'total_Experience', 'message', 'iP_address', 'operating_System', 'browser'];
//           let nameArr = [{
//             'sheet_name': 'Enquiries',
//             'excel_name': 'Enquiries_list'
//           }];
//           this.excelService.generateExcel(keyExcelHeader, apiKeys, this.excelDataArr, nameArr);
//         }       
//       }else{
//         this.excelDataArr = [];
//       }
//     }), error: (error: any) => {
//       this.errorSer.handelError(error.status);
//     }
//   })
// }

