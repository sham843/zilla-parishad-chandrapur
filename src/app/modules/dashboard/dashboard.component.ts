import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
constructor(public translate:TranslateService,
  private apiService:ApiService){}

ngOnInit(){
  console.log("localStrorage Data",this.apiService.getLocalStorageData());
}
}
