import { ChangeDetectionStrategy, Component, HostBinding, input } from '@angular/core';

export type SkeletonShape = 'rect' | 'text' | 'circle';

const SHAPE_CLASSES: Record<SkeletonShape, string> = {
  rect: 'rounded-lg',
  text: 'rounded-md',
  circle: 'rounded-full',
};

const DEFAULT_HEIGHT = '1rem';

/** A grey shimmering block that stands in for content while it loads. */
@Component({
  selector: 'app-skeleton',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Skeleton {
  readonly width = input<string>('100%');
  readonly height = input<string>(DEFAULT_HEIGHT);
  readonly shape = input<SkeletonShape>('rect');

  @HostBinding('attr.aria-hidden') protected readonly isHiddenFromScreenReaders = 'true';

  @HostBinding('class') protected get classes(): string {
    return `app-skeleton block ${SHAPE_CLASSES[this.shape()]}`;
  }

  @HostBinding('style.width') protected get styleWidth(): string {
    return this.width();
  }

  @HostBinding('style.height') protected get styleHeight(): string {
    return this.height();
  }
}
