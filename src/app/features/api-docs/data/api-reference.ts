import { InjectionToken } from '@angular/core';
import { ApiReference } from '../models/api-reference';
import { API_CONVENTIONS } from './api-conventions';
import { API_FEATURES } from './api-features';
import { BUILD_ORDER } from './build-order';
import { DATABASE_DOMAINS } from './database-domains';
import { OPEN_QUESTIONS } from './open-questions';
import { WHOLE_ERD_LAYOUT } from './whole-erd-layout';

export const MAPMOB_API_REFERENCE: ApiReference = {
  title: 'MapMob API — Backend Reference',
  updatedOn: '2026-09-29',
  conventions: API_CONVENTIONS,
  features: API_FEATURES,
  domains: DATABASE_DOMAINS,
  wholeErdLayout: WHOLE_ERD_LAYOUT,
  buildOrder: BUILD_ORDER,
  openQuestions: OPEN_QUESTIONS,
};

/** A token so specs can hand the page a small reference. */
export const API_REFERENCE = new InjectionToken<ApiReference>('API_REFERENCE', {
  providedIn: 'root',
  factory: () => MAPMOB_API_REFERENCE,
});
