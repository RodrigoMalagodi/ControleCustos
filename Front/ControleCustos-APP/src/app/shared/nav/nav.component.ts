import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  isCollapsed = true;
  user: string = '';
  constructor(public accountService: AccountService, private router: Router) {}

  ngOnInit(): void {}

  logout(): void {
    this.accountService.logout();
    this.router.navigateByUrl('/user/login');
  }

  public showMenu(): boolean {
    if (
      this.router.url !== '/user/login' &&
      this.router.url !== '/user/registration'
    ) {
      this.user = this.accountService.userLog;
      return true;
    } else {
      this.user = '';
      return false;
    }
  }
}
