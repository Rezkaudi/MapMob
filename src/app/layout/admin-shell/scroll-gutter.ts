import { AfterViewInit, Directive, ElementRef, HostListener, inject } from '@angular/core';

export const SCROLL_GUTTER_VARIABLE = '--scroll-gutter';

/** Publishes the width a scroll container loses to its scrollbar, so bars outside it can line up with its content. */
@Directive({ selector: '[appScrollGutter]' })
export class ScrollGutter implements AfterViewInit {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  ngAfterViewInit(): void {
    this.publishGutter();
  }

  @HostListener('window:resize')
  protected publishGutter(): void {
    const scroller = this.elementRef.nativeElement;
    const gutter = scroller.offsetWidth - scroller.clientWidth;
    document.documentElement.style.setProperty(SCROLL_GUTTER_VARIABLE, `${gutter}px`);
  }
}
