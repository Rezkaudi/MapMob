# End-to-end tests

Browser and API tests that check the dashboard and the backend work together.
No test code yet: this folder holds the plan and the layout.

## Test cases

| File | What is inside |
|---|---|
| `test-cases/MapMob-E2E-Admin-ar.pdf` | 582 cases for the admin dashboard |
| `test-cases/MapMob-E2E-Merchant-ar.pdf` | 270 cases for the merchant dashboard |

Each case has a fixed id, like `A-PLC-10` or `M-STORY-02`. Put that id in the
test name, so a failing test points to its row in the PDF.

## Folders

| Folder | Holds |
|---|---|
| `admin/` | Tests that run in the admin dashboard, one file per feature |
| `merchant/` | Tests that run in the merchant dashboard, one file per feature |
| `mobile-api/` | Calls that act as the mobile app (`/api/...`), used by other tests |
| `cross-app/` | Flows that need two sessions: admin and merchant, or app and dashboard |
| `support/` | Sign-in sessions, test data makers, page objects |

## Case kinds

| Kind in the PDF | How to run it |
|---|---|
| واجهة | Browser test |
| API | Direct request, no browser |
| جوال ← لوحة | API call as the mobile app, then read the dashboard |
| مدير ↔ تاجر | Two sessions in one test |
| أرقام ومنطق | Read a number before and after, compare the change |

## Before writing tests

- Install Playwright. It is not a dependency yet.
- Get a staging server. Never run write tests on the live server.
- See the last page of each PDF for the full list.
