import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _users = signal<User[]>([]);

  readonly users = this._users.asReadonly();

  constructor() {
    // const stored = localStorage.getItem(this.storageKey);
    // if (stored) {
    //   this._users.set(JSON.parse(stored));
    // }
  }

  add(user: User): void {
    this._users.update((users) => [...users, user]);
    // this.persist();
  }

  remove(id: number): void {
    this._users.update((users) => users.filter((u) => u.id !== id));
    // this.persist();
  }

  // private persist(): void {
  //   localStorage.setItem(this.storageKey, JSON.stringify(this._users()));
  // }
}
