import { OnInit, Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/core/services/api.service';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-table-grid',
  templateUrl: './table-grid.component.html',
  styleUrls: ['./table-grid.component.scss']
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
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.tableInfo = [];
    this.apiService.tableData.subscribe((res: any) => {
      this.tableInfo = res;
      if (this.tableInfo) {
        this.highlightedRow = this.tableInfo.highlightedRow;
        this.displayedColumns = this.tableInfo.displayedColumns;
        this.tableSize = this.tableInfo.tableSize;
        this.tableHeaders = this.tableInfo.tableHeaders
        this.pageNumber = this.tableInfo.pageNumber;
        this.tableInfo.tableData ? this.tableRecords = new MatTableDataSource(this.tableInfo.tableData) : this.tableRecords = [];
        this.paginator?._pageIndex != 0 && this.pageIndex != this.pageNumber ? this.paginator?.firstPage() : '';
        this.tableRecords.sort = this.sort;

      }
    })
  }

  // ngAfterViewInit() {
  //   this.tableInfo.sort = this.sort;
  // }

  action(obj: any, label: string, i?:any) {
    this.highlightedRow = i;
    obj.label = label;
    obj.pageNumber = obj.pageIndex + 1;
    this.pageIndex = obj.pageNumber;
    this.recObjToChild.emit(obj);
  }
}
