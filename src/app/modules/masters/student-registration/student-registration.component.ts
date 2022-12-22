import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { RegisterStudentComponent } from './register-student/register-student.component';


@Component({
  selector: 'app-student-registration',
  templateUrl: './student-registration.component.html',
  styleUrls: ['./student-registration.component.scss']
})
export class StudentRegistrationComponent {
  searchContent = new FormControl('');
  pageNumber: number = 1;
  dataObj: any;
  fname!:undefined;
  lname!:undefined;
  lang: string | any = 'English';
  constructor(public dialog: MatDialog,
    private apiService: ApiService,
    private errors: ErrorsService,
    private commonService:CommonMethodsService
  ) { }

  ngOnInit() {
    this.lang = this.apiService.getLanguageFlag();
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
    let str = `?pageno=${this.pageNumber}&pagesize=10&lan=${this.lang}`;
    this.apiService.setHttp('GET', 'zp-Chandrapur/Student/GetAll' + str + '&searchText=' + (this.searchContent.value), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({

      next: (res: any) => {
        if (res.statusCode == "200") {
          tableDataArray = res.responseData.responseData1;
          tableDataArray.map((ele:any)=>{
            ele.fullName = ele.f_Name + ' '+ele.m_Name+' '+ele.l_Name;
           })
          tableDatasize = res.responseData.responseData2.pageCount;
        } else {
          tableDataArray = [];
          tableDatasize = 0;
        }
        let displayedColumns = ['saralId', 'fullName', 'gender', 'standard', 'parentsMobileNo', 'action'];
        let displayedheaders = ['Saral ID', 'Name', 'Gender', 'Standard', 'Parents Contact No.', 'Action'];
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



  childCompInfo(obj: any) {
    // console.log(obj);
   

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
    let dataObj = {
      // cancelButton: 'Cancel',
      // okButton: 'Delete'
     p1: 'Are you sure you want to delete this record?',
       p2: '', cardTitle:  'Delete' ,
        successBtnText:  'Delete',
         dialogIcon: '', 
         cancelBtnText: 'Cancel' 
    }
    const dialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '320px',
      data: dataObj,
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {
      result == 'Yes' ? this.getTableData() : ''
      let deleteObj;
      deleteObj = {
        id: delObj.id,
        modifiedBy: 0,
        modifiedDate: new Date(),
        lan: this.lang
      }
      this.apiService.setHttp('delete', 'zp-Chandrapur/Student/DeleteStudent?lan=' + this.lang, false, deleteObj, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          if (res.statusCode == '200') {
            this.commonService.snackBar(res.statusMessage, 0);
            this.getTableData();
          }
          else {
            this.commonService.snackBar(res.statusMessage, 1);
          }
        }),
        error: (error: any) => {
          this.errors.handelError(error.status);
        }
      })
    });
   
  }

  clearFilter() {
    this.searchContent.setValue('');
    this.getTableData();
  }

 


}

