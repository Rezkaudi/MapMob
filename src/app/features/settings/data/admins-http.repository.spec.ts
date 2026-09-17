import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { AdminsHttpRepository } from './admins-http.repository';

const BASE_URL = 'https://api.test';

describe('AdminsHttpRepository', () => {
  let repository: AdminsHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdminsHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
      ],
    });
    repository = TestBed.inject(AdminsHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('asks for the dashboard admins', () => {
    repository.getAdmins().subscribe();

    http.expectOne({ method: 'GET', url: `${BASE_URL}/settings/admins` }).flush([]);
  });

  it('invites an admin', () => {
    const invitation = { fullName: 'يوسف محمد', email: 'yousef@mapmob.com', roleId: 'role-2' };
    repository.inviteAdmin(invitation).subscribe();

    const request = http.expectOne({ method: 'POST', url: `${BASE_URL}/settings/admins` });
    expect(request.request.body).toEqual(invitation);
    request.flush({});
  });
});
