import { buildUser } from '../testing/user-fixture';
import { buildUserConfirmCopy } from './user-dialog-copy';

const AHMAD = buildUser();

describe('buildUserConfirmCopy', () => {
  it('words suspending an account as a danger', () => {
    expect(buildUserConfirmCopy('suspend', AHMAD)).toEqual({
      title: 'إيقاف الحساب',
      question: 'هل أنت متأكد من إيقاف حساب أحمد جمال؟',
      detail: 'لن يتمكن المستخدم من استخدام التطبيق حتى تتم إعادة تفعيله.',
      confirmLabel: 'إيقاف الحساب',
      tone: 'danger',
    });
  });

  it('words activating an account as a success', () => {
    const copy = buildUserConfirmCopy('activate', AHMAD);

    expect(copy.title).toBe('تفعيل الحساب');
    expect(copy.question).toBe('هل تريد تفعيل حساب أحمد جمال؟');
    expect(copy.tone).toBe('success');
  });

  it('warns that a delete cannot be undone', () => {
    const copy = buildUserConfirmCopy('delete', AHMAD);

    expect(copy.title).toBe('حذف المستخدم');
    expect(copy.detail).toContain('لا يمكن التراجع');
    expect(copy.tone).toBe('danger');
  });
});
