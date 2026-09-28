import { AccountRepository } from '../../settings/data/account.repository';

/** The store owner's own account; the settings route serves it as the page's AccountRepository. */
export abstract class OwnerAccountRepository extends AccountRepository {}
