import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from 'src/app/boards/models/task.interface';
import { User } from 'src/app/user/models/user.model';
import { UserService } from 'src/app/core/services/user-service/user.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit {
  @Input() task!: Task;
  filteredUsers: User[] = [];

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.filterUsers();
  }

  filterUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.filteredUsers = users.filter(user =>
        this.task.users.includes(user._id)
      );
    });
  }

  navigateToBoard(): void {
    this.router.navigate(['/board', this.task.boardId]);
  }
}
