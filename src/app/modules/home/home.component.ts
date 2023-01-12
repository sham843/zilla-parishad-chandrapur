import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  language:any='English';
  activeLang:any;
  constructor(private translate:TranslateService,
    private webStorage:WebStorageService){
    translate.addLangs(['English', 'Marathi'])
    translate.setDefaultLang('English')
  }
  ngOnInit(){
   let language:any= sessionStorage.getItem('language');
    this.webStorage.setLanguage.next(language);
    this.translate.use(language);

    this.webStorage.setLanguage.subscribe((res: any) => {
      this.activeLang = res;
    })
  }

onChangeLanguage(lang:any){
  this.language=lang;
    this.translate.use(lang)
    this.webStorage.setLanguage.next(lang)
    sessionStorage.setItem('language', lang)
}
}
