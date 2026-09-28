import { DOCUMENT, Injectable, inject } from '@angular/core';
import { SectionTop, activeSectionAt } from './active-section';

/** How far below the top of the scroll box a section counts as being read. */
const READING_LINE = 280;
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/** The page scrolls inside its own box, so the router's anchor scrolling cannot reach it. */
@Injectable({ providedIn: 'root' })
export class SectionScroller {
  private readonly document = inject(DOCUMENT);

  scrollTo(id: string): void {
    const prefersLessMotion = this.document.defaultView?.matchMedia?.(REDUCED_MOTION_QUERY).matches;
    this.document.getElementById(id)?.scrollIntoView({
      behavior: prefersLessMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  }

  /** A bare `#id` would resolve against `<base href="/">` and point at the app root. */
  linkTo(id: string): string {
    const location = this.document.defaultView?.location;
    return `${location?.pathname ?? ''}${location?.search ?? ''}#${id}`;
  }

  /** Changes the address without a navigation, so the open card can be linked. */
  replaceHash(id: string): void {
    const view = this.document.defaultView;
    view?.history.replaceState(view.history.state, '', this.linkTo(id));
  }

  activeSectionIn(ids: readonly string[], isAtEnd = false): string | null {
    const tops: SectionTop[] = ids.flatMap((id) => {
      const element = this.document.getElementById(id);
      return element ? [{ id, top: element.getBoundingClientRect().top }] : [];
    });
    return activeSectionAt(tops, READING_LINE, isAtEnd);
  }
}
