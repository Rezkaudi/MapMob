import { buildEndpoint, buildFeature } from '../testing/api-docs-fixture';
import { endpointMarkdown } from './markdown-endpoint';

const endpoint = buildEndpoint({
  id: 'places-detail',
  method: 'PATCH',
  path: '/places/{id}/status',
  summary: 'Toggle one place.',
  queryParams: [{ name: 'search', type: 'string', isRequired: false, description: 'Free text.' }],
  body: {
    contentType: 'application/json',
    fields: [
      { name: 'status', type: 'enum: active | suspended', isRequired: true, description: '' },
    ],
    example: { status: 'suspended' },
  },
  response: { status: 200, description: 'The updated place.', example: { id: '12' } },
  notes: ['Works today.'],
});
const markdown = endpointMarkdown(buildFeature(), endpoint);

describe('endpointMarkdown', () => {
  it('opens with an anchor and the method and path', () => {
    expect(
      markdown.startsWith('<a id="places-detail"></a>\n\n#### `PATCH /places/{id}/status`'),
    ).toBe(true);
  });

  it('states the permission and the screen that calls it', () => {
    expect(markdown).toContain('**Permission:** `places:edit`');
    expect(markdown).toContain('**Called from:** `/places`');
    expect(markdown).not.toContain('**Status:**');
  });

  it('lists the path, query and body fields in tables', () => {
    expect(markdown).toContain('**Path parameters**');
    expect(markdown).toContain('| `id` | string | yes | The record id. |');
    expect(markdown).toContain('| `search` | string | no | Free text. |');
    expect(markdown).toContain('**Request body** (`application/json`)');
    expect(markdown).toContain('| `status` | enum: active \\| suspended | yes | — |');
  });

  it('shows the request and the response as pretty JSON', () => {
    expect(markdown).toContain('```json\n{\n  "status": "suspended"\n}\n```');
    expect(markdown).toContain('**Response** `200` — The updated place.');
    expect(markdown).toContain('```json\n{\n  "id": "12"\n}\n```');
  });

  it('adds a cURL sample', () => {
    expect(markdown).toContain('```bash\ncurl -X PATCH "$API_BASE_URL/places/12/status"');
  });

  it('lists the errors and the notes', () => {
    expect(markdown).toContain('| 404 |');
    expect(markdown).toContain('| 422 |');
    expect(markdown).toContain('- Works today.');
  });

  it('says so when the body is empty', () => {
    const deleted = endpointMarkdown(
      buildFeature(),
      buildEndpoint({ method: 'DELETE', response: { status: 204, description: 'Done.' } }),
    );

    expect(deleted).toContain('**Response** `204` — Done.');
    expect(deleted).not.toContain('```json');
  });
});
