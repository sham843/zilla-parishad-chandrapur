import { Component } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { RegisterSchoolComponent } from './register-school/register-school.component';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';

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
  constructor(
    private webStorage: WebStorageService,
    public dialog: MatDialog,
    private apiService:ApiService,
    private errors:ErrorsService

  ) {}

  ngOnInit() {
    this.webStorage.langNameOnChange.subscribe((res: any) => {
      res == 'Marathi' ? (this.lang = 'm_') : (this.lang = 'en')
    })
    this.getTableData();
  }
  addnew(){
    this.dialog.open(RegisterSchoolComponent, {
      width:'700px',
      disableClose: true

    });
  }
  // zp_chandrapur/School/GetAll?pageno=1&pagesize=10&TalukaId=1&CenterId=1&lan=EN
  getTableData(flag?:string){
    this.pageNumber =   flag == 'filter'? 1 :this.pageNumber;
    let tableDataArray = new Array();
    let tableDatasize!: Number;
    let str = `pageno=${this.pageNumber}&pagesize=10`;
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
        let displayedheaders = ['Sr. No', 'School Name', 'Kendra','Taluka','action'];
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
      error: ((err: any) => { this.errors.handelError(err) })
    });

  }

  childCompInfo(obj: any) {
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
     this.getTableData();
    });
  }

  globalDialogOpen() {
    const dialogRef =this.dialog.open(GlobalDialogComponent, {
      width: '320px',
      data: '',
      disableClose: true,
      autoFocus: false
    })
  }

}
