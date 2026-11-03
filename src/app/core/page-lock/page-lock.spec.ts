import { TestBed } from '@angular/core/testing';
import { PageLock } from './page-lock';

describe('PageLock', () => {
  let pageLock: PageLock;

  beforeEach(() => {
    pageLock = TestBed.inject(PageLock);
  });

  it('is idle at the start', () => {
    expect(pageLock.isBusy()).toBe(false);
  });

  it('stays busy until every started write has finished', () => {
    pageLock.start();
    pageLock.start();
    pageLock.finish();

    expect(pageLock.isBusy()).toBe(true);

    pageLock.finish();

    expect(pageLock.isBusy()).toBe(false);
  });

  it('never counts below zero', () => {
    pageLock.finish();
    pageLock.start();

    expect(pageLock.isBusy()).toBe(true);
  });
});
