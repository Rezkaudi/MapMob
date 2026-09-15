import { ActivationStatus } from '../../../shared/models/activation-status';
import { AppUser } from '../models/user';

/** In-memory store behind the mock repository, so status changes and deletes stick. */
export class UserMockDatabase {
  private users: AppUser[];

  constructor(seed: readonly AppUser[]) {
    this.users = [...seed];
  }

  list(): readonly AppUser[] {
    return this.users;
  }

  find(id: string): AppUser {
    const user = this.users.find((candidate) => candidate.id === id);
    if (!user) {
      throw new Error(`لم يتم العثور على المستخدم ${id}`);
    }
    return user;
  }

  setStatus(id: string, status: ActivationStatus): AppUser {
    const updated: AppUser = { ...this.find(id), status };
    this.users = this.users.map((user) => (user.id === id ? updated : user));
    return updated;
  }

  remove(id: string): void {
    this.users = this.users.filter((user) => user.id !== id);
  }
}
