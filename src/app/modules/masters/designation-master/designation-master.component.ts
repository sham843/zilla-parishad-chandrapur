import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { MasterService } from 'src/app/core/services/master.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { AddDesignationComponent } from './add-designation/add-designation.component';

@Component({
  selector: 'app-designation-master',
  templateUrl: './designation-master.component.html',
  styleUrls: ['./designation-master.component.scss']
})

export class DesignationMasterComponent {

  lang: string = 'English';
  pageNumber: number = 1;
  searchContent = new FormControl('');
  desigantionLevelArray = new Array();
  constructor(public dialog: MatDialog, private apiService: ApiService, private master: MasterService,
    private errors: ErrorsService, private webStorage: WebStorageService, 
    private commonMethod: CommonMethodsService,private spinner: NgxSpinnerService
    ) { }

  ngOnInit() {
    this.webStorage.setLanguage.subscribe((res: any) => {
      res == 'Marathi' ? (this.lang = 'mr-IN') : (this.lang = 'en');
    })
    this.getDesignationLevel();
    this.getTableData()
  }

  getDesignationLevel() {
    this.master.getDesignationLevel(this.lang).subscribe((res: any) => {
      this.desigantionLevelArray = res.responseData;
    })
  }
  getTableData(flag?: string) {
    this.spinner.show();
    this.pageNumber = flag == 'filter' ? 1 : this.pageNumber;
    let tableDataArray = new Array();
    let tableDatasize!: Number;
    let str = `pageno=${this.pageNumber}&pagesize=10`;
    this.apiService.setHttp('GET', 'designation/get-designation-details-table?designationLevel=' + Number(this.searchContent.value) + '&' + str + '&flag=' + this.lang, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == "200") {
          tableDataArray = res.responseData.responseData1;
          tableDatasize = res.responseData.responseData2.pageCount;
        } else {
          alert('try one more time')
          tableDataArray = [];
          tableDatasize = 0;
        }
        let displayedColumns = ['srNo', 'designationName', 'designationLevelName', 'action'];
        let displayedheaders = ['Sr. No.', 'Designation Name', 'Designation Level', 'Action'];
        let tableData = {
          pageNumber: this.pageNumber,
          img: '', blink: '', badge: '', isBlock: '', 
          displayedColumns: displayedColumns,pagination: true,
          tableData: tableDataArray,
          tableSize: tableDatasize,
          tableHeaders: displayedheaders,
        };
        console.log(tableData);
        
        this.apiService.tableData.next(tableData);
      },
      error: ((err: any) => { 
        this.spinner.hide();
        this.errors.handelError(err) })
    });

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
      case 'Block':
        this.globalDialogOpen();
        break;
      case 'Delete':
        this.globalDialogOpen(obj);
    }
  }

  //#region -------------------------------------------dialog box open function's start heare----------------------------------------//
  addDesignation(obj?: any) {
      const dialogRef = this.dialog.open(AddDesignationComponent, {
        width: '420px',
        data: obj,
        disableClose: true,
        autoFocus: false
      });
      dialogRef.afterClosed().subscribe(result => {
            console.log(result);
           this.getTableData();
          });
    }

  globalDialogOpen(obj?:any) {
    let dialoObj = {
      header: 'Delete',
      cardTitle: 'Do you want to delete selected Designation record?',
      cancelBtnText: 'Cancel',
      successBtnText: 'Ok'
    }
    const deleteDialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '320px',
      data: dialoObj,
      disableClose: true,
      autoFocus: false
    })
    deleteDialogRef.afterClosed().subscribe((result: any) => {
      if(result == 'Yes'){
        let designationId = obj.id;
        let userId = obj.userId;
        this.apiService.setHttp('DELETE', 'designation/delete-designation-details?designationId='+ designationId +'&userId=' + userId + '&flag=' + this.lang, false, false, false, 'baseUrl');
        this.apiService.getHttp().subscribe({
          next: (res: any) => {
            if (res.statusCode == "200") {
              this.commonMethod.snackBar(res.statusMessage,0);
              this.getTableData()
            } else {
              this.commonMethod.snackBar(res.statusMessage,1);
            }
          },
          error: ((err: any) => { this.errors.handelError(err) })
        });
      }
    })
  }
  //#endregion -------------------------------------------dialog box open function's end heare----------------------------------------//
}