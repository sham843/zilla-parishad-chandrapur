import { OnInit, Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/core/services/api.service';
import { MatSort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { NumberTransformPipe } from '../../pipes/number-tranform.pipe';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-table-grid',
  templateUrl: './table-grid.component.html',
  styleUrls: ['./table-grid.component.scss'],
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule,MatCheckboxModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatIconModule,TranslateModule, NumberTransformPipe],

})
export class TableGridComponent implements OnInit {
  @Output() recObjToChild = new EventEmitter<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns = new Array();
  tableRecords: any;
  tableSize!: number;
  pageNumber!: number;
  pageIndex!: number;
  tableInfo: any;
  tableHeaders = new Array();
  highlightedRow!:number;
  language:any;
  constructor(private apiService: ApiService,
    private webStorage:WebStorageService,
    private translate:TranslateService) { }

  ngOnInit() {
    this.tableInfo = [];
    this.apiService.tableData.subscribe((res: any) => {
      this.tableInfo = res;
      if (this.tableInfo) {
        this.highlightedRow = this.tableInfo.highlightedRow;
        this.displayedColumns = this.tableInfo.displayedColumns;
        this.tableSize = this.tableInfo.tableSize;
        this.tableHeaders = this.tableInfo.tableHeaders;
        this.pageNumber = this.tableInfo.pageNumber;
        this.tableInfo.tableData ? this.tableRecords = new MatTableDataSource(this.tableInfo.tableData) : this.tableRecords = [];
        this.paginator?._pageIndex != 0 && this.pageIndex != this.pageNumber ? this.paginator?.firstPage() : '';
        this.tableRecords.sort = this.sort;
      }
    })
    this.webStorage.setLanguage.subscribe((res: any) => {
      this.language = res;
    })
    this.translate.use(this.language);
  }

  // ngAfterViewInit() {
  //   this.tableInfo.sort = this.sort;
  // }

  action(obj: any, label: string, i?:any) {
    label == 'checkBox' ? obj.checkBoxValue =i.checked :this.highlightedRow = i;;  
    obj.label = label;
    obj.pageNumber = obj.pageIndex + 1;
    this.pageIndex = obj.pageNumber;
    this.recObjToChild.emit(obj);
  }
}
