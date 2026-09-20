import { ActivationStatus } from '../../../shared/models/activation-status';
import { Place } from '../models/place';

/** In-memory store behind the mock repository, so status changes and deletes stick. */
export class PlaceMockDatabase {
  private places: Place[];

  constructor(seed: readonly Place[]) {
    this.places = [...seed];
  }

  list(): readonly Place[] {
    return this.places;
  }

  find(id: string): Place {
    const place = this.places.find((candidate) => candidate.id === id);
    if (!place) {
      throw new Error(`لم يتم العثور على المكان ${id}`);
    }
    return place;
  }

  setStatus(ids: readonly string[], status: ActivationStatus): void {
    this.requireAll(ids);
    const wanted = new Set(ids);
    this.places = this.places.map((place) => (wanted.has(place.id) ? { ...place, status } : place));
  }

  remove(ids: readonly string[]): void {
    this.requireAll(ids);
    const wanted = new Set(ids);
    this.places = this.places.filter((place) => !wanted.has(place.id));
  }

  private requireAll(ids: readonly string[]): void {
    for (const id of ids) {
      this.find(id);
    }
  }
}
