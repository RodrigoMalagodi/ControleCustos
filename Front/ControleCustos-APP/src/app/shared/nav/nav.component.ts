import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  isCollapsed = true;
  user: string = '';
  imgUrl: string = '';
  imagemUsuario: string = '';
  constructor(public accountService: AccountService, private router: Router) {}

  ngOnInit(): void {}

  logout(): void {
    localStorage.clear();
    this.accountService.logout();
    this.router.navigateByUrl('/user/login');
  }

  public showMenu(): boolean {
    if (
      this.router.url !== '/user/login' &&
      this.router.url !== '/user/registration'
    ) {
      this.user = this.accountService.userLog;
      var user = localStorage.getItem('user');
      if (user) {
        this.imagemUsuario = JSON.parse(
          localStorage.getItem('user')!
        ).imagemURL.toString();
        if (this.imagemUsuario !== 'NULL') {
          this.imgUrl = `${environment.apiURL}/resources/images/users/${this.imagemUsuario}`;
        } else {
          this.imgUrl = 'assets/img/default_user.png';
        }
      }
      return true;
    } else {
      this.user = '';
      return false;
    }
  }
}
