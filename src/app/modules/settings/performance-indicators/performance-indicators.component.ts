import { Component, OnInit } from '@angular/core';
import { ViewChild} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { MasterService } from 'src/app/core/services/master.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { MatSort} from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource} from '@angular/material/table';
import { AddClassComponent } from './add-class/add-class.component';
import { AddLevelComponent } from './add-level/add-level.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-performance-indicators',
  templateUrl: './performance-indicators.component.html',
  styleUrls: ['./performance-indicators.component.scss']
})
export class PerformanceIndicatorsComponent implements OnInit{


  @ViewChild(MatSort) sort!: MatSort;
  // displayedColumns: string[] = ['srno','assesmentParameter', 'first', 'second', 'third','fourth','fifth'];
  displayedColumns!: string[];
  dataSource: any;
  filterForm: FormGroup | any;
  language:any;
  getAllSubjectArray:any;
  performanceIndicatorArray:any;
  filterEnglishLag = new FormControl(1);

  constructor(
    private apiService: ApiService,
    private errors: ErrorsService,
    private masterService: MasterService,
    private fb: FormBuilder,
    private commonMethod: CommonMethodsService,
    private webStorage: WebStorageService,
    private errorService: ErrorsService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog
  ) { }


  ngOnInit(): void {
    this.masterService, this.fb
    this.getAllPerformanceIndicatorData();
    this.getAllSubject();
    this.webStorage.setLanguage.subscribe((res: any) => {
      res == 'Marathi' ? this.language = 'mr-IN' : this.language = 'en-IN';
      // this.setTableData(); this.getUserTypeData(this.language);
    })

  }

  getAllSubject() {
    this.apiService.setHttp('get', 'zp_chandrapur/master/GetAllSubject' , true, false, false, 'baseUrl')
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.getAllSubjectArray = res.responseData;
        } else {
          this.getAllSubjectArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getAllPerformanceIndicatorData() {
    // let formValue = this.filterForm.value;
    let obj = `${this.filterEnglishLag.value}&UserId=${this.webStorage.getUserId()}`;
    this.apiService.setHttp('get', 'zp_chandrapur/PerformanceIndicator/GetAll?SubjectId=' + obj, true, false, false, 'baseUrl')
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.performanceIndicatorArray = res.responseData;
          this.displayedColumns= Object.keys(this.performanceIndicatorArray[0]);
          console.log(this.displayedColumns )
          this.dataSource = new MatTableDataSource(res.responseData);
          this.dataSource.sort = this.sort;
        } else {
          this.dataSource = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      //  this.setTableData();
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  onSubmit() {
    // let formData = this.addLevelForm.value;
    if (1==1) {
      return;
    } else {
      let obj:any = {
        "subjectId": this.filterEnglishLag.value,
        "createdBy": this.webStorage.getUserId(),
        "createdDate": new Date(),
        "assesment": [
          {
            "standardId": 0,
            "assesmentPerformanceId": 0,
            "flag": 0
          }
        ]
      }
      this.spinner.show();
      // let formType: string = !this.editFlag ? 'POST' : 'PUT';
      this.apiService.setHttp('POST', 'zp_chandrapur/PerformanceIndicator/AddPerformancesubject', false, obj, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          this.spinner.hide();
          if (res.statusCode == '200') {
            this.commonMethod.snackBar(res.statusMessage, 0);
            // this.clearForm();
          } else {
            this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
          }
        }),
        error: (error: any) => {
          this.spinner.hide();
          this.commonMethod.checkEmptyData(error.statusMessage) == false ? this.errorService.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusMessage, 1);
        }
      })
    }
  }


  addclass(){
    let data = {
      language:this.language,
    }
    const dialogRef = this.dialog.open(AddClassComponent,{
      width:'500px',
      data: data,
      disableClose:true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Yes') {
        this.getAllPerformanceIndicatorData();
      }
    })
  }

  addlevel(){
    let data = {
      language:this.language,
      subjectId:this.filterEnglishLag.value
    }
    const dialogRef = this.dialog.open(AddLevelComponent,{
      width:'500px',
      data: data,
      disableClose:true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Yes') {
        this.getAllPerformanceIndicatorData();
      }
    })
  }


}