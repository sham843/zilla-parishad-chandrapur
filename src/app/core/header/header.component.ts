import { OverlayContainer } from '@angular/cdk/overlay'
import { Component, HostBinding } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { WebStorageService } from '../services/web-storage.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @HostBinding('class') className = ''
  language: string = 'English'
  constructor(
    private overlay: OverlayContainer,
    private webStorage: WebStorageService,
    private translate: TranslateService,
  ) {
    translate.addLangs(['English', 'Marathi'])
    translate.setDefaultLang('English')
  }
  ngOnInit(): void {
    let language: any = sessionStorage.getItem('language')
    this.webStorage.sendlangType(language)
  }

  changeTheme(darkMode: any) {
    let darkClassName: any
    this.className =
      darkMode == 'light'
        ? (darkClassName = 'lightMode')
        : (darkClassName = 'darkMode')
    this.webStorage.setTheme(darkClassName)
    if (darkMode == 'light') {
      this.overlay.getContainerElement().classList.add('lightMode')
      this.overlay.getContainerElement().classList.remove('lightMode')
    } else {
      this.overlay.getContainerElement().classList.add('darkMode')
      this.overlay.getContainerElement().classList.remove('darkMode')
    }
  }

  changeLanguage(lang: any) {
    this.language = lang
    this.translate.use(lang)
    this.webStorage.sendlangType(lang)
    sessionStorage.setItem('language', lang)
  }
}
