import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalsService } from '../../../core/services/modals-services/modals.service';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Board } from '../../models/board.interface';
import { BoardsState } from '../../../core/store/state/boards.state';
import { NotificationService } from 'src/app/core/services/notification-service/notification.service';
import {
  getBoards, 
  getErrorMessage,
} from '../../../core/store/selectors/boards.selectors';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit, OnDestroy {
  allBoards!: Board[];

  userId: string = '';

  boardsSubscription!: Subscription;
  errorsSubscription!: Subscription;

  constructor(
    public modalsService: ModalsService,
    private boardsStore: Store<BoardsState>,
    private notificationService: NotificationService
  ) {}

  onCreatingBoard() {
    this.modalsService.showCreateBoardModal = true;
  }

  ngOnInit(): void {
    this.boardsSubscription = this.boardsStore
      .select(getBoards)
      .subscribe(boards => (this.allBoards = boards)); // use a new line between statements

    this.errorsSubscription = this.boardsStore
      .select(getErrorMessage)
      .subscribe(message => {
        if (message !== '') {
          this.notificationService.openNotification(message);
        }
      });
  }

  ngOnDestroy(): void {
    this.boardsSubscription.unsubscribe();
    this.errorsSubscription.unsubscribe();
  }
}
