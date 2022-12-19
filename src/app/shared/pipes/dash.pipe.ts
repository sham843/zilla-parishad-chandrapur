import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dash'
})
export class DashPipe implements PipeTransform {

  transform(value: unknown): unknown {
    let val: any;
    if (value == undefined || value == null || value == "" || value == "null" || value == 'undefined' || value == " ") {
      val = '-';
    } else {
      val = value
    }
    return val;
  }

}
