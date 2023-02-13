import { Component ,Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';

@Component({
  selector: 'app-inspection-report-details',
  templateUrl: './inspection-report-details.component.html',
  styleUrls: ['./inspection-report-details.component.scss']
})
export class InspectionReportDetailsComponent {
  schoolInfoArray:any;
  groupQueArray = new Array();
  groupArray =new Array();
  constructor(public dialogRef: MatDialogRef<InspectionReportDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService:ApiService,
    private commonMethod:CommonMethodsService,
    private errorService:ErrorsService){}

    ngOnInit(){
      this.getVisitReportById();
    }
  getVisitReportById(){
    let id =this.data?this.data:0;
    this.apiService.setHttp('get','VisitorForm/GetById?Id='+id,false,false,false,'baseUrl');
    this.apiService.getHttp().subscribe({
      next:(res: any) => {
        if(res.statusCode == "200"){
         this.schoolInfoArray = res.responseData;
         /* let grpId :any=[...new Set(this.schoolInfoArray.surveyQueAnsDtl.map((x:any)=>x.groupId))];
         grpId.forEach((ele: any) => {
          this.schoolInfoArray.surveyQueAnsDtl.find((elemant: any) => {
            if (ele == elemant.groupId) {
              this.groupQueArray.push({
                'groupId':elemant.groupId,
                'groupName':elemant.groupName,
                'groupMarName':elemant.m_GroupName,
               })
            }
          })
        }) */
        
         console.log(this.schoolInfoArray);
        }
        else{
          this.schoolInfoArray =[];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }},
          error: ((err: any) => { this.errorService.handelError(err) })
      }) 
  }
}
