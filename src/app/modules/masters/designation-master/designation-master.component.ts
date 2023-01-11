import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { ExcelPdfDownloadService } from 'src/app/core/services/excel-pdf-download.service';
import { MasterService } from 'src/app/core/services/master.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { ViewDialogComponent } from 'src/app/shared/components/view-dialog/view-dialog.component';
import { AddDesignationComponent } from './add-designation/add-designation.component';

@Component({
  selector: 'app-designation-master',
  templateUrl: './designation-master.component.html',
  styleUrls: ['./designation-master.component.scss']
})

export class DesignationMasterComponent {

  lang!: string;
  searchId!: number;
  pageNumber: number = 1;
  searchdesignationLvl = new FormControl('');
  desigantionLevelArray = new Array();
  tableDataArray = new Array();
  tableDatasize!: number;
  userLoginDesignationLevelId!:number;
  designTreeViewArray: any;
  hideFlowChartDig :boolean = false
  highLightRow :boolean = false
  constructor(public dialog: MatDialog, private apiService: ApiService, private master: MasterService,
    private errors: ErrorsService, private webStorage: WebStorageService,
    private commonMethod: CommonMethodsService, private spinner: NgxSpinnerService, private excelPdf: ExcelPdfDownloadService
  ) {
  }

  ngOnInit() {
    let localVal: any = this.webStorage.getLocalStorageData();
    let loginData = JSON.parse(localVal)
    this.userLoginDesignationLevelId = loginData.responseData.designationLevelId;
    this.webStorage.setLanguage.subscribe((res: any) => {
       res == 'Marathi' ? this.lang = 'mr-IN' : this.lang = 'en';
      this.setTableData();
    })
    this.getDesignationLevel();
    this.getTableData();
    // this.getDesignTreeView();
  }

