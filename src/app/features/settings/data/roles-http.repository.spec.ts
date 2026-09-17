import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { RolesHttpRepository } from './roles-http.repository';

const BASE_URL = 'https://api.test';

describe('RolesHttpRepository', () => {
  let repository: RolesHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RolesHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
      ],
    });
    repository = TestBed.inject(RolesHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('asks for the roles', () => {
    repository.getRoles().subscribe();

    http.expectOne({ method: 'GET', url: `${BASE_URL}/settings/roles` }).flush([]);
  });

  const DRAFT = {
    name: 'مشرف عمليات',
    description: '',
    isActive: true,
    grants: ['home:view'],
  } as const;

  it('adds a role', () => {
    repository.addRole(DRAFT).subscribe();

    const request = http.expectOne({ method: 'POST', url: `${BASE_URL}/settings/roles` });
    expect(request.request.body).toEqual(DRAFT);
    request.flush({});
  });

  it('updates a role', () => {
    repository.updateRole('role-2', DRAFT).subscribe();

    const request = http.expectOne({ method: 'PUT', url: `${BASE_URL}/settings/roles/role-2` });
    expect(request.request.body).toEqual(DRAFT);
    request.flush({});
  });

  it('deletes a role', () => {
    repository.deleteRole('role-2').subscribe();

    http.expectOne({ method: 'DELETE', url: `${BASE_URL}/settings/roles/role-2` }).flush(null);
  });
});
