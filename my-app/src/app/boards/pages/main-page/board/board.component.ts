import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import { Board } from '../../../models/board.interface';
import { openDialog } from '../../../../core/modal/confirm-modal/confirm-modal.component';
import { ColumnsState } from '../../../../core/store/state/columns.state';
import { BoardsState } from '../../../../core/store/state/boards.state';
import * as columnsActions from '../../../../core/store/actions/columns.actions';
import * as boardsActions from '../../../../core/store/actions/boards.actions';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  @Input() board!: Board;

  constructor(
    private router: Router,
    private columnsStore: Store<ColumnsState>,
    private boardsStore: Store<BoardsState>,
    private matDialog: MatDialog,
    private translateService: TranslateService
  ) {}

  backToBoard(boardId: string) {
    this.router.navigate(['/board', boardId]);

    const payload = { boardId };
    this.columnsStore.dispatch(columnsActions.getBoardIdToStore(payload));
  }

  onOpenBoardModal() {
    const onDelete = () => {
      this.boardsStore.dispatch(boardsActions.deleteBoards({ _id: this.board._id! }));
    };

    const targetBoard = this.translateService.instant('CONFIRM_MODAL.targetBoard');
    openDialog(this.matDialog, onDelete, targetBoard);
  }
}

