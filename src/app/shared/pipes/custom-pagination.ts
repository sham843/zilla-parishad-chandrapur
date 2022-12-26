import { Injectable } from "@angular/core";
import { MatPaginatorIntl } from "@angular/material/paginator";
import { WebStorageService } from "src/app/core/services/web-storage.service";


@Injectable({
  providedIn: "root"
})

export class CustomMatPaginatorIntl extends MatPaginatorIntl{
  ofKeyValue: any;

  constructor(private webStorage: WebStorageService){
    super();
    this.webStorage.setLanguage.subscribe(lang => {
      super.nextPageLabel = lang == 'English' ? 'Next Page' : 'पुढील पान';
      super.previousPageLabel = lang == 'English' ? 'Previous Page' : 'मागील पान';
      super.lastPageLabel = lang == 'English' ? 'Last Page' : 'शेवटच पान';
      super.firstPageLabel = lang == 'English' ? 'First Page' : 'पहिले पान';
      this.ofKeyValue = lang == 'English' ? 'of' : 'च्या';
      super.itemsPerPageLabel = lang == 'English' ? 'Items per page' : 'प्रति पृष्ठ आयटम';
      super.getRangeLabel = this.RangeLabel;
    });
  }

  RangeLabel = (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) {
      return `0 ${this.ofKeyValue} ${length}`;
    }
  
    length = Math.max(length, 0);
  
    const startIndex = page * pageSize;
  
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
  
    return `${this.webStorage.numberTransformFunction(startIndex + 1)} - ${this.webStorage.numberTransformFunction(endIndex)} ${this.ofKeyValue} ${this.webStorage.numberTransformFunction(length)}`;
  };

}