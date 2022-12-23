import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
constructor(public translate:TranslateService,
  private common:CommonMethodsService){}

ngOnInit(){
  console.log("localStrorage Data",this.common.getLocalStorageData());
  let data=this.common.getLocalStorageData();
  console.log(JSON.parse(data).responseData);
}
}
