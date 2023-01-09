import { OverlayContainer } from '@angular/cdk/overlay'
import { Component, HostBinding } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { RegisterUsersComponent } from 'src/app/modules/masters/user-registration/register-users/register-users.component'
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
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
  loginData!: any;
  profilePhoto!:string;
  encryptInfo:any;
  darkClassName:any;
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
    this.loginData = this.webStorage.getLoginData();
    let language: any = sessionStorage.getItem('language');
    this.webStorage.setLanguage.next(language);
    this.translate.use(language);

    this.webStorage.setLanguage.subscribe((res: any) => {
      this.selLang = res;
    })
    this.darkClassName=sessionStorage.getItem('theme');
    this.webStorage.setTheme(this.darkClassName);
    this.profilePhoto=this.loginData.profilePhoto;
  }

  changeTheme(darkMode: any) {
    this.className =darkMode == 'light'? (this.darkClassName = 'lightMode'): (this.darkClassName = 'darkMode');
    this.webStorage.setTheme(this.darkClassName);
    if (darkMode == 'light') {
      this.overlay.getContainerElement().classList.add('lightMode')
      this.overlay.getContainerElement().classList.remove('lightMode')
    } else {
      this.overlay.getContainerElement().classList.add('darkMode')
      this.overlay.getContainerElement().classList.remove('darkMode')
    }
    sessionStorage.setItem('theme',this.darkClassName);
  }

  changeLanguage(lang: any) {
    this.language = lang
    this.translate.use(lang)
    this.webStorage.setLanguage.next(lang)
    sessionStorage.setItem('language', lang)
  }

  openLogoutModal() {
    let modalLang=this.language;
    this.webStorage.setLanguage.subscribe((res: any) => {
      modalLang = res
    })
    const dialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '350px',
      data: {
        p1: modalLang == 'Marathi' ? 'तुम्हाला खरोखर लॉगआउट करायचे आहे?' : 'Do You Really Want To Logout?',
        p2: '',
        cardTitle: modalLang == 'Marathi' ? 'बाहेर पडा' : 'Logout',
        successBtnText: modalLang == 'Marathi' ? 'बाहेर पडा' : 'Logout',
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
  openChangePassModal() {
    let lang;
    this.webStorage.setLanguage.subscribe((res: any) => {
      lang = res
    })
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '700px',
      data: {
        p1: '',
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
    let lang;
    this.webStorage.setLanguage.subscribe((res: any) => {
      lang = res
    })
    const dialog = this.dialog.open(RegisterUsersComponent,{
      width: '850px',
      disableClose: true,
      data:{
        cardTitle: lang=='Marathi' ?'माझे प्रोफाइल':'My Profile',
        successBtnText: lang=='Marathi' ? 'प्रोफाइल बदला' : 'Update Profile',
        flag:'profile',
        cancelBtnText:lang=='Marathi' ? 'रद्द करा' : 'Cancel',
      }
    })
    dialog.afterClosed().subscribe((res:any) => {
      if (res == 'Yes') {
        this.webStorage.getProfile().subscribe(res=>{
          this.profilePhoto=res;
          let localData=JSON.parse(this.webStorage.getLocalStorageData())
          localData.responseData.profilePhoto=res
          this.encryptInfo = encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(JSON.stringify(localData)), 'secret key 123').toString());
           localStorage.setItem('loggedInData', this.encryptInfo);
        })
      }
    })
  } 
}
