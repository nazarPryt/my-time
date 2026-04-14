# Memory Index

## Project Patterns
- [Test setup helpers](project_test_setup.md) — runMigrations + cleanDatabase from @/test/setup; afterEach cleans, beforeAll migrates
- [Eden Treaty test client pattern](project_eden_treaty.md) — use treaty(app).api.v1 for all route assertions; bracket notation for path params
- [Auth token pattern](project_auth_token.md) — register via treaty client to get real JWT; no manual jwt.sign needed in tests
- [DB seeding pattern](project_db_seeding.md) — import db + schema directly for direct INSERT/UPDATE fixtures in tests

## Feature Coverage
- [auth feature tests](feature_auth_tests.md) — location and coverage of auth.test.ts
- [time-tracker feature tests](feature_time_tracker_tests.md) — location and full coverage of time-tracker.test.ts
