import { OverlayContainer } from '@angular/cdk/overlay'
import { Component, HostBinding } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component'
import { MyProfileComponent } from 'src/app/shared/components/my-profile/my-profile.component'
import { ChangePasswordComponent } from '../change-password/change-password.component'
import { WebStorageService } from '../services/web-storage.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @HostBinding('class') className = ''
  language: string = 'English'
  lag = ['English', 'Marathi']
  selLang!: string;
  userName!:string;
  constructor(
    private overlay: OverlayContainer,
    private dialog: MatDialog,
    private router: Router,
    private webStorage: WebStorageService,
    private translate: TranslateService,
  ) {
    translate.addLangs(['English', 'Marathi'])
    translate.setDefaultLang('English')
  }
  ngOnInit(): void {
    let language: any = sessionStorage.getItem('language')
    this.webStorage.setLanguage.next(language)
    this.translate.use(language)

    this.webStorage.setLanguage.subscribe((res: any) => {
      this.selLang = res
    })

    let name=JSON.parse(this.webStorage.getLocalStorageData());
    this.userName=name.responseData.name;
    console.log(this.userName)
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
    this.webStorage.setLanguage.next(lang)
    sessionStorage.setItem('language', lang)
  }

  openLogoutModal() {
    let modalLang;
    this.webStorage.setLanguage.subscribe((res: any) => {
      modalLang = res
    })
      const dialogRef = this.dialog.open(GlobalDialogComponent, {
        width: '350px',
        data:{ p1:modalLang == 'Marathi' ? 'तुम्हाला खात्री आहे का?': 'Are You Sure?',
        p2: '',
        cardTitle: modalLang == 'Marathi' ? 'बाहेर पडणे' : 'Logout',
        successBtnText: modalLang == 'Marathi' ? 'बाहेर पडणे' : 'Logout',
        dialogIcon: 'assets/images/logout.gif',
        cancelBtnText: modalLang == 'Marathi' ? 'रद्द करा' : 'Cancel',
      },
      disableClose: true,
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Yes') {
        this.localStorageClear()
      }
    })
  }
  openChangePassModal(){
    let lang;
    this.webStorage.setLanguage.subscribe((res: any) => {
      lang = res
    })
      const dialogRef = this.dialog.open(ChangePasswordComponent, {
        width: '700px',
        data:{ p1:'',
        p2: '',
        cardTitle: lang == 'Marathi' ? 'पासवर्ड बदला' : 'Change Password',
        successBtnText: lang == 'Marathi' ? 'पासवर्ड बदला' : 'Change Password',
        cancelBtnText: lang == 'Marathi' ? 'रद्द करा' : 'Cancel',
      },
      disableClose: true,
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Yes') {
        this.localStorageClear()
      }
    })
  }
  localStorageClear() {
    localStorage.clear()
    this.router.navigate(['../login'])
  }

  openMyProfileDialog() {
    this.dialog.open(MyProfileComponent,{
      width: '500px',
    });
  }
}
