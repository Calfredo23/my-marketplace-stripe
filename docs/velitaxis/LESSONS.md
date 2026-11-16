# LESSONS

## LESSON-0001 — Reviewer notes never go in the public repo

- Scope: ACTIVE
- Trigger: creating or editing any reviewer-facing note under `submission/`.
- Root cause: I treated submission notes as project documentation and committed them to a public repo in Test 2.
- Guard: reviewer notes stay in chat or a local ignored file. `/submission/*.md` is gitignored.

## LESSON-0002 — Show the real failure reason

- Scope: ACTIVE
- Trigger: a photo upload, listing insert, or message insert fails.
- Root cause: generic errors hide whether the bucket, policy, schema, file type, or network caused the failure.
- Guard: map common Supabase errors to plain language and include the original message for unknown failures.
