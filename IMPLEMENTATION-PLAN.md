# Gene + Karien Wedding Website

We are building a mobile-first wedding website for a couple called Gene Stoltz and Carien De Kock
using Nuxt 4, Vue and GSAP. The website will be hosted on GCP and code will be stored in a private
GitHub repository. The website will be designed to be responsive and accessible, and will include
features such as a countdown timer, RSVP form, and Google Drive linked photo gallery where users can
upload their photos.

## Stack

The stack is Nuxt 4 (Vue 3, `app/` srcDir) with GSAP for the frontend, and SCSS for styling. Wherever
possible SCSS classes and tokens will be generated for elements in the design.

RSVPs will be stored in Google Sheets for easy access and management by the couple. This is the flow
of data:

```
Guest submits form → Nuxt API route → Google Sheets API → new row appended
```

The site will allow users to upload their photos directly to a shared folder, which will then, after
moderation, be displayed on the website using a `.env` file constant.

The following structure outlines the tech stack for the site and the RSVP responses:

```
RSVPs:    Nuxt API route → Google Sheets API       (clients review in Sheets)
Photos:   Nuxt API route → GCP Cloud Storage       (fast, cheap)
                         → Drive sync (optional)   (clients review in Drive)
Auth gate: URL param, checked in Nuxt middleware
Hosting:  GCP Cloud Run
```

Code will be stored in a GitHub repository.

## Design

The design will be done as a mobile-first experience, as users will access the links via messages.
The design is done in Figma, use the MCP to browse:
https://www.figma.com/design/CjzRkjDCORCg7vu2PhW1OI/Genie-San---Krienie-San?node-id=14-343&m=dev

**NOTE** The design is not approved yet and is a work in progress. Any implementation should refrain
from hardcoding.

### Design tokens (pulled from Figma)

| Token | Value |
|---|---|
| Black | `#4A4A4A` |
| Grey | `#8A8A8A` |
| Light Grey | `#CBCBCB` |
| Gold | `#C5B39A` |
| Light Gold 1 | `#E8DED0` |
| Light Gold 2 | `#F4EFE7` |
| Body font | Poppins (Light) |
| Display/script font | Bagien (Regular) |
| Embossed | Neumorphic dual drop/inner shadow |

Tone: elegant, timeless and measured, with a touch of playfulness. Colour scheme: soft and romantic,
pastel colours with metallic (gold) accents.

## User Stories

The following user journeys outline the structure of the site, which should act and feel like a SPA.

### Story 1 - Access

> **Status: Done.** URL-param gate + password fallback fully implemented. `EnvelopeGate.vue` runs the GSAP hinge animation; `auth-gate.global.ts` guards all routes; `/api/auth` verifies the password server-side.

The website should load quickly and be responsive on all devices.

**Scenario:** User has the URL parameter pre-populated

- Users access the website by visiting the URL shared with them in a link.
- This link has a pre-configured URL parameter, read by the server.
- A GSAP animation shows of an envelope opening.
- The site content is loaded from the server and rendered, explaining the story of the couple and the
  details of the wedding.

**Scenario:** User accesses the site without a URL parameter

- Users access the website by visiting the URL without any parameters.
- A GSAP animation shows of an envelope opening.
- The open envelope has a text entry box with a placeholder saying "Password".
- Users enter the password and hit submit; the website checks the password against a value stored in
  an environment variable on the server.
- If correct, the website content is loaded and rendered.
- If incorrect, an error message is displayed and the user is prompted to try again.

### Story 2 - Browsing the site

> **Status: Structure done; content in review.** All 9 sections are implemented (`HeroSection`, `CountdownTimer`, `WelcomeSection`, `DetailsSection`, `ProgramSection`, `DressCodeSection`, `VenueSection`, `AreaActivitiesSection`, `FaqSection`) plus `RsvpCta` and `AppFooter`. Program tabs (Fri/Sat/Sun), venue modals, accommodation modal, area-activity modals, and FAQ accordion are all wired. Copy served from `/api/content` — awaiting sign-off. Hero and activity images still placeholder.

- Users navigate through the different sections: story of the couple, wedding details, RSVP form, and
  photo gallery.
