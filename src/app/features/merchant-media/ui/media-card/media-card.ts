import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { ActionMenu } from '../../../../shared/ui/action-menu/action-menu';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { MediaCardView } from '../../models/media-card-view';

/** One picture or video of the gallery, with its replace/delete menu. */
@Component({
  selector: 'app-media-card',
  imports: [ActionMenu, AppIcon],
  templateUrl: './media-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaCard {
  readonly card = input.required<MediaCardView>();
  readonly replaceFile = output<File>();
  readonly remove = output<void>();

  private readonly replacePicker =
    viewChild.required<ElementRef<HTMLInputElement>>('replacePicker');

  protected openReplacePicker(): void {
    this.replacePicker().nativeElement.click();
  }

  protected onReplacePicked(event: Event): void {
    const picker = event.target as HTMLInputElement;
    const [file] = Array.from(picker.files ?? []);
    // Clearing lets the same file be picked again after a refused try.
    picker.value = '';
    if (file) {
      this.replaceFile.emit(file);
    }
  }
}
