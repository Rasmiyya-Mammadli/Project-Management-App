import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { ModalsService } from '../../../core/services/modals-services/modals.service';
import * as BoardActions from '../../../core/store/actions/boards.actions';
import { BoardsState } from '../../../core/store/state/boards.state';
import { UserState } from 'src/app/core/store/state/user.state';
import { getUser } from 'src/app/core/store/selectors/user.selectors';
import { User } from 'src/app/user/models/user.model';
import { UserService } from 'src/app/core/services/user-service/user.service';
import { getErrorMessage } from 'src/app/core/store/selectors/boards.selectors';
import { NotificationService } from 'src/app/core/services/notification-service/notification.service';

@Component({
  selector: 'app-create-board',
  templateUrl: './create-board.component.html',
  styleUrls: ['./create-board.component.scss'],
})
export class CreateBoardComponent implements OnInit, OnDestroy {
  createBoardForm!: FormGroup;
  userId?: string;
  users$!: Observable<User[]>;
  userSubscription!: Subscription;

  constructor(
    private store: Store<BoardsState>,
    private userStore: Store<UserState>,
    private modalsService: ModalsService,
    private userService: UserService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.userStore.select(getUser).subscribe(user => {
      this.userId = user?._id;
    });
    this.users$ = this.userService.getUsers();
    this.createBoardForm = this.fb.group({
      title: ['', Validators.required],
      usersSelect: [''],
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  get title() {
    return this.createBoardForm.get('title');
  }

  get usersSelect() {
    return this.createBoardForm.get('usersSelect');
  }

  onSubmit(formDirective: FormGroupDirective): void {
    if (this.createBoardForm.valid) {
      const { title, usersSelect } = this.createBoardForm.value;
      this.store.dispatch(BoardActions.createNewBoard({
        title,
        owner: this.userId!,
        users: usersSelect,
      }));
      this.store.select(getErrorMessage).subscribe(message => {
        if (message) {
          this.notificationService.openNotification(message);
        }
      });
      this.createBoardForm.reset();
      formDirective.resetForm();
      this.modalsService.showCreateBoardModal = false;
    }
  }
  onClose() {
    this.modalsService.showCreateBoardModal = false;
  }
}
