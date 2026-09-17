import { FaqQuestion } from './faq-question';

/** What the add and edit question dialogs send. */
export type FaqQuestionDraft = Omit<FaqQuestion, 'id'>;
