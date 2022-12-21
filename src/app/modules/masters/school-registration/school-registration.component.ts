import { Component } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { RegisterSchoolComponent } from './register-school/register-school.component';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MasterService } from 'src/app/core/services/master.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';

@Component({
  selector: 'app-school-registration',
  templateUrl: './school-registration.component.html',
  styleUrls: ['./school-registration.component.scss'],
})
export class SchoolRegistrationComponent {
  stateArr = new Array();
  districtArr = new Array();
  lang: string = 'en';
  pageNumber:Number=1;
  districtArray=new Array();
  talukaArray=new Array();
  centerArray=new Array();
  filterForm!:FormGroup;
  getData:any
  constructor(
    private webStorage: WebStorageService,
    public dialog: MatDialog,
    private apiService:ApiService,
    private errorService:ErrorsService,
    private fb:FormBuilder,
    private master:MasterService,
    private commonMethod:CommonMethodsService

  ) {}

  ngOnInit() {
    this.webStorage.langNameOnChange.subscribe((res: any) => {
      res == 'Marathi' ? (this.lang = 'm_') : (this.lang = 'en')
    })
  
    this.getTableData();
    this.getFilterFormData();
    this.getTaluka();
    
  }

  getFilterFormData(){
    this.filterForm=this.fb.group({
      talukaId:'',
      centerId:''
    })
  }
  // zp_chandrapur/School/GetAll?pageno=1&pagesize=10&TalukaId=1&CenterId=1&lan=en
  getTableData(flag?:string){
    this.pageNumber =   flag == 'filter'? 1 :this.pageNumber;
    let tableDataArray = new Array();
    let tableDatasize!: Number;
    let str = `zp_chandrapur/School/GetAll?pageno=${this.pageNumber}&pagesize=10&TalukaId=${this.filterForm?.value.talukaId}&CenterId=${this.filterForm?.value.centerId}&lan=${this.lang}`;
    console.log(str);
    this.apiService.setHttp('GET', 'zp_chandrapur/School/GetAll', false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {      
          tableDataArray = res.responseData.responseData1;
          tableDatasize = res.responseData.responseData2.pageCount;
        } else {
          alert('try one more time')
          tableDataArray = [];
          tableDatasize = 0;
        }
        let displayedColumns = ['srNo', 'schoolName', 'center','taluka','action'];
        let displayedheaders = ['Sr. No.', 'School Name', 'Kendra','Taluka','Action'];
        console.log("Table Data",tableDataArray);
        let tableData = {
          pageNumber: this.pageNumber,
          img: '', blink: '', badge: '', isBlock: '', pagintion:true,
          displayedColumns: displayedColumns, 
          tableData: tableDataArray,
          tableSize: tableDatasize,
          tableHeaders: displayedheaders
        };
        console.log(res.responseData.responseData1,'aaaa');
        this.apiService.tableData.next(tableData);
      },
      error: ((err: any) => { this.errorService.handelError(err) })
    });

  }

  childCompInfo(obj: any) {
    this.getData=obj.districtId;
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.getTableData();
        break;
      case 'Edit' || 'Delete':
        this.addSchoolData(obj);
        break;
      case 'Block':
        this.globalDialogOpen();
        break;
    }
  }
  addSchoolData(obj?: any) {
    const dialogRef = this.dialog.open(RegisterSchoolComponent, {
      width: '700px',
      data: obj,
      disableClose: true,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      
     this.getTableData();
    });
  }

  globalDialogOpen() {
    const dialogRef =this.dialog.open(GlobalDialogComponent, {
      width: '320px',
      data: '',
      disableClose: true,
      autoFocus: false, 
    })
    console.log(dialogRef); 
  }

  getTaluka() {
    this.master.getAllTaluka(this.lang,1).subscribe({
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

 
  getCenter(){
    let formData=this.filterForm.value.talukaId;
    this.master.getAllCenter(this.lang,formData).subscribe({
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
}
