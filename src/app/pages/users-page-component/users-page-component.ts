import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user-service';
import { UserTableComponent } from '../../components/user-table-component/user-table-component';
import { ButtonModule } from 'primeng/button';
import {
  UserDialogComponent,
  UserDialogMode,
} from '../../components/user-dialog-component/user-dialog-component';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users-page-component',
  standalone: true,
  imports: [ButtonModule, RouterLink, UserTableComponent, UserDialogComponent],
  templateUrl: './users-page-component.html',
  styleUrl: './users-page-component.scss',
})
export class UsersPageComponent {
  private readonly userService = inject(UserService);

  readonly users = this.userService.users;
  readonly dialogVisible = signal(false);
  readonly dialogMode = signal<UserDialogMode>('add');
  readonly selectedUser = signal<User | null>(null);

  openAdd(): void {
    this.dialogMode.set('add');
    this.selectedUser.set(null);
    this.dialogVisible.set(true);
  }

  handleClose(): void {
    this.dialogVisible.set(false);
  }

  handleSave(user: User): void {
    // For now: always add. Next step we’ll differentiate add/edit.
    this.userService.add(user);
    this.dialogVisible.set(false);
  }
}
