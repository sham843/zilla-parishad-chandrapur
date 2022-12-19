import { Injectable } from '@angular/core';
import { MatSnackBar, } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommonMethodsService {

  constructor(private SnackBar: MatSnackBar,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  snackBar(data: string, status: number) {
    let snackClassArr: any = ['snack-success', 'snack-danger', 'snack-warning'];
    this.SnackBar.open(data, " ", {
      duration: 2000,
      panelClass: [snackClassArr[status]],
      verticalPosition: 'top', // 'top' | 'bottom'
      horizontalPosition: 'right', //'start' | 'center' | 'end' | 'left' | 'right'
    })
  }

  sanckBarHide() {
    this.SnackBar.dismiss();
  }

  checkEmptyData(data: any){
    let value: any;
    if (data == "" || data == null || data == "null" || data == undefined || data == "undefined" || data == 'string' || data == null || data == 0) {
      value = false;
    } else {
      value = true;
    }
    return value;
  }

  routerLinkRedirect(path: any) {
    this.router.navigate([path], { relativeTo: this.activatedRoute })
  }

  isEmptyArray(array: any){
    if (array == null || array == undefined || array.length <= 0){
        return true;
    }else{
        return false;
    }
  }

  downLoadFile(data: any, type: string, filename: string) {
    var a = document.createElement("a");
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    var blob = new Blob([data], { type: type });
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
}


downLoadPdf(header: any, values: any, objData: any) {
  // let doc: any = new jsPDF();
  let doc: any;

  doc.autoTable(header, values, {
    startY: 25,
    // margin: { horizontal: 7 , verticle: 10},
    margin: { top: 25 },

    didDrawPage: function (_data: any) {

      var imgWidth = 33;
      var height = 20;
      doc.addImage('../../../../assets/images/.jpeg', 'JPEG', 2, -3, imgWidth, height); //add image

      doc.setFontSize(13);
      doc.text(objData.topHedingName, 100, 8, "center");

      if(objData?.timePeriod != null){
      doc.setFontSize(8);
      doc.text(objData.timePeriod, 11, 14, "left");
      }
     
       doc.setFontSize(8);
       doc.text(objData.createdDate, 200, 14, "right");

      doc.setLineWidth(0.2);
      doc.line(12, 15, 200, 15);

      doc.setLineWidth(0.2);
      doc.line(12, 286, 200, 286);

      doc.setFontSize(8);
      doc.text('Note:This is a system generated File.', 200, 290, "right");

    }
  });

  doc.save(objData.topHedingName);
}



}
