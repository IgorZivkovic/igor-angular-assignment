import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user-service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-users-page-component',
  standalone: true,
  imports: [ButtonModule, TableModule],
  templateUrl: './users-page-component.html',
  styleUrl: './users-page-component.scss',
})
export class UsersPageComponent {
  private readonly userService = inject(UserService);

  readonly users = this.userService.users;

  addUser(): void {
    // TEMPORARY: will open dialog later
    this.userService.add({
      id: Date.now(),
      name: 'New User',
      birthday: '1990-01-01',
      gender: 'male',
      country: 'USA',
    });
  }
}
