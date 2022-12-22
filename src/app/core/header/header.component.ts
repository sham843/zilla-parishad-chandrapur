import { OverlayContainer } from '@angular/cdk/overlay'
import { Component, HostBinding } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component'
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
    private dialog: MatDialog, private router: Router,
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

  logOut() {
    const dialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '350px',
      data: {
        p1: 'Are You Sure?',
        p2: '',
        cardTitle: 'Logout',
        successBtnText: 'Logout',
        dialogIcon: 'assets/images/logout.gif',
        cancelBtnText: 'Cancel',
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Yes') {
        this.localStorageClear();
      }
    });
  }

  localStorageClear() {
    localStorage.clear();
    this.router.navigate(['../home']);
  }
}
