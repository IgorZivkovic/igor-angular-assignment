import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-users-page-component',
  standalone: true,
  imports: [],
  templateUrl: './users-page-component.html',
  styleUrl: './users-page-component.scss',
})
export class UsersPageComponent {
  private readonly userService = inject(UserService);

  readonly users = this.userService.users;
}
