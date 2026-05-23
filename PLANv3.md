# 🗺️ Roadmap: My Tracker v3.0 (Smart Progression System)

## 📌 Overview

Version 3.0 transforms the project from a passive CRUD application into an active, smart progression system. The Front-end will be routed into dedicated pages with a heavy focus on UI/UX (Glassmorphism, Global Modals, Toasts). The Back-end (NestJS) will scrape rich data from external APIs (TMDB, RAWG, OpenLibrary) to automate progress calculations (Episodes, Hours, Pages).

---

## 🧹 Pre-Sprint: Codebase Internationalization (i18n)

**Focus:** Translate all remaining Portuguese strings, error messages, and comments in the Back-end to English.

- **Branch:** `chore/backend-english-translation`
  - [x] Translate `NotFoundException` messages in all Services.
  - [x] Translate success messages in all `remove` methods.
  - [x] Translate code comments in DTOs, Services, and Controllers.

---

## 🏗️ Sprint 7: Routing & Global Modal (Front-end)

**Focus:** Decouple the Home page from specific media lists and elevate the Form to a global component for quick additions from any screen.

- **Branch:** `feat/router-setup`
  - [x] Install `react-router-dom`.
  - [x] Create `pages/` folder with: `Movies.tsx`, `Series.tsx`, `Games.tsx`, `Books.tsx`, `Profile.tsx`.
  - [x] Update `App.tsx` to map these protected routes.
- **Branch:** `feat/navbar-navigation`
  - [x] Add navigation links/icons to `Header.tsx`.
- **Branch:** `feat/global-add-modal`
  - [x] Remove `<TrackerForm />` from `Dashboard.tsx`.
  - [x] Transform `<TrackerForm />` into a floating Modal (`backdrop-blur`).
  - [x] Add a "✨ Add New" button in the `Header.tsx` to trigger this Modal globally.

---

## 🧠 Sprint 8: The Smart Back-end (NestJS)

**Focus:** Expand integration Services to fetch deep media details using external IDs, automating total fields.

- **Branch:** `feat/tmdb-deep-integration`
  - [ ] Create `getSeriesDetails(tmdbId)` in `TmdbService` calling the `/tv/{id}` route to extract `number_of_episodes` and `number_of_seasons`.
  - [ ] Update `SeriesService.create` to intercept and fetch these totals before saving to Prisma.
- **Branch:** `feat/rawg-deep-integration`
  - [ ] Create `getGameDetails(rawgId)` in `RawgService` calling the `/games/{id}` route to extract `playtime`.
  - [ ] Update `GamesService.create` to intercept and fetch `hoursPlayed` totals.
- **Branch:** `feat/openlibrary-deep-integration`
  - [ ] Create `getBookDetails(openLibraryId)` in `OpenLibraryService` to extract `number_of_pages` and `author_name`.
  - [ ] Update `BooksService.create` to intercept and fetch these details.

---

## ⚡ Sprint 9: Zero-Friction UX (Front-end)

**Focus:** The user no longer types totals. The system displays dynamic progress and allows quick-click updates.

- **Branch:** `feat/smart-form-cleanup`
  - [ ] Remove "Total Episodes", "Total Hours", and "Total Pages" inputs from `<TrackerForm />` (Back-end handles this now).
  - [ ] Hide category selection if the user opens the Modal from a specific route (e.g., auto-select "Game" if on `/games`).
- **Branch:** `feat/quick-update-buttons`
  - [ ] Add "+1 Episode" or "+10 Pages" quick buttons directly on the `TrackerList` cards.
  - [ ] Trigger silent `PATCH` requests and show success Toasts.
- **Branch:** `feat/completion-review-modal`
  - [ ] Add trigger: If `watched === total`, auto-change status to `FINISHED`.
  - [ ] Open a "Congratulations!" mini-modal asking for the Final Rating and Text Review.

---

## 📊 Sprint 10: Dashboard & Profile (Full Stack)

**Focus:** Utilize the new structured data (reviews, status, platinum) to generate visual reports.

- **Branch:** `feat/trending-dashboard`
  - [ ] Create a "Trending Now" section on the Home page fetching popular endpoints from TMDB/RAWG.
  - [ ] Add charts showing "Completed vs. Abandoned" media.
- **Branch:** `feat/platinum-trophy-ui`
  - [ ] Add an `isPlatinum` checkbox in the Game update form.
  - [ ] Style Platinum game cards with gold borders or glow effects in Tailwind.
- **Branch:** `feat/user-profile-page`
  - [ ] Render user data and macro statistics in `Profile.tsx`.
  - [ ] Display the user's last 5 written reviews.
  - [ ] Layout Refactoring (Mobile-First): Review global alignments, paddings, and the responsiveness of lists, forms, and dashboard charts.
