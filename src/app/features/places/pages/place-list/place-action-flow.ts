import { computed, signal } from '@angular/core';
import { statusAfter } from '../../../../shared/models/confirm-action';
import { Place } from '../../models/place';
import { PLACE_ACTION_DIALOG, PlaceAction } from './place-action';
import { PlaceActionRequest } from './place-action-request';

/** What the store runs when one of the place dialogs is confirmed. Each resolves `true` once done. */
export interface PlaceWriteActions {
  changeStatus(ids: readonly string[], status: 'active' | 'suspended'): Promise<boolean>;
  deletePlaces(ids: readonly string[]): Promise<boolean>;
  exportPlaces(ids: readonly string[]): Promise<boolean>;
}

/** Which dialog the places table shows, and what confirming it saves. */
export class PlaceActionFlow {
  private readonly request = signal<PlaceActionRequest | null>(null);

  readonly dialog = computed(() => {
    const request = this.request();
    return request ? PLACE_ACTION_DIALOG[request.action] : null;
  });

  /** The row that asked, or how many rows are ticked. */
  readonly note = computed(() => {
    const request = this.request();
    if (!request) {
      return '';
    }
    return request.placeName || `تم تحديد ${request.ids.length} شركات`;
  });

  constructor(private readonly actions: PlaceWriteActions) {}

  askForSelection(action: PlaceAction, ids: readonly string[]): void {
    this.request.set({ action, ids, placeName: '' });
  }

  askForRow(place: Place, action: PlaceAction): void {
    this.request.set({ action, ids: [place.id], placeName: place.name });
  }

  askForStatusChange(place: Place): void {
    this.askForRow(place, place.status === 'active' ? 'suspend' : 'activate');
  }

  close(): void {
    this.request.set(null);
  }

  /** A failed write keeps the dialog open, so the page can say why. */
  async confirm(): Promise<void> {
    const request = this.request();
    if (!request) {
      return;
    }
    if (await this.run(request)) {
      this.close();
    }
  }

  private run(request: PlaceActionRequest): Promise<boolean> {
    if (request.action === 'export') {
      return this.actions.exportPlaces(request.ids);
    }
    if (request.action === 'delete') {
      return this.actions.deletePlaces(request.ids);
    }
    return this.actions.changeStatus(request.ids, statusAfter(request.action));
  }
}
