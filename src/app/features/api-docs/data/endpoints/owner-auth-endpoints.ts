import { ApiFeature } from '../../models/api-feature';
import {
  NEW_PASSWORD_REQUEST,
  OWNER_SIGN_IN_REQUEST,
  RESET_CODE_CHECK,
  RESET_CODE_REQUEST,
  RESET_GRANT,
  SIGNED_IN_OWNER,
} from '../examples/owner-examples';
import { NO_CONTENT, field } from '../shared-fields';

const TOO_MANY_TRIES = {
  status: 429,
  when: 'More than 5 tries a minute for the same email and IP.',
  example: { message: 'Too many attempts. Please try again in 60 seconds.' },
};

export const OWNER_AUTH_FEATURE: ApiFeature = {
  id: 'owner-auth',
  name: 'Place owner sign-in',
  screen: '/login?role=merchant',
  permissionModule: null,
  intro:
    'The place owner signs in to their own dashboard with an account an admin created when the place was approved. There is no sign-up. A forgotten password is reset in three steps: email → 6-digit code → new password.',
  endpoints: [
    {
      id: 'owner-auth-login',
      method: 'POST',
      path: '/owner/auth/login',
      summary: 'Sign a place owner in.',
      isPublic: true,
      body: {
        contentType: 'application/json',
        fields: [
          field('email', 'string (email)'),
          field('password', 'string', 'Plain text, over HTTPS only.'),
        ],
        example: OWNER_SIGN_IN_REQUEST,
      },
      response: {
        status: 200,
        description: 'The token and who signed in.',
        example: SIGNED_IN_OWNER,
        fields: [
          field('id / name', 'string', 'The owner account. name is shown in the top bar.'),
          field(
            'role',
            'enum: owner',
            'Always "owner". The dashboard opens the owner area for it.',
          ),
          field('avatarUrl', 'string (url) | null'),
          field('token', 'string', 'Sanctum token, scoped to owner calls only.'),
        ],
      },
      errors: [
        {
          status: 401,
          when: 'Wrong email or password, or the account or its place is suspended. Do not say which.',
          example: { message: 'These credentials do not match our records.' },
        },
        TOO_MANY_TRIES,
      ],
      notes: [
        'An admin token must not open owner calls, and an owner token must not open admin calls.',
      ],
    },
    {
      id: 'owner-auth-forgot',
      method: 'POST',
      path: '/owner/auth/password/forgot',
      summary: 'Email a 6-digit reset code.',
      isPublic: true,
      body: {
        contentType: 'application/json',
        fields: [field('email', 'string (email)')],
        example: RESET_CODE_REQUEST,
      },
      response: NO_CONTENT,
      errors: [TOO_MANY_TRIES],
      notes: [
        'Answer 204 for every email, known or not, so nobody can probe for accounts.',
        'The code lives 10 minutes. A new request (the "إعادة إرسال" link) replaces the old code.',
      ],
    },
    {
      id: 'owner-auth-verify-code',
      method: 'POST',
      path: '/owner/auth/password/verify-code',
      summary: 'Trade the emailed code for a one-time reset token.',
      isPublic: true,
      body: {
        contentType: 'application/json',
        fields: [field('email', 'string (email)'), field('code', 'string', 'Exactly 6 digits.')],
        example: RESET_CODE_CHECK,
      },
      response: {
        status: 200,
        description: 'The token that allows one password change.',
        example: RESET_GRANT,
        fields: [field('resetToken', 'string', 'Valid 15 minutes, for one use.')],
      },
      errors: [
        {
          status: 422,
          when: 'The code is wrong or expired. After 5 wrong codes, the code is burnt.',
          example: { message: 'رمز التحقق غير صحيح', errors: { code: ['رمز التحقق غير صحيح'] } },
        },
      ],
    },
    {
      id: 'owner-auth-reset',
      method: 'POST',
      path: '/owner/auth/password/reset',
      summary: 'Set the new password.',
      isPublic: true,
      body: {
        contentType: 'application/json',
        fields: [
          field('resetToken', 'string', 'From verify-code.'),
          field('password', 'string', 'At least 8 characters.'),
        ],
        example: NEW_PASSWORD_REQUEST,
      },
      response: NO_CONTENT,
      errors: [
        {
          status: 422,
          when: 'The reset token is unknown, used or expired, or the password is too short.',
          example: {
            message: 'انتهت صلاحية طلب إعادة التعيين، اطلب رمزاً جديداً',
            errors: { resetToken: ['انتهت صلاحية طلب إعادة التعيين، اطلب رمزاً جديداً'] },
          },
        },
      ],
      notes: [
        'Revoke every token of the account, so old sessions end. The dashboard then shows the login.',
      ],
    },
  ],
};
