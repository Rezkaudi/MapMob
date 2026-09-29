import { ApiFeature } from '../../models/api-feature';
import {
  OWNER_MEDIA_FORM,
  OWNER_MEDIA_LIBRARY,
  OWNER_MEDIA_PICTURE,
  OWNER_MEDIA_REPLACE_FORM,
} from '../examples/owner-media-examples';
import { NO_CONTENT, field } from '../shared-fields';

const OWNER_ONLY = 'The owner of the signed-in account; scoped to their own place.';
const NOT_THEIR_MEDIA = {
  status: 404,
  when: 'The file does not exist or belongs to another place.',
  example: { message: 'Media not found.' },
};
const FILE_RULES = 'image: JPG or PNG, max 5 MB. video: any video type, max 50 MB.';

const MEDIA_FIELDS = [
  field('id', 'string'),
  field('kind', 'enum: image | video', 'place_media.type.'),
  field('url', 'string (url)', 'place_media.path.'),
  field(
    'posterUrl',
    'string (url) | null',
    'place_media.poster_path: a still frame the server cuts from a video. null for pictures, and for a video until the frame is ready.',
  ),
  field('mimeType', 'string', 'e.g. image/jpeg. The card writes it as "JPG".'),
  field('sizeBytes', 'number', 'The card writes it as "2.4 MB".'),
  field('isMain', 'boolean', 'The picture the place card shows first. At most one per place.'),
  field('createdAt', 'string (ISO 8601)', 'Shown as "أضيف في 12 سبتمبر 2026".'),
];

export const OWNER_MEDIA_FEATURE: ApiFeature = {
  id: 'owner-media',
  name: 'Place owner media',
  screen: '/merchant/media',
  permissionModule: null,
  intro:
    "The owner adds, replaces and deletes the pictures and videos of their own place's gallery. The screen reads every file in one call and filters and counts them itself, so the list is not paged. The plan caps pictures and videos apart; the screen shows the two caps added up as one number.",
  endpoints: [
    {
      id: 'owner-media-list',
      method: 'GET',
      path: '/owner/media',
      summary:
        "Every picture and video of the signed-in owner's place, with the plan's two limits.",
      permission: OWNER_ONLY,
      response: {
        status: 200,
        description: 'One object for the whole screen.',
        example: OWNER_MEDIA_LIBRARY,
        fields: [
          field('plan', 'object', '{ id, name } of the current subscription.'),
          field(
            'imageLimit',
            'number | null',
            'plans.limit_gallery_images of the current plan; null = no cap.',
          ),
          field(
            'videoLimit',
            'number | null',
            'plans.limit_videos of the current plan; null = no cap.',
          ),
          field('items[]', 'object[]', 'In place_media.sort_order. The fields below.'),
          ...MEDIA_FIELDS.map((one) => ({ ...one, name: `items[].${one.name}` })),
        ],
      },
    },
    {
      id: 'owner-media-create',
      method: 'POST',
      path: '/owner/media',
      summary: 'Add one picture or video from the "إضافة وسائط" dialog.',
      permission: OWNER_ONLY,
      body: {
        contentType: 'multipart/form-data',
        fields: [
          field('kind', 'enum: image | video'),
          field('file', 'file', FILE_RULES),
          field(
            'isMain',
            'boolean',
            'Pictures only; the screen sends false for a video. true also clears is_main on every other file of the place.',
          ),
        ],
        example: OWNER_MEDIA_FORM,
      },
      response: {
        status: 201,
        description: 'The new file, shaped like one of items[] in GET /owner/media.',
        example: OWNER_MEDIA_PICTURE,
      },
      errors: [
        {
          status: 422,
          when: 'The place already has imageLimit pictures (or videoLimit videos), or the file breaks the rules above.',
          example: { message: 'The current plan allows no more videos.' },
        },
      ],
      notes: [
        'The screen turns off a kind at its limit, but the server must still refuse with 422.',
        'Put the new file last in sort_order.',
      ],
    },
    {
      id: 'owner-media-replace',
      method: 'PUT',
      path: '/owner/media/{id}',
      summary: 'Swap the file of one picture or video, from the card menu ("استبدال الصورة").',
      permission: OWNER_ONLY,
      body: {
        contentType: 'multipart/form-data',
        fields: [field('file', 'file', `Same kind as the one it replaces. ${FILE_RULES}`)],
        example: OWNER_MEDIA_REPLACE_FORM,
      },
      response: {
        status: 200,
        description: 'The saved file with its new url, size and type.',
        example: OWNER_MEDIA_PICTURE,
      },
      errors: [
        NOT_THEIR_MEDIA,
        {
          status: 422,
          when: 'The file is not of the same kind, or breaks the rules above.',
          example: { message: 'A picture can only be replaced by a picture.' },
        },
      ],
      notes: [
        'Keep id, kind, isMain, sort_order and createdAt. Delete the old stored file (and poster).',
        'PHP does not read multipart bodies on PUT. Parse the body yourself (for example in a middleware).',
      ],
    },
    {
      id: 'owner-media-delete',
      method: 'DELETE',
      path: '/owner/media/{id}',
      summary: 'Delete one picture or video after the owner confirms.',
      permission: OWNER_ONLY,
      response: NO_CONTENT,
      errors: [NOT_THEIR_MEDIA],
      notes: [
        'Also delete the stored file and its poster.',
        'Deleting the main picture leaves the place with none; the place card then shows its first remaining picture.',
      ],
    },
  ],
};
