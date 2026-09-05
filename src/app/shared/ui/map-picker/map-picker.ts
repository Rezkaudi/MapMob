import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { MapPoint } from './map-point';

const DEFAULT_ZOOM = 15;
const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION = '&copy; OpenStreetMap';
const MAX_ZOOM = 19;

/** A pin drawn in markup, so no image assets have to be resolved by the bundler. */
const PIN_ICON = L.divIcon({
  className: '',
  html: '<span class="block size-4 rounded-full border-2 border-white bg-primary shadow-md"></span>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

@Component({
  selector: 'app-map-picker',
  templateUrl: './map-picker.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapPicker {
  readonly latitude = input.required<number>();
  readonly longitude = input.required<number>();
  readonly zoom = input<number>(DEFAULT_ZOOM);
  readonly locationPicked = output<MapPoint>();

  private readonly canvas = viewChild.required<ElementRef<HTMLElement>>('canvas');
  private map: L.Map | null = null;
  private marker: L.Marker | null = null;

  constructor() {
    afterNextRender(() => this.createMap());

    effect(() => {
      const point = { latitude: this.latitude(), longitude: this.longitude() };
      this.moveTo(point);
    });

    inject(DestroyRef).onDestroy(() => {
      this.map?.remove();
      this.map = null;
    });
  }

  /** Also called by the map's own click handler. */
  pickPoint(point: MapPoint): void {
    this.moveTo(point);
    this.locationPicked.emit(point);
  }

  /** Centres the map without emitting, for callers that already know the point. */
  moveTo(point: MapPoint): void {
    const position: L.LatLngExpression = [point.latitude, point.longitude];
    this.marker?.setLatLng(position);
    this.map?.panTo(position);
  }

  private createMap(): void {
    const position: L.LatLngExpression = [this.latitude(), this.longitude()];
    this.map = L.map(this.canvas().nativeElement, {
      center: position,
      zoom: this.zoom(),
      attributionControl: true,
    });
    L.tileLayer(TILE_URL, { maxZoom: MAX_ZOOM, attribution: TILE_ATTRIBUTION }).addTo(this.map);
    this.marker = L.marker(position, { icon: PIN_ICON, draggable: true }).addTo(this.map);

    this.map.on('click', (event: L.LeafletMouseEvent) => {
      this.pickPoint({ latitude: event.latlng.lat, longitude: event.latlng.lng });
    });
    this.marker.on('dragend', () => {
      const moved = this.marker?.getLatLng();
      if (moved) {
        this.locationPicked.emit({ latitude: moved.lat, longitude: moved.lng });
      }
    });
  }
}
