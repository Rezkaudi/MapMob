import { ApiFeature } from '../../models/api-feature';
import {
  ABOUT_FORM,
  ABOUT_PAGE,
  CONTACT_FORM,
  CONTACT_PAGE,
  CONTENT_PAGES,
  FAQ_QUESTION,
  LEGAL_FORM,
  LEGAL_PAGE,
} from '../examples/content-examples';
import { NO_CONTENT, field, optionalField } from '../shared-fields';

const PAGE_META_FIELDS = [
  field('status', 'enum: published | draft'),
  field('updatedAt', 'datetime (ISO 8601)'),
];

const PAGE_STATUS = field(
  'status',
  'enum: published | draft',
  '"حفظ التغييرات" publishes, "حفظ كمسودة" saves a draft.',
);
const HTML_NOTE =
  'HTML from the rich-text editor. Store as is; clean it (allow-list) before the app shows it.';
const LEGAL_KIND = [field('kind', 'enum: terms | privacy', 'One handler serves both pages.')];
const FAQ_FIELDS = [
  field('question', 'string', 'Max 200.'),
  field('answer', 'string (HTML)', HTML_NOTE),
];

const CONTACT_FIELDS = [
  field('title', 'string'),
  field('introduction', 'string (HTML)', HTML_NOTE),
  field('supportPhone', 'string'),
  field('supportEmail', 'string (email)'),
  field(
    'facebookUrl / instagramUrl / telegramUrl / whatsappUrl',
    'string (url) | null',
    'null when not used.',
  ),
];

export const CONTENT_FEATURE: ApiFeature = {
  id: 'content',
  name: 'Content pages',
  app: 'admin',
  screen: '/admin/content',
  permissionModule: 'content',
  intro: 'The fixed pages the mobile app shows: about, terms, privacy, contact and the FAQ.',
  endpoints: [
    {
      id: 'content-pages',
      method: 'GET',
      path: '/content/pages',
      summary: 'The content pages table.',
      response: {
        status: 200,
        description: 'Always all five rows, even for a page never edited.',
        example: CONTENT_PAGES,
        fields: [
          field(
            'kind',
            'enum: about | terms | privacy | contact | faq',
            'The stable key the dashboard routes on.',
          ),
          field('title', 'string'),
          field('updatedAt', 'datetime (ISO 8601)'),
          field('status', 'enum: published | draft'),
        ],
      },
    },
    {
      id: 'content-about-read',
      method: 'GET',
      path: '/content/pages/about',
      summary: 'The about page.',
      response: {
        status: 200,
        description: 'The page.',
        example: ABOUT_PAGE,
        fields: [
          ...PAGE_META_FIELDS,
          field('bannerUrl', 'string (url) | null'),
          field('summary', 'string (HTML)'),
          field('title / phone / email / address', 'string'),
        ],
      },
    },
    {
      id: 'content-about-save',
      method: 'PUT',
      path: '/content/pages/about',
      summary: 'Save the about page. The only content page with a file.',
      body: {
        contentType: 'multipart/form-data',
        fields: [
          field('title', 'string'),
          field('summary', 'string (HTML)', HTML_NOTE),
          field('phone / email / address', 'string'),
          PAGE_STATUS,
          optionalField('banner', 'file (png, jpg, webp; max 5 MB)'),
          field('isBannerRemoved', 'boolean'),
        ],
        example: ABOUT_FORM,
      },
      response: {
        status: 200,
        description: 'The saved page, in the GET shape.',
        example: ABOUT_PAGE,
      },
    },
    {
      id: 'content-legal-read',
      method: 'GET',
      path: '/content/pages/{kind}',
      summary: 'The terms or the privacy policy.',
      pathParams: LEGAL_KIND,
      samplePath: '/content/pages/terms',
      response: {
        status: 200,
        description: 'Title, HTML body, status and updatedAt.',
        example: LEGAL_PAGE,
      },
    },
    {
      id: 'content-legal-save',
      method: 'PUT',
      path: '/content/pages/{kind}',
      summary: 'Save the terms or the privacy policy.',
      pathParams: LEGAL_KIND,
      samplePath: '/content/pages/terms',
      body: {
        contentType: 'application/json',
        fields: [field('title', 'string'), field('body', 'string (HTML)', HTML_NOTE), PAGE_STATUS],
        example: LEGAL_FORM,
      },
      response: { status: 200, description: 'The saved page.', example: LEGAL_PAGE },
    },
    {
      id: 'content-contact-read',
      method: 'GET',
      path: '/content/pages/contact',
      summary: 'The contact page.',
      response: {
        status: 200,
        description: 'The page.',
        example: CONTACT_PAGE,
        fields: [...PAGE_META_FIELDS, ...CONTACT_FIELDS],
      },
    },
    {
      id: 'content-contact-save',
      method: 'PUT',
      path: '/content/pages/contact',
      summary: 'Save the contact page.',
      body: {
        contentType: 'application/json',
        fields: [...CONTACT_FIELDS, PAGE_STATUS],
        example: CONTACT_FORM,
      },
      response: { status: 200, description: 'The saved page.', example: CONTACT_PAGE },
    },
    {
      id: 'content-faq-list',
      method: 'GET',
      path: '/content/faq',
      summary: 'The FAQ, in display order.',
      response: {
        status: 200,
        description: 'The dashboard numbers them by position.',
        example: [FAQ_QUESTION],
      },
    },
    {
      id: 'content-faq-create',
      method: 'POST',
      path: '/content/faq',
      summary: 'Add a question at the end.',
      body: {
        contentType: 'application/json',
        fields: FAQ_FIELDS,
        example: { question: FAQ_QUESTION.question, answer: FAQ_QUESTION.answer },
      },
      response: { status: 201, description: 'The new question.', example: FAQ_QUESTION },
    },
    {
      id: 'content-faq-update',
      method: 'PUT',
      path: '/content/faq/{id}',
      summary: 'Edit a question.',
      body: {
        contentType: 'application/json',
        fields: FAQ_FIELDS,
        example: { question: FAQ_QUESTION.question, answer: FAQ_QUESTION.answer },
      },
      response: { status: 200, description: 'The updated question.', example: FAQ_QUESTION },
    },
    {
      id: 'content-faq-delete',
      method: 'DELETE',
      path: '/content/faq/{id}',
      summary: 'Delete a question.',
      response: NO_CONTENT,
    },
  ],
};
