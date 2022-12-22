import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
constructor(private translate:TranslateService,
  private webStorage:WebStorageService){
    translate.addLangs(['English', 'Marathi'])
    translate.setDefaultLang('English')
  }
  ngOnInit(){
    let language: any = sessionStorage.getItem('language');
    this.webStorage.setLanguage.next(language);
    this.translate.use(language);
  }

onChangeLanguage(lang:any){
  console.log(lang)
  this.translate.use(lang)
    this.webStorage.setLanguage.next(lang)
    sessionStorage.setItem('language', lang)
}
}
