import { ApiFeature } from '../../models/api-feature';
import {
  OWNER_STORY,
  OWNER_STORY_EDIT_FORM,
  OWNER_STORY_FORM,
  OWNER_STORY_LIBRARY,
} from '../examples/owner-story-examples';
import { NO_CONTENT, field, optionalField } from '../shared-fields';

const NOT_THEIR_STORY = {
  status: 404,
  when: 'The story does not exist or belongs to another place.',
  example: { message: 'Story not found.' },
};
const FILE_RULES = 'One picture (JPG or PNG, max 5 MB) or one video (any video type, max 50 MB).';
const CAPTION_RULES = 'The short text drawn over the story. Max 120 characters.';

const STORY_FIELDS = [
  field('id', 'string'),
  field(
    'kind',
    'enum: image | video',
    'place_stories.type. The server reads it from the file type.',
  ),
  field('url', 'string (url)', 'place_stories.path.'),
  field(
    'posterUrl',
    'string (url) | null',
    'place_stories.poster_path: a still frame the server cuts from a video. null for pictures, and for a video until the frame is ready.',
  ),
  field('caption', 'string | null', `${CAPTION_RULES} null when the owner wrote none.`),
  field(
    'status',
    'enum: active | expired',
    'active while now is before expiresAt, expired after. The server works it out on every read.',
  ),
  field('publishedAt', 'string (ISO 8601)', 'Shown as "اليوم • 10:30 AM".'),
  field(
    'expiresAt',
    'string (ISO 8601)',
    'Always publishedAt plus 24 hours. The card counts down to it: "متبقي 14 ساعة".',
  ),
  field(
    'viewCount',
    'number',
    'place_stories.view_count: how many app users opened the story. Shown as "348 مشاهدة".',
  ),
];

export const OWNER_STORIES_FEATURE: ApiFeature = {
  id: 'owner-stories',
  name: 'Place owner stories',
  app: 'owner',
  screen: '/merchant/stories',
  permissionModule: null,
  intro:
    'A story is one picture or video, with an optional short text, that the app shows to customers for 24 hours. The owner publishes, edits and deletes the stories of their own place. The screen reads every story in one call and splits them itself into the active list and the expired list, so the list is not paged. The plan caps how many stories may be active at the same time; expired stories take no room.',
  endpoints: [
    {
      id: 'owner-stories-list',
      method: 'GET',
      path: '/owner/stories',
      summary:
        "Every story of the signed-in owner's place, active and expired, with the plan's limit.",
      response: {
        status: 200,
        description: 'One object for the whole screen.',
        example: OWNER_STORY_LIBRARY,
        fields: [
          field('plan', 'object', '{ id, name } of the current subscription.'),
          field(
            'place',
            'object',
            "{ id, name } of the owner's place. The drawer and the delete dialog show the name.",
          ),
          field(
            'activeStoryLimit',
            'number | null',
            'plans.limit_active_stories of the current plan; null = no cap.',
          ),
          field('items[]', 'object[]', 'Newest publishedAt first. The fields below.'),
          ...STORY_FIELDS.map((one) => ({ ...one, name: `items[].${one.name}` })),
        ],
      },
      notes: [
        'The usage card counts active stories against activeStoryLimit. The two tiles count active stories and expired ones.',
        'A story expires by the clock alone. No call ends one early; the owner deletes it instead.',
        'A story an admin has hidden (place_stories.hidden_at) still comes back here, with the status its clock gives it. See the open question on what the owner should be told.',
      ],
    },
    {
      id: 'owner-stories-create',
      method: 'POST',
      path: '/owner/stories',
      summary: 'Publish one story from the "إضافة قصة جديدة" dialog. It goes live at once.',
      body: {
        contentType: 'multipart/form-data',
        fields: [
          field('file', 'file', FILE_RULES),
          optionalField(
            'caption',
            'string',
            `${CAPTION_RULES} Left out when the owner wrote none.`,
          ),
        ],
        example: OWNER_STORY_FORM,
      },
      response: {
        status: 201,
        description: 'The new story, shaped like one of items[] in GET /owner/stories.',
        example: OWNER_STORY,
      },
      errors: [
        {
          status: 422,
          when: 'The place already has activeStoryLimit active stories, the file breaks the rules above, or the caption is over 120 characters.',
          example: { message: 'The current plan allows no more active stories.' },
        },
      ],
      notes: [
        'Set published_at to now, expires_at to now plus 24 hours and view_count to 0.',
        'The screen turns off the add button at the limit, but the server must still refuse with 422.',
      ],
    },
    {
      id: 'owner-stories-update',
      method: 'PUT',
      path: '/owner/stories/{id}',
      summary:
        'Change the text of an active story, and its file if a new one is sent ("تعديل القصة").',
      body: {
        contentType: 'multipart/form-data',
        fields: [
          optionalField('file', 'file', `Left out to keep the saved file. ${FILE_RULES}`),
          optionalField(
            'caption',
            'string',
            `${CAPTION_RULES} Left out to clear the text: the saved caption becomes null.`,
          ),
        ],
        example: OWNER_STORY_EDIT_FORM,
      },
      response: {
        status: 200,
        description: 'The saved story.',
        example: OWNER_STORY,
      },
      errors: [
        NOT_THEIR_STORY,
        {
          status: 422,
          when: 'The story has expired, the file breaks the rules above, or the caption is over 120 characters.',
          example: { message: 'An expired story cannot be edited.' },
        },
      ],
      notes: [
        'Keep id, publishedAt, expiresAt and viewCount: an edit does not restart the 24 hours.',
        'A new file may change kind (a picture for a video). Delete the old stored file and its poster.',
        'PHP does not read multipart bodies on PUT. Parse the body yourself (for example in a middleware).',
      ],
    },
    {
      id: 'owner-stories-delete',
      method: 'DELETE',
      path: '/owner/stories/{id}',
      summary: 'Delete one story, active or expired, after the owner confirms.',
      response: NO_CONTENT,
      errors: [NOT_THEIR_STORY],
      notes: [
        'Also delete the stored file and its poster.',
        'Deleting an active story takes it out of the app at once and frees its room in the plan.',
      ],
    },
  ],
};
