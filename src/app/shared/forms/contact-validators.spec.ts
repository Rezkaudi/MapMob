import { FormControl } from '@angular/forms';
import { WEB_ADDRESS_MESSAGE, webAddress } from './contact-validators';

const LEFT_TO_RIGHT_MARK = '‎';

describe('webAddress', () => {
  it('takes a full address and turns down one without its scheme', () => {
    expect(new FormControl('https://docs.google.com/forms', webAddress).valid).toBe(true);
    expect(new FormControl('docs.google.com/forms', webAddress).valid).toBe(false);
  });
});

describe('WEB_ADDRESS_MESSAGE', () => {
  // Without the mark, an RTL line draws the closing "://" on the wrong side: "//:https".
  it('keeps "https://" left to right at the end of the Arabic sentence', () => {
    expect(WEB_ADDRESS_MESSAGE).toBe(`أدخل رابطاً كاملاً يبدأ بـ https://${LEFT_TO_RIGHT_MARK}`);
  });
});
