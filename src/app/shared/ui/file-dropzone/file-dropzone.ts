import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

/** `soft` is the place form's zone; `dashed` is the white 2px-dashed card of the offer and ad forms. */
export type DropzoneAppearance = 'soft' | 'dashed';

const ZONE_CLASSES: Record<DropzoneAppearance, { idle: string; dragging: string }> = {
  soft: {
    idle: 'border border-border py-8',
    dragging: 'border border-primary bg-primary-soft py-8',
  },
  dashed: {
    idle: 'border-2 border-[#c0c7d5] bg-white p-8',
    dragging: 'border-2 border-primary bg-primary-soft p-8',
  },
};

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
  readonly isMultiple = input<boolean>(true);
  readonly appearance = input<DropzoneAppearance>('soft');
  readonly filesPicked = output<readonly File[]>();

  protected readonly isDragging = signal(false);
  protected readonly zoneClasses = computed(() => {
    const classes = ZONE_CLASSES[this.appearance()];
    return this.isDragging() ? classes.dragging : classes.idle;
  });

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
