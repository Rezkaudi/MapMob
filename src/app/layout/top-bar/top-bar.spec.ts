import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TopBar } from './top-bar';

@Component({ imports: [TopBar], template: `<app-top-bar userName="أحمد" userRole="Admin" />` })
class HostComponent {}

describe('TopBar', () => {
  it('shows the signed-in user name and role', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('أحمد');
    expect(text).toContain('Admin');
  });

  it('renders a search field', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input')).toBeTruthy();
  });
});
