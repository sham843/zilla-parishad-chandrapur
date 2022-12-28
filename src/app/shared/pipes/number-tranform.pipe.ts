import { Pipe, PipeTransform } from '@angular/core';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Pipe({
  name: 'numberTranformPipe',
  pure: false,
  standalone:true,
})

export class NumberTransformPipe implements PipeTransform {
  language:any;
  constructor(private webStorage:WebStorageService){}
    //Marathi number transform
    transform(value: any) {
      this.webStorage.setLanguage.subscribe((res: any) => {
      res=='Marathi'?this.language='mr-IN' :this.language='en-IN';  
    })
    const number = new Intl.NumberFormat(this.language).format(value);
    return number}
  
}