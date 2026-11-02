import { ApiFeature } from '../../models/api-feature';
import { OWNER_ACCOUNT, OWNER_ACCOUNT_SAVE } from '../examples/owner-examples';
import { PASSWORD_CHANGE } from '../examples/settings-examples';
import { NO_CONTENT, field } from '../shared-fields';

export const OWNER_ACCOUNT_FEATURE: ApiFeature = {
  id: 'owner-account',
  name: 'Place owner account settings',
  app: 'owner',
  screen: '/merchant/settings',
  permissionModule: null,
  intro:
    "The owner changes the name of their own sign-in (place_owner_accounts) and its password. The email is shown but not editable here; only the admin sets it. Signing out needs no call here; it uses the owner's token only.",
  endpoints: [
    {
      id: 'owner-account-read',
      method: 'GET',
      path: '/owner/account',
      summary: "The signed-in owner's own account.",
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
      summary: "Change the signed-in owner's name.",
      body: {
        contentType: 'application/json',
        fields: [field('fullName', 'string', 'Max 100.')],
        example: OWNER_ACCOUNT_SAVE,
      },
      response: { status: 200, description: 'The updated account.', example: OWNER_ACCOUNT },
      notes: ['The owner cannot change the email. The admin sets it on the place form.'],
    },
    {
      id: 'owner-account-password',
      method: 'PUT',
      path: '/owner/account/password',
      summary: "Change the signed-in owner's password.",
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
