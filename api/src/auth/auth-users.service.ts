import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../db/db.service';
import { authUsers } from '../db/schema';

@Injectable()
export class AuthUsersService {
  constructor(private readonly database: DatabaseService) {}

  findByEmail(email: string) {
    return this.database.db.select().from(authUsers).where(eq(authUsers.email, email)).get();
  }

  findById(id: number) {
    return this.database.db.select().from(authUsers).where(eq(authUsers.id, id)).get();
  }

  incrementTokenVersion(id: number) {
    const existing = this.findById(id);
    if (!existing) {
      return null;
    }
    const nextVersion = (existing.tokenVersion ?? 0) + 1;
    this.database.db
      .update(authUsers)
      .set({ tokenVersion: nextVersion })
      .where(eq(authUsers.id, id))
      .run();
    return nextVersion;
  }
}
