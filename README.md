# QuickQuote

QuickQuote is a web app for creating and managing estimates/quotes, originally developed in Lovable and being migrated to independent hosting.

## Migration status

This branch is an in-progress migration, not a production-ready release. Build and tests have not yet been run successfully in an independent environment. Payment integration, environment configuration, public assets, SEO URLs, and deployment still require verification.

## Environment variables

Use `.env.example` as a checklist. Copy it to `.env` locally and enter values from the correct Supabase and Stripe projects. Never commit `.env` or expose Stripe secret keys in browser variables.

## Development

Install dependencies using the package manager selected for this project, then run:

- `npm run dev` to start Vite
- `npm run build` to test a production build
- `npm test` to run Vitest

The dependency lockfile and clean installation workflow still need to be established as part of the migration.

## Branding

QuickQuote — by ReplyToolsLab.
