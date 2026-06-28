# Deployment

How to deploy this site to **Google Cloud Run** in the **South Africa (Johannesburg)**
region, on the custom domain **`www.gene-en-karien-trou.co.za`**.

## Why this setup

- This is a **Nuxt 4 SSR app** (not static) — it has live server endpoints for the password
  gate (`/api/auth`), RSVP → Google Sheets (`/api/rsvp`), and photo uploads → Google Cloud
  Storage (`/api/photos`). It needs a server runtime.
- **Cloud Run** is the original design target (`nuxt.config.ts`, `.env.example`), already uses
  the same Google service account as Sheets + GCS, has no small request-body limit (32 MB, so
  photo uploads work), and **scales to zero** — for ~200 guests it runs inside the free tier.
- **Region `africa-south1`** (Johannesburg) keeps latency low for SA guests.
- **Custom domain via Cloudflare (free):** Cloud Run's built-in domain mapping is *not*
  available in `africa-south1`, so we put the free Cloudflare proxy in front (it has a
  Johannesburg edge, free managed SSL, and caches static assets). A Google Load Balancer is
  the native alternative but costs ~$18/month — see [Alternative](#alternative-google-load-balancer).

**Expected cost:** hosting ≈ **R0/month** at this traffic. Only recurring cost is the
`.co.za` domain (~R80–R130/year).

---

## Prerequisites

- `gcloud` CLI installed and logged in (`gcloud auth login`).
- The existing Google Cloud **project** that holds the RSVP Google Sheet and the GCS photo
  bucket, with **billing enabled**.
- The service-account **email** and **private key** already used for Sheets/GCS (the values
  from your local `.env`).
- A GitHub repo (already have one) — optional, only needed for auto-deploy (step 7).

---

## One-time: add two files to the repo

### `Dockerfile` (repo root)

Bun builds (the repo's lockfile is `bun.lock`); Node runs the Nitro output.

```dockerfile
# ---- build ----
FROM oven/bun:1 AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build            # nuxt build → .output/ (node-server preset)

# ---- runtime ----
FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.output ./.output
ENV PORT=8080
EXPOSE 8080
CMD ["node", ".output/server/index.mjs"]
```

### `.dockerignore` (repo root)

```
node_modules
.nuxt
.output
.git
.env
*.log
```

---

## Step 1 — Select project and enable APIs

```bash
gcloud config set project <YOUR_PROJECT_ID>

gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com
```

## Step 2 — Store the secrets

The site password and the Google private key are sensitive (and the key is multi-line), so
put them in Secret Manager rather than plain env vars.

```bash
# Site password (the one guests type if they don't use an ?invite= link)
printf 'YOUR_REAL_PASSWORD' | gcloud secrets create NUXT_SITE_PASSWORD --data-file=-

# Service-account private key — paste the PEM with REAL newlines into key.pem first,
# then run this (delete key.pem afterwards):
gcloud secrets create NUXT_GOOGLE_PRIVATE_KEY --data-file=key.pem
```

> The app already converts `\n` escapes in the key (`sheets.ts`, `storage.ts`), so either
> real newlines or `\n`-escaped text works.

## Step 3 — Deploy to `africa-south1`

Run from the repo root (Cloud Build picks up the `Dockerfile`):

```bash
gcloud run deploy gene-karien-trou \
  --source . \
  --region africa-south1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --set-secrets "NUXT_SITE_PASSWORD=NUXT_SITE_PASSWORD:latest,NUXT_GOOGLE_PRIVATE_KEY=NUXT_GOOGLE_PRIVATE_KEY:latest" \
  --set-env-vars "NUXT_PUBLIC_ACCESS_PARAM=invite,NUXT_GOOGLE_SERVICE_ACCOUNT_EMAIL=<sa-email>,NUXT_GOOGLE_SHEET_ID=<sheet-id>,NUXT_GCS_PROJECT_ID=<project-id>,NUXT_GCS_BUCKET=<bucket-name>"
```

Notes:
- `--allow-unauthenticated` is correct — the site is public; access is gated at the **app**
  layer (password / `?invite=`), not by Cloud Run IAM.
- Add the optional gallery vars if/when used: `NUXT_PUBLIC_GALLERY_FOLDER_URL`,
  `NUXT_PUBLIC_GALLERY_UNLOCK_DATE`.
- The command prints a **Service URL** like `https://gene-karien-trou-xxxxxxxx-bq.a.run.app`.
  Keep it — you need its hostname in step 6.

## Step 4 — Smoke-test the Cloud Run URL

```bash
# Replace with your real *.run.app URL
open "https://gene-karien-trou-xxxxxxxx-bq.a.run.app/?invite=preview"
```

- Page renders with `?invite=preview` → the build and gate work.
- Without the param, submitting the real password unlocks → `NUXT_SITE_PASSWORD` is wired.
- Submit a test RSVP → a new row appears in the Google Sheet.
- Upload a photo → the object appears in the GCS bucket under `uploads/`.

> **GCS public images:** `storage.ts` returns `blob.publicUrl()`. For those links to load,
> the bucket must allow public reads — grant `roles/storage.objectViewer` to `allUsers` on
> the bucket (uniform bucket-level access). Put the bucket in `africa-south1` too.

## Step 5 — Register the domain

`.co.za` is **not** sold by Cloudflare or Vercel — buy it from a South African registrar:

| Registrar | ~Price/yr | Notes |
|---|---|---|
| **Afrihost** | ~R85 | Good panel, instant, reliable. Recommended. |
| **Xneelo (Hetzner SA)** | ~R95 | Very reliable DNS control. |
| **domains.co.za** | ~R75 | Cheapest. |

Register the apex **`gene-en-karien-trou.co.za`**. `www` is added as a DNS record in step 6.

## Step 6 — Custom domain via Cloudflare (free)

1. Create a free **Cloudflare** account → **Add a site** → `gene-en-karien-trou.co.za`
   (Free plan).
2. Cloudflare shows two **nameservers**. Log in at your registrar (step 5) and replace the
   domain's nameservers with Cloudflare's. (Propagation: minutes–hours.)
3. In **Cloudflare → DNS**, add a record:
   - Type `CNAME`, Name `www`, Target = your run.app **hostname** (no `https://`), e.g.
     `gene-karien-trou-xxxxxxxx-bq.a.run.app`, **Proxy status: Proxied** (orange cloud).
4. In **Cloudflare → SSL/TLS → Overview**, set encryption mode to **Full (strict)**.
5. **Critical step (avoids a 404):** Cloud Run rejects requests whose `Host` isn't its own
   domain. Override it: **Cloudflare → Rules → Origin Rules → Create rule**:
   - When: *Hostname* equals `www.gene-en-karien-trou.co.za`
   - Then: **Rewrite to → Host header** = your run.app hostname
     (`gene-karien-trou-xxxxxxxx-bq.a.run.app`).
6. Redirect the apex to `www`: **Rules → Redirect Rules → Create**:
   - When: *Hostname* equals `gene-en-karien-trou.co.za`
   - Then: *Static* redirect → `https://www.gene-en-karien-trou.co.za` (301, preserve
     path/query). (Cloudflare auto-creates a proxied apex record for the redirect.)

Cloudflare issues a free managed certificate automatically. Once active, the site is live at
`https://www.gene-en-karien-trou.co.za`.

## Step 7 — (Optional) auto-deploy on git push

Since the code is on GitHub, add a **Cloud Build trigger** on push to `master` so deploys are
automatic. Not required — re-running the `gcloud run deploy --source .` from step 3 is enough
for occasional updates.

---

## Final verification checklist

- [ ] `https://www.gene-en-karien-trou.co.za` loads with a valid certificate.
- [ ] `https://gene-en-karien-trou.co.za` (apex) redirects to `www`.
- [ ] Password gate accepts the real password; `?invite=preview` bypasses it.
- [ ] A test RSVP writes a row to the Google Sheet and marks the guest RSVP'd.
- [ ] A photo upload lands in the GCS bucket and its public URL loads.

---

## Updating the site later

```bash
gcloud run deploy gene-karien-trou --source . --region africa-south1
```

(Env vars/secrets persist across deploys; only re-pass them if they change.)

---

## Caveats

- **Photo upload size:** Cloud Run caps a single request at **32 MB**. Individual phone
  photos are fine; uploading many large photos in one request could exceed it. If guests hit
  this, the robust fix is **signed direct-to-GCS upload URLs** (client uploads straight to the
  bucket, bypassing the function) — a future change to `server/api/photos.post.ts` plus the
  client uploader. Not needed for launch.

## Alternative: Google Load Balancer

If you prefer to stay fully inside Google Cloud instead of Cloudflare, use a **global external
Application Load Balancer** with a serverless NEG pointing at the `africa-south1` Cloud Run
service and a Google-managed SSL certificate. It works in any region but its forwarding rule
costs **~$18/month** — the only part of this setup that isn't free — so Cloudflare is
recommended for a short-lived wedding site.
