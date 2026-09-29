import { buildMediaItem, buildMediaVideo } from '../testing/merchant-media-fixture';
import { buildRemoveMediaCopy } from './media-delete-copy';

describe('buildRemoveMediaCopy', () => {
  it('asks about a picture', () => {
    expect(buildRemoveMediaCopy(buildMediaItem())).toEqual({
      title: 'حذف الصورة',
      question: 'هل أنت متأكد من حذف هذه الصورة؟',
      detail: 'ستختفي من صفحة مكانك، ولا يمكن التراجع عن ذلك.',
      confirmLabel: 'حذف',
      tone: 'danger',
    });
  });

  it('asks about a video', () => {
    const copy = buildRemoveMediaCopy(buildMediaVideo());

    expect(copy.title).toBe('حذف الفيديو');
    expect(copy.question).toBe('هل أنت متأكد من حذف هذا الفيديو؟');
  });

  it('warns that the main picture leaves the place card', () => {
    expect(buildRemoveMediaCopy(buildMediaItem({ isMain: true })).detail).toBe(
      'هذه الصورة الرئيسية لمكانك وستختفي من بطاقة المكان، ولا يمكن التراجع عن ذلك.',
    );
  });
});
