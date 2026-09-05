import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

@Component({
  selector: 'app-file-dropzone',
  imports: [AppIcon],
  templateUrl: './file-dropzone.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileDropzone {
  readonly prompt = input.required<string>();
  readonly hint = input<string>('');
  readonly accept = input<string>('');
  readonly filesPicked = output<readonly File[]>();

  protected readonly isDragging = signal(false);

  protected onPick(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filesPicked.emit(Array.from(input.files ?? []));
    // Clearing lets the same file be picked again straight after removing it.
    input.value = '';
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  protected onDragLeave(event: DragEvent): void {
    const zone = event.currentTarget as HTMLElement;
    const movedTo = event.relatedTarget as Node | null;
    // Moving onto a child still counts as being over the zone.
    if (movedTo && zone.contains(movedTo)) {
      return;
    }
    this.isDragging.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    this.filesPicked.emit(Array.from(event.dataTransfer?.files ?? []));
  }
}