- Responsive and accessible on any device.
- GSAP animations enhance the experience.
- Visually appealing and easy to read, with clear typography and a consistent colour scheme.
- Vertically scrolling the landing page reveals:
  - A title with an image of the venue
  - An image of the couple
  - A countdown timer with a vertical roll animation, like
    [this example](https://dribbble.com/shots/25810567-Countdown-Timer-New-Update-Release) or
    [this example](https://www.framer.com/marketplace/components/tymr/)
  - An intro paragraph welcoming users to the site
  - A content block with subtle animations outlining the date, location, and RSVP date
  - A CTA for the RSVP form
  - A program section with three animated timeline tabs that vary between animating and fading in
    content from off-screen in different directions. Each timeline item has a time, an icon, and a
    short description with a line between each item. Tabs: Friday, Saturday, Sunday.
  - A section outlining the dress code
  - Collapsible venue information:
    - An accommodation booking link that opens a modal outlining the booking details
    - A venue activities section with activities displayed in blocks with images
    - A button to download the venue map
    - Contact details for the venue
  - Collapsible area-activity information:
    - Each activity animates in details and a link in a modal
    - The user taps a close button, or outside the modal, to close it
  - An FAQ section presented as an accordion, with contact details for the bride at the bottom
  - An RSVP button
  - A footer section

### Story 3 - RSVP

> **Status: Done; credentials pending.** Full 4-step flow (`RsvpSearch` → `RsvpAttendChoice` → `RsvpForm` → `RsvpConfirm`) implemented. fuse.js fuzzy search, multi-entry (add another guest), meal/dietary/arrival-day/song-request fields all wired. `rsvp-store` handles state. `/api/rsvp` appends to Sheets via `server/utils/sheets.ts` — real Google service account credentials not yet configured.

**Scenario:** Successful RSVP for attendance

- A user taps a CTA button to RSVP.
- They search for their name under the title "I am RSVPing for:".
- After 3 characters, a fuzzy search runs for their name.
- They select their name and move on.
- They choose between "Yes, can't wait!" and "Unfortunately I won't be able to."
- On the positive option they fill in: Name, Email Address, Phone Number, meal-preference dropdown,
  dietary-requirements dropdown, arrival-day dropdown (Friday/Saturday), and a song-request input.
- They can Add another guest or confirm using the "RSVP" button.
- For a partner, the completed RSVP is shown and the same searchable form is filled in.
- On completion they see a confirmation and an option to upload photo(s) of the couple.

**Scenario:** Unsuccessful RSVP for attendance

- Same search flow.
- If the name is not found, an error is shown and they retry.
- If found, they select it and choose attendance.
- On the negative option they see a confirmation ("Thank you for letting us know") and an option to
  upload photo(s).

### Story 4 - Photo Gallery

> **Status: Skeleton done; gallery grid pending.** `PhotoUpload.vue` + `/api/photos` → GCS pipeline implemented (`server/utils/storage.ts` stubbed). `gallery.vue` page exists. Date-gated unlock logic and moderated gallery grid rendering not yet built.

- On the wedding weekend a section of the website unlocks, allowing users to upload photos to a shared
  Google Drive folder, which are then displayed on the website in a gallery format.

## Implementation Details and packages

- Fuzzy search in the RSVP form uses `fuse.js` on the client side.
- The countdown timer is a **custom GSAP component** (a bespoke vertical roll animation per the
  Dribbble/Framer references). `vue-countdown` is intentionally **not** used — it cannot produce the
  required roll animation. Timer state is driven by GSAP plus a small composable.
- Animations use `GSAP` throughout.
- Form handling and API routes use Nuxt's built-in server routes to handle submissions and interact
  with the Google Sheets API (RSVPs) and GCP Cloud Storage (photo uploads).
- Every page change or content load is animated with a pulsing logo and some movement
  (https://www.figma.com/design/CjzRkjDCORCg7vu2PhW1OI/Genie-San---Krienie-San?node-id=17-491&m=dev).
- Tone: elegant, timeless and measured, with a touch of playfulness.
- Colour scheme: soft and romantic, pastel colours with metallic accents.

## Architecture conventions

This project follows the `fj-vue` conventions adapted for Nuxt:

- 2-tab indentation, semicolons, no `var`, minimise `any`, enums over string literals.
- Components `PascalCase`; `.ts` files `kebab-case`; assets `snake_case`.
- Pinia **Options Store** pattern with `isLoading`/`error` and `acceptHMRUpdate`.
- `<style scoped lang="scss">` for components; global SCSS in `app/assets/scss/`.
- No Tailwind. No pixel units — use `rem`/`em`/`%`/`vh`/`dvh`.
- All client API calls go through a static `ApiService` (a `$fetch` wrapper returning a `Result`).
- Content is served from `/api/content` and consumed via a content store — **never hardcoded**.
- Auth is a URL-param/password gate in middleware (no user login, no cookies).
