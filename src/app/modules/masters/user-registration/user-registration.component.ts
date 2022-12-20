import { Component, EventEmitter, Output, ViewChild } from '@angular/core'
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from 'src/app/core/services/api.service'
import { RegisterUsersComponent } from './register-users/register-users.component'

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss'],
})
export class UserRegistrationComponent {
  tableData:any;
  tableDataArray=new Array();
  totalItem!:number;
  pageNumber:number=1;
  searchControl=new FormControl('');
  constructor(public dialog: MatDialog, private apiService: ApiService) {}
  ngOnInit() {
    this.getAllUserData();
  }
  getAllUserData() {
    let obj=`pageno=${this.pageNumber}&pagesize=10`
    this.apiService.setHttp('get', 'zp_chandrapur/user-registration/GetAll?'+obj, true, false, false, 'baseUrl')
    this.apiService.getHttp().subscribe((res:any)=>{
      this.tableDataArray=res.responseData.responseData1;
      this.totalItem=res.responseData.responseData2.pageCount;
    })
    let displayedColumns = ['userType', 'name', 'mobileNo'];
        let displayedheaders = ['User Type', 'Name', 'Mobile No'];
        this.tableData = {
          pageNumber: this.pageNumber,
          img: '', blink: '', badge: '', isBlock: '',
          displayedColumns: displayedColumns, 
          tableData: this.tableDataArray,
          tableSize: this.totalItem,
          tableHeaders: displayedheaders
        };
        this.apiService.tableData.next(this.tableData);
  }
  childCompInfo(obj: any) {}
  registerusers() {
    this.dialog.open(RegisterUsersComponent, {
      width: '700px',
      disableClose: true,
    })
  }
}
