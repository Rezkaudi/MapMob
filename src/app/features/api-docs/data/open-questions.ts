export const OPEN_QUESTIONS: readonly string[] = [
  "Does POST /payments also create or extend the place's subscription? This reference assumes yes, in one transaction.",
  'Does POST /settings/admins email an invite where the new admin sets a password? The dashboard never sends one.',
  'Soft delete for users and places? This reference assumes yes, since reviews, complaints and payments point at them.',
  'Deleting a category, governorate or area that is still in use: this reference says refuse with 409. Is cascade wanted anywhere?',
  'Campaign status: this reference has the server work it out from dates plus paused/draft flags, in Damascus time. Agreed?',
  'Keep one admins table, or reuse users with a role? Either works if the API shapes match.',
  'The roles matrix has no "ads" module, so this reference guards ads with the offers permissions. Add an ads module instead?',
  'Recording a payment needs payments:add, but the roles matrix only offers "view" for payments. Add it?',
  'How does a subscription become paused? The status exists, but no screen pauses one yet.',
  'Where do pending payments come from, and who confirms them? The summary counts them, but no screen confirms one yet.',
  'The admin team page lists admins but cannot change a role, suspend or remove an admin. Add endpoints for that now?',
];
