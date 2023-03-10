import { Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-inspection-report-details',
  templateUrl: './inspection-report-details.component.html',
  styleUrls: ['./inspection-report-details.component.scss']
})
export class InspectionReportDetailsComponent {
  schoolInfoArray:any;
  srvId!:number;
  groupQueArray = new Array();
  groupArray =new Array();
  language!:string;
  constructor(
    private apiService:ApiService,
    private commonMethod:CommonMethodsService,
    private errorService:ErrorsService,
    private activatedRoute:ActivatedRoute,
    private webStorage:WebStorageService){}

    ngOnInit(){
      this.srvId =this.activatedRoute.snapshot.params['id'];
      this.webStorage.setLanguage.subscribe((res:any)=>{
        this.language = res;
      })
      this.getVisitReportById();
    }
  getVisitReportById(){
    this.apiService.setHttp('get','VisitorForm/GetById?Id='+(this.srvId?this.srvId:0),false,false,false,'baseUrl');
    this.apiService.getHttp().subscribe({
      next:(res: any) => {
        if(res.statusCode == "200"){
         this.schoolInfoArray = res.responseData;
         console.log("image",this.schoolInfoArray?.surveyPhoto);
         let grData:any =[];
         this.schoolInfoArray.grpdata.forEach((ele:any) => {
          grData=[];
          this.schoolInfoArray.surveyQueAnsDtl.forEach((element:any)=>{
            if(element.groupId==ele.id){
              grData.push(element);
            }
          })
          ele['gropData']=grData;
         });
        }
        else{
          this.schoolInfoArray =[];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }},
          error: ((err: any) => { this.errorService.handelError(err) })
      }) 
  }
}
