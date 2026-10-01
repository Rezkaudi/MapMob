import { ApiFeature } from '../../models/api-feature';
import { STORY_PAGE, STORY_ROW, STORY_SUMMARY } from '../examples/story-examples';
import {
  NO_CONTENT,
  PAGED_ENVELOPE_FIELDS,
  PAGED_QUERY_FIELDS,
  csvDownload,
  exportQuery,
  field,
  optionalField,
} from '../shared-fields';

const STORY_STATUS = 'enum: active | hidden | expired';
const STATUS_RULE =
  'expired once now is past expiresAt, whatever else is set; before that, hidden while place_stories.hidden_at is set, and active otherwise. The server works it out on every read.';

const STORY_FILTER_FIELDS = [
  ...PAGED_QUERY_FIELDS.filter((one) => one.name !== 'sort'),
  optionalField('status', STORY_STATUS, 'Left out for every status ("الكل").'),
];

const STORY_FIELDS = [
  field('id', 'string'),
  field('place', 'object', '{ id, name } of the place that published it. Shown as "اسم المتجر".'),
  field('kind', 'enum: image | video', 'place_stories.type.'),
  field('url', 'string (url)', 'place_stories.path.'),
  field(
    'posterUrl',
    'string (url) | null',
    'A still frame of a video, drawn as the row thumbnail. null for pictures, and for a video until the frame is ready.',
  ),
  field('caption', 'string | null', 'The short text drawn over the story.'),
  field('status', STORY_STATUS, STATUS_RULE),
  field('publishedAt', 'string (ISO 8601)', 'Shown as "تاريخ النشر".'),
  field('expiresAt', 'string (ISO 8601)', 'Always publishedAt plus 24 hours.'),
  field('viewCount', 'number', 'place_stories.view_count.'),
];

const STORY_NOT_FOUND = {
  status: 404,
  when: 'The story does not exist.',
  example: { message: 'Story not found.' },
};

export const STORIES_FEATURE: ApiFeature = {
  id: 'stories',
  name: 'Stories',
  app: 'admin',
  screen: '/admin/stories',
  permissionModule: 'places',
  intro:
    'The stories every place has published (place_stories), in one table for the admins. An admin can look at a story, hide one that is still running so the app stops showing it, show it again, delete it, and export the table. Admins do not publish or edit stories; place owners do that on /owner/stories.',
  endpoints: [
    {
      id: 'stories-list',
      method: 'GET',
      path: '/stories',
      summary: 'The paged stories table, four rows a page.',
      queryParams: STORY_FILTER_FIELDS,
      response: {
        status: 200,
        description: 'One page, newest publishedAt first.',
        example: STORY_PAGE,
        fields: [
          ...PAGED_ENVELOPE_FIELDS,
          ...STORY_FIELDS.map((one) => ({ ...one, name: `items[].${one.name}` })),
        ],
      },
      notes: [
        'search matches the place name.',
        'The table has no sort control, so no sort param is sent.',
      ],
    },
    {
      id: 'stories-summary',
      method: 'GET',
      path: '/stories/summary',
      summary: 'The four cards above the table and the counts on the status chips.',
      response: {
        status: 200,
        description: 'Counted over every story, whatever the table filters.',
        example: STORY_SUMMARY,
        fields: [
          field('storyCount', 'integer', 'Every story. The "الكل" chip and the first card.'),
          field('activeCount', 'integer', 'Stories with status active.'),
          field('hiddenCount', 'integer', 'Stories with status hidden. A chip only, no card.'),
          field('expiredCount', 'integer', 'Stories with status expired.'),
          field('viewCount', 'integer', 'view_count of every story added up.'),
        ],
      },
      notes: ['activeCount + hiddenCount + expiredCount always equals storyCount.'],
    },
    {
      id: 'stories-visibility',
      method: 'PATCH',
      path: '/stories/{id}/visibility',
      summary:
        'Hide a running story from the app ("إخفاء القصة"), or show it again ("إظهار القصة").',
      body: {
        contentType: 'application/json',
        fields: [
          field(
            'isHidden',
            'boolean',
            'true sets place_stories.hidden_at to now; false clears it.',
          ),
        ],
        example: { isHidden: true },
      },
      response: {
        status: 200,
        description: 'The updated story, as a table row.',
        example: { ...STORY_ROW, status: 'hidden' },
      },
      errors: [
        STORY_NOT_FOUND,
        {
          status: 422,
          when: 'The story has expired.',
          example: { message: 'An expired story cannot be hidden or shown.' },
        },
      ],
      notes: [
        'The customer app must leave out every story whose hidden_at is set.',
        'Hiding does not stop the clock: expiresAt stays, and a story shown again runs only for the time it has left.',
        'Sending the value a story already has is not an error; answer 200 with the story.',
      ],
    },
    {
      id: 'stories-delete',
      method: 'DELETE',
      path: '/stories/{id}',
      summary: 'Delete one story, whatever its status, after the admin confirms.',
      response: NO_CONTENT,
      errors: [STORY_NOT_FOUND],
      notes: ['Also delete the stored file and its poster. This cannot be undone.'],
    },
    {
      id: 'stories-export',
      method: 'GET',
      path: '/stories/export',
      summary: 'Download the filtered stories table as CSV.',
      queryParams: [
        ...exportQuery(STORY_FILTER_FIELDS),
        optionalField(
          'ids[]',
          'string[] (repeated field)',
          'The ticked rows, sent as ids[]=4&ids[]=9. When present, export only these stories and ignore the filters.',
        ),
      ],
      response: csvDownload('story'),
      notes: [
        'Columns: place name, caption, kind, publishedAt, expiresAt, view count, status.',
        'Send Content-Disposition: attachment. UTF-8 with a BOM so Excel shows Arabic.',
      ],
    },
  ],
};
