# Memory Index

## Project Patterns
- [Test setup helpers](project_test_setup.md) — runMigrations + cleanDatabase from @/test/setup; afterEach cleans, beforeAll migrates
- [Eden Treaty test client pattern](project_eden_treaty.md) — use treaty(app).api.v1 for all route assertions; bracket notation for path params
- [Auth token pattern](project_auth_token.md) — register via treaty client to get real JWT; no manual jwt.sign needed in tests
- [DB seeding pattern](project_db_seeding.md) — import db + schema directly for direct INSERT/UPDATE fixtures in tests
- [mock.module pattern](project_mock_module_pattern.md) — mocking external-dep modules (checker/telegram-bot) + capturing real refs to test a real branch
- [Eden Treaty date auto-parsing gotcha](project_eden_date_parsing.md) — treaty() turns ISO strings into Date; use `{ parseDate: false }` for z.string() date fields
- [Test suite file-split convention](project_test_suite_structure.md) — fixtures/routes/repository/service split, cleanDatabase cascade scope, 422 vs 400/409

## Feedback
- [Eden Treaty error.value vs data](feedback_eden_error_value.md) — non-2xx bodies land in error.value, data is always null on error responses

## Feature Coverage
- [auth feature tests](feature_auth_tests.md) — location and coverage of auth.test.ts
- [time-tracker feature tests](feature_time_tracker_tests.md) — location and full coverage of time-tracker.test.ts
- [permesso feature tests](feature_permesso_tests.md) — getHourInTimeZone unit tests + PUT /permesso/schedule coverage, timezone no-upsert gotcha
- [workout feature tests](feature_workout_tests.md) — repository/service/routes split, day/month boundary + exerciseType-scoping coverage, single-enum-value seeding trick
