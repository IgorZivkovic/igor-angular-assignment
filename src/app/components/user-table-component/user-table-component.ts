import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-table-component',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './user-table-component.html',
  styleUrl: './user-table-component.scss',
})
export class UserTableComponent {
  @Input({ required: true }) users: User[] = [];
}
