import { Component } from '@angular/core';
import { ViewChild} from '@angular/core';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { AddClassComponent } from './add-class/add-class.component';
import { AddLevelComponent } from './add-level/add-level.component';

@Component({
  selector: 'app-performance-indicators',
  templateUrl: './performance-indicators.component.html',
  styleUrls: ['./performance-indicators.component.scss']
})
export class PerformanceIndicatorsComponent {

  constructor(private _liveAnnouncer: LiveAnnouncer,public dialog: MatDialog) {}

  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  displayedColumns: string[] = ['srno','languagelelvel', 'first', 'second', 'third','fourth','fifth'];
  dataSource: any = new MatTableDataSource(ELEMENT_DATA);


  addclass(){
    this.dialog.open(AddClassComponent,{
      width:'500px'
    })
  }
  addlevel(){
    this.dialog.open(AddLevelComponent,{
      width:'500px'
    })
  }



}
export interface PeriodicElement {
  srno: number,
  languagelelvel: string;
  first: any;
  second: any;
  third: any;
  fourth: any,
  fifth: any
}

const ELEMENT_DATA: PeriodicElement[] = [
  {srno: 1, languagelelvel: 'sentence', first: '', second: '', third: '',fourth:'',fifth:''},
 
];