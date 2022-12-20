import { Component } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { WebStorageService } from 'src/app/core/services/web-storage.service'
import { RegisterSchoolComponent } from './register-school/register-school.component'



@Component({
  selector: 'app-school-registration',
  templateUrl: './school-registration.component.html',
  styleUrls: ['./school-registration.component.scss'],
})
export class SchoolRegistrationComponent {
  stateArr = new Array()
  districtArr = new Array()
  lang: string = 'en'
  constructor(
    private webStorage: WebStorageService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.webStorage.langNameOnChange.subscribe((res: any) => {
      res == 'Marathi' ? (this.lang = 'm_') : (this.lang = 'en')
    })
  }
  
  addnew(){
    this.dialog.open(RegisterSchoolComponent, {
      width:'700px'
    });
  }
}
