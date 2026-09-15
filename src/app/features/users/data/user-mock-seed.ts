import { createSeededRandom, pickOne, randomInt } from '../../../../mock/random';
import { AppUser } from '../models/user';

const DAY_MS = 86_400_000;
const MINUTE_MS = 60_000;
const OLDEST_REGISTRATION_DAYS = 720;
const NEWEST_REGISTRATION_SHARE = 0.12;
const RECENT_REGISTRATION_DAYS = 29;
const VISITOR_SHARE = 0.2;
const SUSPENDED_SHARE = 0.14;
const RECENTLY_ACTIVE_SHARE = 0.35;
const MAX_RECENT_MINUTES = 90;
const MAX_IDLE_DAYS = 20;

interface PersonSeed {
  readonly name: string;
  readonly emailName: string;
}

const PEOPLE: readonly PersonSeed[] = [
  { name: 'أحمد جمال', emailName: 'ahmad' },
  { name: 'سارة محمود', emailName: 'sara' },
  { name: 'خالد إبراهيم', emailName: 'khaled' },
  { name: 'منى عبد الله', emailName: 'mona' },
  { name: 'يوسف علي', emailName: 'yousef' },
  { name: 'هدى سالم', emailName: 'huda' },
  { name: 'رامي حداد', emailName: 'rami' },
  { name: 'ليلى نصار', emailName: 'layla' },
];
const SAMPLE_REGISTRATION_DAYS = 13;
const SAMPLE_IDLE_MINUTES = 10;

/** The person the design's detail frame shows, so `/users/user-1` reads like the frame. */
function buildDesignSampleUser(now: Date): AppUser {
  return {
    id: 'user-1',
    name: 'أحمد جمال',
    email: 'ahmad@example.com',
    phone: '+966 50 123 4567',
    accountType: 'registered',
    governorateName: 'طرطوس',
    registeredAt: new Date(now.getTime() - SAMPLE_REGISTRATION_DAYS * DAY_MS).toISOString(),
    lastActiveAt: new Date(now.getTime() - SAMPLE_IDLE_MINUTES * MINUTE_MS).toISOString(),
    status: 'active',
  };
}

const GOVERNORATES = ['طرطوس', 'دمشق', 'حلب', 'حمص', 'اللاذقية', 'حماة'];

function buildUser(index: number, now: Date): AppUser {
  const next = createSeededRandom(index + 1);
  const person = pickOne(next, PEOPLE);
  const isVisitor = next() < VISITOR_SHARE;
  const registrationDays =
    next() < NEWEST_REGISTRATION_SHARE
      ? randomInt(next, 0, RECENT_REGISTRATION_DAYS)
      : randomInt(next, RECENT_REGISTRATION_DAYS + 1, OLDEST_REGISTRATION_DAYS);
  const registeredAt = now.getTime() - registrationDays * DAY_MS - randomInt(next, 0, DAY_MS - 1);
  const idleMs =
    next() < RECENTLY_ACTIVE_SHARE
      ? randomInt(next, 1, MAX_RECENT_MINUTES) * MINUTE_MS
      : randomInt(next, 1, MAX_IDLE_DAYS) * DAY_MS;
  return {
    id: `user-${index + 1}`,
    name: person.name,
    email: isVisitor ? null : `${person.emailName}${index + 1}@email.com`,
    phone: isVisitor
      ? null
      : `+966 5${randomInt(next, 0, 9)} ${randomInt(next, 100, 999)} ${randomInt(next, 1000, 9999)}`,
    accountType: isVisitor ? 'visitor' : 'registered',
    governorateName: pickOne(next, GOVERNORATES),
    registeredAt: new Date(registeredAt).toISOString(),
    lastActiveAt: new Date(Math.max(registeredAt, now.getTime() - idleMs)).toISOString(),
    status: next() < SUSPENDED_SHARE ? 'suspended' : 'active',
  };
}

/** Deterministic users placed in time relative to `now`, so "new" and "last active" stay meaningful. */
export function buildUserSeed(now: Date, userCount: number): AppUser[] {
  return Array.from({ length: userCount }, (_, index) =>
    index === 0 ? buildDesignSampleUser(now) : buildUser(index, now),
  );
}
