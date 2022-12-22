import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
constructor(public translate:TranslateService){}

ngOnInit(){
  // console.log("localStrorage Data",this.apiService.getLocalStorageData());
}
}
