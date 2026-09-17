import { FaqQuestion } from './faq-question';

/** Which question dialog is open: a blank one to add, or one filled with the question to edit. */
export type FaqDialog =
  | { readonly mode: 'add' }
  | { readonly mode: 'edit'; readonly question: FaqQuestion; readonly number: number };
