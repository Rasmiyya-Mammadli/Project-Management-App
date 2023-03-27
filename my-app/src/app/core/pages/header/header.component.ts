import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalsService } from '../../services/modals-services/modals.service';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user-service/user.service';

import * as fromUser from '../../store/selectors/user.selectors';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  // Indicates whether the user is authorized or not
  isAuthorized: boolean = false;

  // Subscription to listen for changes in the user's authentication status
  private subscription!: Subscription;

  // The ID of the user
  userId: string = '';

  // A map of language codes to their corresponding language names
  languageList = {
    EN: 'it',
    IT: 'en',
  };

  // The language code to switch to
  switchLanguageTo = '';

  constructor(
    private router: Router,
    private modalsService: ModalsService,
    private store: Store,
    private userService: UserService,
    private translateService: TranslateService,
  ) {}

  // Switches the language based on the user's selection
  LanguageSwitcher() {
    this.translateService.use(this.switchLanguageTo === 'IT' ? 'it' : 'en');
    localStorage.setItem('pma-lang', this.switchLanguageTo);
    this.switchLanguageTo =
      this.languageList[
        this.switchLanguageTo as keyof typeof this.languageList
      ].toUpperCase();
  }

  ngOnInit(): void {
    // Sets the default language based on the user's selection
    this.switchLanguageTo =
      this.languageList[
        (localStorage.getItem('pma-lang') ||
          'EN') as keyof typeof this.languageList
      ].toUpperCase();
    this.translateService.setDefaultLang(this.switchLanguageTo === 'IT' ? 'en' : 'it');

    // Listens for changes in the user's authentication status
    this.subscription = this.store.select(fromUser.getIsAuth).subscribe(status => {
      this.isAuthorized = status;
    });
  }

  // Redirects the user to the home page and shows the create board modal
  onCreateNewBoard() {
    this.router.navigateByUrl('/');
    this.modalsService.showCreateBoardModal = true;
  }

  // Logs the user out of the application
  logout(): void {
    this.userService.logout();
  }

  ngOnDestroy(): void {
    // Unsubscribes from the subscription to prevent memory leaks
    this.subscription.unsubscribe();
  }
}
