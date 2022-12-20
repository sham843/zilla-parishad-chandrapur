import { Component } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ApiService } from 'src/app/core/services/api.service'
import { RegisterUsersComponent } from './register-users/register-users.component'

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss'],
})
export class UserRegistrationComponent {
  constructor(public dialog: MatDialog, private apiService: ApiService) {}
  ngOnInit() {
    this.getAllUserData();
  }
  getAllUserData() {
    console.log("table dataa  ")
    this.apiService.setHttp('get', '', true, false, false, '')
    this.apiService.getHttp().subscribe((res:any)=>{
      console.log(res);
    })
  }
  childCompInfo(obj: any) {}
  registerusers() {
    this.dialog.open(RegisterUsersComponent, {
      width: '700px',
      disableClose: true,
    })
  }
}
