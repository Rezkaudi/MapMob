import { ApiFeature } from '../../models/api-feature';
import { OWNER_ACCOUNT } from '../examples/owner-examples';
import { PASSWORD_CHANGE } from '../examples/settings-examples';
import { NO_CONTENT, field } from '../shared-fields';

const OWNER_ONLY = 'The owner of the signed-in account.';

export const OWNER_ACCOUNT_FEATURE: ApiFeature = {
  id: 'owner-account',
  name: 'Place owner account settings',
  screen: '/merchant/settings',
  permissionModule: null,
  intro:
    "The owner changes the name and email of their own sign-in (place_owner_accounts) and its password. Signing out needs no call here; it uses the owner's token only.",
  endpoints: [
    {
      id: 'owner-account-read',
      method: 'GET',
      path: '/owner/account',
      summary: "The signed-in owner's own account.",
      permission: OWNER_ONLY,
      response: {
        status: 200,
        description: 'The account.',
        example: OWNER_ACCOUNT,
        fields: [
          field('fullName', 'string', 'place_owner_accounts.name.'),
          field('email', 'string (email)'),
        ],
      },
    },
    {
      id: 'owner-account-save',
      method: 'PUT',
      path: '/owner/account',
      summary: "Change the signed-in owner's name and email.",
      permission: OWNER_ONLY,
      body: {
        contentType: 'application/json',
        fields: [
          field('fullName', 'string', 'Max 100.'),
          field('email', 'string (email)', 'Unique among owner accounts.'),
        ],
        example: OWNER_ACCOUNT,
      },
      response: { status: 200, description: 'The updated account.', example: OWNER_ACCOUNT },
      errors: [
        {
          status: 422,
          when: 'The email is taken by another owner account.',
          example: { message: 'The email has already been taken.', errors: { email: ['taken'] } },
        },
      ],
    },
    {
      id: 'owner-account-password',
      method: 'PUT',
      path: '/owner/account/password',
      summary: "Change the signed-in owner's password.",
      permission: OWNER_ONLY,
      body: {
        contentType: 'application/json',
        fields: [
          field('currentPassword', 'string', 'Checked on the server.'),
          field('newPassword', 'string', 'At least 8 characters.'),
        ],
        example: PASSWORD_CHANGE,
      },
      response: NO_CONTENT,
      notes: [
        'A wrong currentPassword is a 422 with the error on "currentPassword", so the form shows it under that input.',
        "Revoke the owner's other tokens.",
      ],
    },
  ],
};
