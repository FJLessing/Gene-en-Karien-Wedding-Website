# CLAUDE.md

**Always read [AGENTS.md](AGENTS.md) first** — it is the source of truth for this project's
architecture, conventions, and rules. Follow it for every task.

Quick reminders (details in AGENTS.md):

- **Access gate**: the site is gated. To view any page in dev/preview, append `?invite=preview`
  to the URL — see the "Access gate" section in AGENTS.md.
- **Content/i18n**: never hardcode strings; all copy lives in `server/content/en.ts` + `af.ts`.
- **No Tailwind, no `px`**; SCSS tokens/mixins are auto-injected.
