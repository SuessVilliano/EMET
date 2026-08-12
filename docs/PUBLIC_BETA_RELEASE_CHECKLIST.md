# EMET Public Beta Release Checklist

This checklist is a release gate. A checked item should be backed by a reproducible test, configured production control, or inspected deployment state. Do not mark assumptions as complete.

## Code quality

- [ ] GitHub Actions CI passes on the exact release commit.
- [ ] ESLint passes with zero errors.
- [ ] TypeScript `tsc --noEmit` passes.
- [ ] `next build` passes using production-compatible environment placeholders.
- [ ] Production dependency audit has no unresolved high or critical vulnerabilities, or each exception is documented with reachability and compensating controls.

## Intelligence data

- [ ] `src/lib/db/intelligence-schema.sql` is applied to the production Supabase project.
- [ ] `src/lib/db/intelligence-hardening.sql` is applied after the base intelligence schema.
- [ ] RLS is confirmed enabled on every intelligence table.
- [ ] No anon/authenticated policies expose internal raw records, facts, signals, source configuration, ingestion runs, or consumer apps.
- [ ] Census source row exists and is active.
- [ ] CMS source row exists and is active only after a stable official dataset ID has been selected and smoke-tested.
- [ ] Census ingestion produces raw records, county entities, fact evidence, and aggregate demographic signals without duplicating logical facts/signals on rerun.
- [ ] Ingestion errors create failed runs; no synthetic source data is substituted.
- [ ] Source URLs never persist Census API keys.

## Secrets and API access

- [ ] `SUPABASE_SERVICE_ROLE_KEY` exists only in server-side deployment secrets.
- [ ] `EMET_INGEST_SECRET` is a unique long random production secret.
- [ ] `EMET_SIGNALS_SECRET` is a different unique long random production secret.
- [ ] `CENSUS_API_KEY` is configured as a server-side secret.
- [ ] AI provider keys are configured server-side and have budget/usage alerts where supported.
- [ ] `/api/intelligence/ingest` rejects missing or invalid bearer tokens.
- [ ] `/api/intelligence/signals` rejects missing or invalid bearer tokens and enforces consumer allowlists.
- [ ] Production edge/WAF rate limiting is enabled for `/api/chat`; the in-process limiter is only a secondary guard.

## Accuracy and user trust

- [ ] No public page presents hard-coded demo people, votes, metrics, products, uploads, or headlines as real activity.
- [ ] Current-event claims require live authoritative evidence before being presented as verified.
- [ ] High-stakes medical, legal, and financial answers clearly distinguish general information from professional advice and require current authoritative verification.
- [ ] AI responses never invent citations or claim that unsourced model output is a verified EMET fact.
- [ ] Aggregate market signals explicitly state they are not individual eligibility, lead-quality, underwriting, or consumer-risk determinations.
- [ ] Every production signal can be traced back to source evidence.

## Public beta scope

- [ ] Chat input/output limits and error handling are smoke-tested.
- [ ] Document upload remains disabled until the complete storage/scanning/parsing/deletion pipeline is production-tested.
- [ ] DAO vote actions and kill-switch execution remain disabled until signature verification and on-chain execution receive a dedicated security review.
- [ ] Community messaging remains disabled until authenticated persistence, moderation, abuse reporting, and rate limiting are implemented.
- [ ] Marketplace remains disabled until seller/listing verification and commercial disclosures are implemented.
- [ ] News/alerts remain empty until source-backed ingestion is live.

## Deployment

- [ ] Production Vercel environment variables are configured.
- [ ] Preview deployment smoke test passes on desktop and mobile.
- [ ] Production domain, TLS, redirects, metadata, and error pages are verified.
- [ ] Production health checks cover chat availability, Supabase access, and intelligence ingestion failure visibility.
- [ ] Rollback path to the previous known-good deployment is documented and tested.

## Go / no-go

Release only when the remaining unchecked items are explicitly classified as either a blocker or an accepted beta limitation. No item involving security, fabricated data, secret exposure, high/critical dependency risk, or misleading claims may be accepted as a beta limitation.
