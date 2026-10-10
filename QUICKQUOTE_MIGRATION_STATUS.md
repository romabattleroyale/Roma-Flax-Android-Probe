# QuickQuote migration status

This branch is an in-progress migration and is not production-ready.

## Verified blockers

- The root route imports `src/lib/lovable-error-reporting.ts`, which is missing from this branch.
- Payment server functions and the payment webhook route are missing from this branch.
- `src/lib/stripe.server.ts` still uses the Lovable Stripe gateway and requires `LOVABLE_API_KEY`.
- Supabase session storage and setup messaging still include preview-specific behavior.
- SEO metadata uses the old Lovable-hosted domain; a final public domain has not yet been set.
- PWA manifest icon paths refer to files not present in this branch.
- There is no dependency lockfile and no successful independent production build or test run has been verified.

## Required before deployment

1. Restore and review missing source files from the original app.
2. Replace the Lovable Stripe gateway with direct Stripe SDK access while preserving test/live separation, authenticated checkout, billing portal, and signed webhook handling.
3. Verify Supabase authentication, session persistence, admin-only server access, and database policies.
4. Restore required public assets and ensure manifest icon paths exist.
5. Update canonical URLs, robots.txt, and sitemap.xml after the final domain is selected.
6. Generate a lockfile and run clean install, lint, tests, and production build.
7. Test sign-in, quote creation, Stripe test checkout, billing portal, and subscription webhook updates before production deployment.

Never commit `.env` files or expose Stripe secret keys in browser variables. QuickQuote branding: by ReplyToolsLab.
