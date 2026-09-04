import { Observable } from 'rxjs';
import { AuthenticatedUser } from '../models/authenticated-user';
import { Credentials } from '../models/credentials';

export abstract class AuthRepository {
  abstract signIn(credentials: Credentials): Observable<AuthenticatedUser>;
}
