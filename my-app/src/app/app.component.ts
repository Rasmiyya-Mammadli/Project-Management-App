import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as UserAction from './core/store/actions/user.actions';
import * as fromLoader from './core/store/selectors/loader.selectors';
import { SpinnerOverlayService } from './core/spinner/spinner-service/spinner-overlay.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'project-management-app';

  constructor(
    private store: Store,
    private spinnerOverlayService: SpinnerOverlayService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('myBearerToken')) {
      this.store.dispatch(UserAction.fetchUser());
    }

    this.store.select(fromLoader.getIsLoading).subscribe(status => {
      if (status) {
        this.spinnerOverlayService.displaySpinner();
      } else {
        this.spinnerOverlayService.hideSpinner();
      }
    });
  }
}
