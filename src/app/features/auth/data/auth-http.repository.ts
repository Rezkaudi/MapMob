import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { AuthenticatedUser } from '../models/authenticated-user';
import { Credentials } from '../models/credentials';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthHttpRepository implements AuthRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  signIn(credentials: Credentials): Observable<AuthenticatedUser> {
    return this.httpClient.post<AuthenticatedUser>(`${this.apiBaseUrl}/auth/login`, credentials);
  }
}
