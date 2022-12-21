import { Component} from '@angular/core'
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/core/services/api.service';
import { RegisterUsersComponent } from './register-users/register-users.component';
@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss']
})
export class UserRegistrationComponent {
  tableData:any;
  tableDataArray=new Array();
  totalItem!:number;
  pageNumber:number=1;
  searchControl=new FormControl('');
  constructor(public dialog: MatDialog, 
    private apiService: ApiService,
    public translate:TranslateService) {}

  ngOnInit() {
    this.getAllUserData();
  }
  getAllUserData() {
    let obj=`pageno=${this.pageNumber}&pagesize=10&&textSearch=${this.searchControl.value}`;
    this.apiService.setHttp('get', 'zp_chandrapur/user-registration/GetAll?'+obj, true, false, false, 'baseUrl')
    this.apiService.getHttp().subscribe((res:any)=>{
     if(res.statusCode=='200'){
      this.tableDataArray=res.responseData.responseData1;
      this.totalItem=res.responseData.responseData2.pageCount;
        let displayedColumns = ['userType', 'name', 'mobileNo','action'];
        let displayedheaders = ['User Type', 'Name', 'Mobile No','Action'];
        this.tableData = {
          pageNumber: this.pageNumber,
          img: '', blink: '', badge: '', isBlock: '',
          displayedColumns: displayedColumns, 
          tableData: this.tableDataArray,
          tableSize: this.totalItem,
          tableHeaders: displayedheaders,
          pagination:true,edit:true,delete:true
        };
     }
     this.apiService.tableData.next(this.tableData);
      })
  }

  childCompInfo(obj: any) {
    console.log(obj)
   obj.label=='Edit'? this.registerusers(obj):this.deleteDialog(obj);
  }
//----------------------------------------------------------Add update modal open------------------------------------------------------------
  registerusers(editObj?:any) {
    this.dialog.open(RegisterUsersComponent, {
      width:'700px',
      disableClose: true,
      data:editObj
    });
  }
// ----------------------------------------------------------delete modal-------------------------------------------------------------
deleteDialog(deleteObj:any){
deleteObj
}
clearFilter(){
  this.searchControl.setValue('');
  this.getAllUserData();
}
}