  getDesignTreeView() {
    this.apiService.setHttp('GET', 'designation/get-designation-tree-view?flag=' + (this.apiService.translateLang?this.lang:'en'), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.designTreeViewArray = res.responseData?.childs;
          // ele['cssClass'] = 'bg-info text-white border-0';
        } else {
          this.designTreeViewArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      },
      error: ((err: any) => {
        this.errors.handelError(err);
      })
    });
  }

  clearFilter() {
    this.searchdesignationLvl.reset();
    this.getTableData();
  }

  getDesignationLevel() {//error handling / handled in masters table
    this.master.getDesignationLevel(this.apiService.translateLang?this.lang:'en').subscribe( {
      next : ((res:any)=>{
        if(res.statusCode == '200'){
          this.desigantionLevelArray = res.responseData;
          }
          else {
            this.desigantionLevelArray = [];
            this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
          }
      }),
      error: ((err: any) => {
        this.spinner.hide();
        this.errors.handelError(err.status)
      })
    });
  }

  getTableData(flag?: string) {
    this.spinner.show();
    this.pageNumber = flag == 'filter' ? 1 : this.pageNumber;
    let str = `pageno=${this.pageNumber}&pagesize=10`;
    this.apiService.setHttp('GET', 'designation/get-designation-details-table?designationLevel=' + Number(this.searchdesignationLvl.value)+ '&' + str + '&designationUserLevel=' + Number(this.userLoginDesignationLevelId) + '&flag=' + (this.apiService.translateLang?this.lang:'en'), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == "200") {
          this.tableDataArray = res.responseData.responseData1;
          this.tableDatasize = res.responseData.responseData2.pageCount;
          this.setTableData();
        } else {
          this.spinner.hide();
          this.tableDataArray = [];
          this.tableDatasize = 0;
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
        this.setTableData();
      },
      error: ((err: any) => {
        this.spinner.hide();
        this.errors.handelError(err)
      })
    });
  }

  setTableData() {
    this.highLightRow=true;
    let displayedColumns;
    ['srNo', 'designationName', 'designationLevelName', 'linkedToDesignationLevelName']
    this.lang == 'mr-IN' && this.apiService.translateLang? displayedColumns = ['srNo', 'designationName', 'designationLevelName', 'linkedDesignationDetails', 'action'] : displayedColumns = ['srNo', 'designationName', 'designationLevelName', 'linkedDesignationDetails', 'action'];
    let displayedheaders;
    this.lang == 'mr-IN' ? displayedheaders = ['अनुक्रमणिका', 'पदनाम नाव', 'पदनाम स्तर', 'संलग्न', 'कृती'] : displayedheaders = ['Sr. No.', 'Designation Name', 'Designation Level', 'Linked to', 'Action'];
    let tableData = {
      pageNumber: this.pageNumber,
      highlightedrow:true,
      img: '',
      blink: '',
      badge: '',
      isBlock: '', 
      pagination: this.tableDatasize > 10 ? true : false, isArray: "linkedDesignationDetails",
      nestedArray: 'linkedToDesignationName',
      displayedColumns: displayedColumns, 
      tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
      tableHeaders: displayedheaders,
    };
    this.highLightRow?tableData.highlightedrow=true:tableData.highlightedrow=false,
    this.apiService.tableData.next(tableData);
  }

  childCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.getTableData();
        break;
      case 'Edit':
        this.addDesignation(obj);
        break;
      case 'Delete':
        this.globalDialogOpen(obj);
        break;
      case 'Row':
      this.viewDataDialog(obj);
        break;
    }
  }

  //#region -------------------------------------------dialog box open function's start heare----------------------------------------//

  addDesignation(obj?: any) {
    const dialogRef = this.dialog.open(AddDesignationComponent, {
      width: '420px',
      data: obj,
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {
      this.pageNumber = 1;
      this.getDesignTreeView();
      if (result) {
        this.getTableData();
      } else if (result == false) {
        this.getTableData();
      }
      this.highLightRow=false;
      this.setTableData();
    });
  }

  globalDialogOpen(obj?: any) {
    let dialoObj = {
      p1: this.lang == 'mr-IN' ? 'तुम्ही निवडलेले पदनाम रेकॉर्ड हटवू इच्छिता?' : 'Do You Want To Delete Selected Designation Record?',
      p2: '',
      cardTitle: this.lang == 'mr-IN' ? 'हटवा' : 'Delete',
      successBtnText: this.lang == 'mr-IN' ? 'हटवा' : 'Delete',
      dialogIcon: 'assets/images/trash.gif',
      cancelBtnText: this.lang == 'mr-IN' ? 'रद्द करा' : 'Cancel'
    }
    const deleteDialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '320px',
      data: dialoObj,
      disableClose: true,
      autoFocus: false
    })

    deleteDialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Yes') {
        let designationId = obj.id;
        let userId = this.webStorage.getUserId();
        this.apiService.setHttp('DELETE', 'designation/delete-designation-details?designationId=' + designationId + '&userId=' + userId + '&flag=' + (this.apiService.translateLang?this.lang:'en'), false, false, false, 'baseUrl');
        this.apiService.getHttp().subscribe({
          next: (res: any) => {
            if (res.statusCode == "200") {
              this.commonMethod.snackBar(res.statusMessage, 0);
              this.getTableData()
            } else {
              this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
            }
          },
          error: ((err: any) => { this.errors.handelError(err) })
        });
      }
      this.highLightRow=false;
      this.setTableData();
    })
  }

  //#endregion -------------------------------------------dialog box open function's end heare----------------------------------------//

  excelDownload() {
    let pageName = 'Designation Master';
    let header = ['Sr.No.', 'Designation Name', 'Designation Level', 'Linked To'];
    let column = ['srNo', 'designationName', 'designationLevelName', 'newLinkedToDesignationName'];

    this.tableDataArray.map((ele: any) => {
      let myArray: any = [];
      ele.linkedDesignationDetails.map((ele1: any) => {
        myArray.push(ele1.linkedToDesignationName);
      })
      ele['newLinkedToDesignationName'] = myArray.toString();
    })
    this.excelPdf.downloadExcel(this.tableDataArray, pageName, header, column);
  }

  viewDataDialog(obj:any){   //view table data
    console.log(obj)
    let linkedToData;
    obj.newLinkedToDesignationName.forEach((ele:any) => {
      linkedToData.push(ele)
    });
    let viewObj = {
      cardTitle: this.lang == 'mr-IN' ? '' : 'Designation Master',
      label:['Designation Name','Designation Level','Linked To'],
      value:[obj.designationName,obj.designationLevelName,obj.linkedToData]
    }
     this.dialog.open(ViewDialogComponent, {
      width: '850px',
      data: viewObj,
      disableClose: true,
      autoFocus: false
    })
  }
}
