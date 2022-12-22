import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { RegisterStudentComponent } from './register-student/register-student.component';


@Component({
  selector: 'app-student-registration',
  templateUrl: './student-registration.component.html',
  styleUrls: ['./student-registration.component.scss']
})
export class StudentRegistrationComponent {
  searchContent = new FormControl('');

  // registerStudent(){
  //   this.dialog.open(RegisterStudentComponent, {
  //     width:'700px',
  //     disableClose: true
  //   });
  // }
  pageNumber: number = 1;
  dataObj:any;
  lang:string |any='English';
  constructor(public dialog: MatDialog,
    private apiService:ApiService,
    private errors:ErrorsService
    ) {}

    ngOnInit() {
      this.lang=this.apiService.getLanguageFlag();
      this.getTableData()
    }

    onPagintion(pageNo: number) {
      this.pageNumber = pageNo;
      this.getTableData()
    }
  
    
    getTableData(flag?: string) {
      this.pageNumber = flag == 'filter' ? 1 : this.pageNumber;
      let tableDataArray = new Array();
      let tableDatasize!: Number;
      let str=`?pageno=${this.pageNumber}&pagesize=10&lan=${this.lang}`;
       this.apiService.setHttp('GET', 'zp-Chandrapur/Student/GetAll' + str + '&searchText=' + (this.searchContent.value), false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
  
        next: (res: any) => {
          if (res.statusCode == "200") {
            tableDataArray = res.responseData.responseData1;
            // console.log("tableDataArray",tableDataArray)
            tableDatasize = res.responseData.responseData2.pageCount;
          } else {
            tableDataArray = [];
            tableDatasize = 0;
          }
          let displayedColumns = ['saralId', 'fullName', 'gender', 'standard', 'mobileNo', 'action'];
          let displayedheaders = ['Saral ID', 'Name', 'Gender', 'Standard','Parents Contact No.','Action'];
          let tableData = {
            pageNumber: this.pageNumber,
            img: '', blink: '', badge: '', isBlock: '', pagintion: true,
            displayedColumns: displayedColumns, tableData: tableDataArray,
            tableSize: tableDatasize,
            tableHeaders: displayedheaders,
            // edit:true,delete:true
          };
          this.apiService.tableData.next(tableData);
        },
        error: ((err: any) => { this.errors.handelError(err) })
      });
    }


  registerStudent(obj?:any){
    console.log("obj",obj)
    let dialogRef=this.dialog.open(RegisterStudentComponent, {
      width:'700px',
      data:  this.dataObj,
      disableClose: true
    });
     dialogRef.afterClosed().subscribe((result:any) => {
       result == 'Yes' ? this.getTableData() : '';
     });
  }

  childCompInfo(obj: any) {
    console.log(obj);
    this.dataObj=obj;
    
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.getTableData();
        break;
      case 'Edit' || 'Delete':
         this.registerStudent(obj);
        break;    
    }
  }

  clearFilter(){
    this.searchContent.setValue('');
    this.getTableData();
  }
}

