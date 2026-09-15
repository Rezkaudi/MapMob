import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NEVER, of, throwError } from 'rxjs';
import { CLOCK } from '../../../../core/config/clock';
import { UserRepository } from '../../data/user.repository';
import { buildUserDetail } from '../../testing/user-fixture';
import { UserDetailPage } from './user-detail';

function render(repository: Partial<UserRepository>) {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: UserRepository, useValue: repository },
      { provide: CLOCK, useValue: () => new Date('2024-01-14T00:10:00.000Z') },
    ],
  });
  const fixture = TestBed.createComponent(UserDetailPage);
  fixture.componentRef.setInput('id', 'user-1');
  fixture.detectChanges();
  return fixture;
}

describe('UserDetail page', () => {
  it('shows the breadcrumb, header and every section of the user', () => {
    const element = render({ getUserDetail: () => of(buildUserDetail()) })
      .nativeElement as HTMLElement;
    const breadcrumb = element.querySelector('nav[aria-label="مسار التنقل"]') as HTMLElement;

    expect(breadcrumb.querySelector('a')?.getAttribute('href')).toBe('/users');
    expect(breadcrumb.textContent).toContain('تفاصيل المستخدم');
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('تفاصيل المستخدم');
    for (const words of [
      'عرض وتحليل ملف المستخدم وسجل النشاط على المنصة.',
      'أحمد جمال',
      'عمليات البحث',
      'النشاط الأخير على المنصة',
      'الأماكن المفضلة',
      'التقييمات والمراجعات المضافة',
    ]) {
      expect(element.textContent).toContain(words);
    }
  });

  it('draws a placeholder while the user loads', () => {
    const element = render({ getUserDetail: () => NEVER }).nativeElement as HTMLElement;

    expect(element.querySelector('app-user-detail-skeleton')).toBeTruthy();
  });

  it('offers a retry when the user cannot be loaded', () => {
    let loads = 0;
    const fixture = render({
      getUserDetail: () => {
        loads += 1;
        return throwError(() => new Error('لم يتم العثور على المستخدم'));
      },
    });
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('لم يتم العثور على المستخدم');
    (element.querySelector('app-error-state button') as HTMLButtonElement).click();
    expect(loads).toBe(2);
  });
});
