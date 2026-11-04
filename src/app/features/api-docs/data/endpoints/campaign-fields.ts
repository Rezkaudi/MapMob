import { ApiErrorCase } from '../../models/api-error-case';
import { field, optionalField } from '../shared-fields';

export const CAMPAIGN_STATUS = 'enum: active | scheduled | paused | expired';
export const SAVED_CAMPAIGN_STATUS = 'enum: active | paused';

export const CAMPAIGN_SUMMARY_FIELDS = [
  field('totalCount', 'integer'),
  field('activeCount', 'integer', 'Running today.'),
  field('scheduledCount', 'integer', 'Starting after today.'),
  field('endedCount', 'integer', 'Expired and paused, counted together.'),
];

export const CAMPAIGN_STATUS_RULES = [
  'status is worked out on the server, never stored as one column: paused if paused; else scheduled if startsOn is after today; else expired if endsOn is before today; else active. "Today" is the Damascus date.',
];

export const RUNNING_RANGE_FIELDS = [
  optionalField(
    'runningFrom',
    'date (yyyy-mm-dd)',
    'Keep campaigns that run on at least one day of the range.',
  ),
  optionalField('runningTo', 'date (yyyy-mm-dd)'),
];

export const NOT_PAUSABLE: ApiErrorCase = {
  status: 409,
  when: 'Pause: the campaign has expired.',
  example: { message: 'Only a running or scheduled campaign can be paused.' },
};

export const NOT_PAUSED: ApiErrorCase = {
  status: 409,
  when: 'Resume: the campaign is not paused.',
  example: { message: 'Only a paused campaign can be resumed.' },
};
