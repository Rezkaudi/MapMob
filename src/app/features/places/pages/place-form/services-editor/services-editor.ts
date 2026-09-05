import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { AppIcon } from '../../../../../shared/ui/app-icon/app-icon';

@Component({
  selector: 'app-services-editor',
  imports: [AppIcon],
  templateUrl: './services-editor.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesEditor {
  readonly services = input.required<readonly string[]>();
  readonly servicesChange = output<readonly string[]>();

  protected readonly draft = signal('');

  protected add(): void {
    const name = this.draft().trim();
    if (!name || this.services().includes(name)) {
      return;
    }
    this.servicesChange.emit([...this.services(), name]);
    this.draft.set('');
  }

  protected remove(name: string): void {
    this.servicesChange.emit(this.services().filter((service) => service !== name));
  }

  protected onDraftInput(event: Event): void {
    this.draft.set((event.target as HTMLInputElement).value);
  }
}
