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
  tableDataArray=new Array();
  
  constructor(
    private webStorage: WebStorageService,
    public dialog: MatDialog,
    private apiService: ApiService,
    private errorService: ErrorsService,
    private fb: FormBuilder,
    private master: MasterService,
    private commonMethod: CommonMethodsService,
    private excelPdf: ExcelPdfDownloadService,
    public validator:ValidationService
  ) { }

  ngOnInit() {
    this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res == 'Marathi' ?'mr-IN' : 'en';
    })
    this.getFilterFormData();
    this.getTaluka();
    this.getTableData();
  }

//#region ---------------------------------------Filter Form Data-----------------------------------------------------------------
  getFilterFormData() {
    this.filterForm = this.fb.group({
      talukaId: [0],
      centerId: [0],
      schoolName:['']
    })
  }
  //#endregion-----------------------------------Filter Form Data--------------------------------------------------------------------

  //#region -------------------------------------Fetch Table Data------------------------------------------------------------------------
  getTableData(flag?: string) {
    // zp_chandrapur/School/GetAll?pageno=1&pagesize=10&TalukaId=1&CenterId=1&textSearch=abcddd%20school%20123&lan=en
    let formValue = this.filterForm.value || '' ;
    this.pageNumber = flag == 'filter' ? 1 : this.pageNumber;
    this.tableDataArray = new Array();
    let tableDatasize!: Number;
    let str = `pageno=${this.pageNumber}&pagesize=10`;
    this.apiService.setHttp('GET', 'zp_chandrapur/School/GetAll?' + str + '&TalukaId=' + formValue.talukaId + '&CenterId=' + formValue.centerId +'&textSearch='+formValue.schoolName+'&lan=' + this.lang, false, false, false, 'baseUrl');
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
        let displayedColumns = ['srNo', 'schoolName', 'center', 'taluka','action'] 
        let displayedheaders = this.lang ==  'mr-IN' ? ['अनुक्रमणिका', 'शाळेचे नाव', 'केंद्र', 'तालुका','कृती'] : ['Sr.No.', 'School Name', 'Kendra', 'Taluka','Action']
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
//#endregion -------------------------------------Fetch Table Data------------------------------------------------------------------------

//#region ---------------------------------------------------Excel Download------------------------------------------------------------ 
excelPdfDownload(status?:string) {
  let pageName='School Registration';
  let header=['Sr.No.', 'School Name', 'Kendra', 'Taluka'];
  let column= ['srNo', 'schoolName', 'center', 'taluka'];
  status == 'excel' ? this.excelPdf.downloadExcel(this.tableDataArray,pageName,header,column) : this.excelPdf.downLoadPdf(this.tableDataArray,pageName,header,column)

  }
//#endregion ---------------------------------------------------Excel Download------------------------------------------------------------ 

//#region -----------------------------------------------------------Clear Filter Form-----------------------------------------------------
  clearFilter() {
    this.getFilterFormData()
    this.getTableData();
    this.filterForm.reset();
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
      case 'Block':
        this.globalDialogOpen();
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
//#endregion-------------------------------------------------Filter Form Dropdowns--------------------------------------------------------

  //#region -------------------------------------------------------Delete Data-----------------------------------------------------------
  globalDialogOpen(delObj?: any) {
    let dataObj = {
      cardTitle: this.lang == 'mr-IN' ? 'तुम्ही निवडलेले  शाळेचा रेकॉर्ड हटवू इच्छिता?' : 'Do you want to delete selected school record?',
      cancelBtnText:this.lang == 'mr-IN' ? 'रद्द करा' : 'Cancel',
      successBtnText:this.lang == 'mr-IN'? 'हटवा':'Delete'
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
//#endregion -------------------------------------------------------Delete Data-----------------------------------------------------------

