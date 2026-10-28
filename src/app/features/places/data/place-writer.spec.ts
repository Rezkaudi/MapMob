import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  TestRequest,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { CLOCK } from '../../../core/config/clock';
import { LIVE_GOLD_PLAN } from '../../../shared/testing/live-plan-fixture';
import { LIVE_PLACE_FORM_OPTIONS } from '../testing/live-place-choices-fixture';
import { buildPlaceSaveRequest } from '../testing/place-save-request-fixture';
import { toPlaceFormChoices } from './live-place-choices';
import { OWNER_LOGIN_NOT_SAVED_MESSAGE, PlaceWriter } from './place-writer';

const ADMIN_URL = 'https://api.test/admin';
const STORE_URL = `${ADMIN_URL}/stores/52`;
const CHOICES = toPlaceFormChoices(LIVE_PLACE_FORM_OPTIONS, []);
const NEW_PICTURE = new File(['x'], 'a.jpg', { type: 'image/jpeg' });

describe('PlaceWriter', () => {
  let writer: PlaceWriter;
  let http: HttpTestingController;

  function next(method: string, url: string, answer: object = {}): TestRequest {
    const request = http.expectOne({ method, url });
    request.flush(answer);
    return request;
  }

  function answerWeek(): TestRequest[] {
    return Array.from({ length: 7 }, () => {
      const request = http.expectOne((candidate) =>
        candidate.url.startsWith(`${STORE_URL}/working-hours`),
      );
      request.flush({});
      return request;
    });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PlaceWriter,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'https://api.test' },
        { provide: CLOCK, useValue: () => new Date(2026, 9, 14, 12) },
      ],
    });
    writer = TestBed.inject(PlaceWriter);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('creates the store, then its week, pictures, products, links and plan, one after another', async () => {
    const request = buildPlaceSaveRequest({
      value: {
        ...buildPlaceSaveRequest().value,
        package: 'premium',
        deliveryLinks: [{ platformId: '3', isEnabled: true, storeUrl: 'https://t.com/a' }],
      },
      images: [{ id: 'n', name: 'a.jpg', sizeInBytes: 1, file: NEW_PICTURE, previewUrl: 'blob:a' }],
      products: [
        {
          id: 'abcdefgh-1',
          name: 'بانادول',
          price: 10,
          currency: 'SYP',
          imageUrl: '',
          isAvailable: true,
          orderUrl: '',
          imageFile: null,
        },
      ],
    });
    const saved = firstValueFrom(writer.save(null, request, CHOICES, [LIVE_GOLD_PLAN]));

    const store = next('POST', `${ADMIN_URL}/stores`, { data: { id: '52' } });
    expect((store.request.body as FormData).get('mainCategoryId')).toBe('8');
    const week = answerWeek();
    expect(week.every((call) => call.request.method === 'POST')).toBe(true);
    expect(week[0].request.url).toBe(`${STORE_URL}/working-hours`);
    const media = next('POST', `${STORE_URL}/media`, { data: { id: 1 } });
    expect((media.request.body as FormData).get('type')).toBe('image');
    const product = next('POST', `${ADMIN_URL}/products`, { data: { id: 3 } });
    expect((product.request.body as FormData).get('category_id')).toBe('8');
    const link = next('POST', `${STORE_URL}/delivery-links`, { data: { id: '4' } });
    expect(link.request.body.delivery_platform_id).toBe('3');
    const plan = next('POST', `${ADMIN_URL}/subscriptions`, { data: { id: 9 } });
    expect(plan.request.body).toEqual({
      store_id: '52',
      plan_id: 1,
      starts_at: '2026-10-14 00:00:00',
      ends_at: '2026-11-13 23:59:59',
      status: 'active',
      auto_renew: false,
    });

    expect(await saved).toBe('52');
  });

  it('on an edit, updates what exists, adds what is new and deletes what was removed', async () => {
    const request = buildPlaceSaveRequest({
      value: {
        ...buildPlaceSaveRequest().value,
        deliveryLinks: [{ platformId: '1', isEnabled: false, storeUrl: 'https://x.com' }],
      },
      images: [
        {
          id: 's',
          name: 'old',
          sizeInBytes: 0,
          file: null,
          previewUrl: 'https://api.test/m/1.jpg',
        },
      ],
      products: [
        {
          id: '3',
          name: 'بانادول',
          price: 12,
          currency: 'SYP',
          imageUrl: '',
          isAvailable: true,
          orderUrl: '',
          imageFile: null,
        },
      ],
      previousPackage: 'free',
    });
    const saved = firstValueFrom(writer.save('52', request, CHOICES, [LIVE_GOLD_PLAN]));

    const store = next('POST', STORE_URL, { data: { id: '52' } });
    expect((store.request.body as FormData).get('_method')).toBe('PUT');
    next('GET', `${STORE_URL}/working-hours`, {
      data: [{ id: 30, day_of_week: 0 }],
    });
    const week = answerWeek();
    expect(
      week.filter((call) => call.request.url === `${STORE_URL}/working-hours/30`),
    ).toHaveLength(1);
    next('GET', `${STORE_URL}/media`, {
      data: [
        { id: 1, type: 'image', url: 'https://api.test/m/1.jpg' },
        { id: 2, type: 'image', url: 'https://api.test/m/2.jpg' },
      ],
    });
    next('DELETE', `${STORE_URL}/media/2`);
    http
      .expectOne((candidate) => candidate.url === `${ADMIN_URL}/products`)
      .flush({
        data: [
          { id: 3, store_id: 52 },
          { id: 4, store_id: 52 },
          { id: 5, store_id: 1 },
        ],
      });
    const update = next('POST', `${ADMIN_URL}/products/3`);
    expect((update.request.body as FormData).get('_method')).toBe('PUT');
    next('DELETE', `${ADMIN_URL}/products/4`);
    next('GET', `${STORE_URL}/delivery-links`, { data: [{ id: '7', deliveryPlatformId: '1' }] });
    next('DELETE', `${STORE_URL}/delivery-links/7`);

    expect(await saved).toBe('52');
  });

  describe('when the merchant login changes on an edit', () => {
    const savedOwner = { name: 'أحمد', phone: '0931111111', email: 'owner@example.com' };
    const request = buildPlaceSaveRequest({
      value: { ...buildPlaceSaveRequest().value, ownerEmail: 'new@example.com', ownerPassword: '' },
      previousOwner: savedOwner,
    });

    it('sends the new email with the store', async () => {
      const saved = firstValueFrom(writer.save('52', request, CHOICES, []));
      const store = http.expectOne({ method: 'POST', url: STORE_URL });

      expect((store.request.body as FormData).get('ownerEmail')).toBe('new@example.com');
      store.flush({}, { status: 500, statusText: 'Server Error' });
      await expect(saved).rejects.toThrow(OWNER_LOGIN_NOT_SAVED_MESSAGE);
    });

    it('says which fields to put back when the server refuses the change', () => {
      expect(OWNER_LOGIN_NOT_SAVED_MESSAGE).toContain('بيانات دخول التاجر');
      expect(OWNER_LOGIN_NOT_SAVED_MESSAGE).toContain('أعد');
    });

    it('keeps the server words when it rejects the values themselves, such as a used email', async () => {
      const saved = firstValueFrom(writer.save('52', request, CHOICES, []));
      http
        .expectOne({ method: 'POST', url: STORE_URL })
        .flush({ message: 'taken' }, { status: 422, statusText: 'Unprocessable' });

      await expect(saved).rejects.toMatchObject({ status: 422 });
    });
  });

  it('keeps the plain server error on an edit that leaves the login alone', async () => {
    const request = buildPlaceSaveRequest({
      value: { ...buildPlaceSaveRequest().value, ownerPassword: '' },
      previousOwner: { name: 'أحمد', phone: '0931111111', email: 'owner@example.com' },
    });
    const saved = firstValueFrom(writer.save('52', request, CHOICES, []));
    http
      .expectOne({ method: 'POST', url: STORE_URL })
      .flush({}, { status: 500, statusText: 'Server Error' });

    await expect(saved).rejects.not.toThrow(OWNER_LOGIN_NOT_SAVED_MESSAGE);
  });
});
