import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Observable, catchError, of, pipe, switchMap, tap } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { PlatformSettingsRepository } from '../data/platform-settings.repository';
import { CurrencySettings } from '../models/currency-settings';
import { LanguageSettings } from '../models/language-settings';
import { MapSettings } from '../models/map-settings';
import { PlatformGeneralDraft } from '../models/platform-general-draft';
import { PlatformSettings, PlatformSettingsForm } from '../models/platform-settings';
import { withFormSaveStatus } from './with-form-save-status';

interface PlatformSettingsState {
  readonly settings: PlatformSettings | null;
}

const initialState: PlatformSettingsState = { settings: null };

export const PlatformSettingsStore = signalStore(
  withState(initialState),
  withRequestStatus(),
  withFormSaveStatus<PlatformSettingsForm>(),
  withMethods((store, repository = inject(PlatformSettingsRepository)) => {
    const saveGroup = <K extends PlatformSettingsForm>(
      group: K,
      request: Observable<PlatformSettings[K]>,
    ) =>
      store.saveForm(
        group,
        request.pipe(
          tap((value) => {
            const settings = store.settings();
            if (settings) {
              patchState(store, { settings: { ...settings, [group]: value } });
            }
          }),
        ),
      );

    return {
      loadSettings: rxMethod<void>(
        pipe(
          tap(() => store.setLoading()),
          switchMap(() =>
            repository.getSettings().pipe(
              tap((settings) => {
                patchState(store, { settings });
                store.setLoaded();
              }),
              catchError((error: Error) => {
                store.setError(error.message);
                return of(null);
              }),
            ),
          ),
        ),
      ),
      saveGeneral: (draft: PlatformGeneralDraft) =>
        saveGroup('general', repository.updateGeneral(draft)),
      saveMap: (map: MapSettings) => saveGroup('map', repository.updateMap(map)),
      saveLanguage: (language: LanguageSettings) =>
        saveGroup('language', repository.updateLanguage(language)),
      saveCurrency: (currency: CurrencySettings) =>
        saveGroup('currency', repository.updateCurrency(currency)),
    };
  }),
);
