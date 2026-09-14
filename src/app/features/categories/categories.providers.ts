import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CategoryHttpRepository } from './data/category-http.repository';
import { CategoryMockDatabase } from './data/category-mock-database';
import { CATEGORY_MOCK_SEED } from './data/category-mock-seed';
import { CategoryMockRepository } from './data/category-mock.repository';
import { CategoryRepository } from './data/category.repository';

/** ⚠ The `useMockApi` branch is temporary — delete it and the mock files once the API exists. */
export function provideCategoriesFeature(): EnvironmentProviders {
  if (!environment.useMockApi) {
    return makeEnvironmentProviders([
      { provide: CategoryRepository, useClass: CategoryHttpRepository },
    ]);
  }
  return makeEnvironmentProviders([
    {
      provide: CategoryMockDatabase,
      useFactory: () => new CategoryMockDatabase(CATEGORY_MOCK_SEED),
    },
    { provide: CategoryRepository, useClass: CategoryMockRepository },
  ]);
}
