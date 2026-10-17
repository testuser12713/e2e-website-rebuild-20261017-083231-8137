# Design — Project Identity

> This document is project-long-lived. Tokens are not changed without
> the Architect's approval. Developers MUST use these tokens
> instead of improvising their own colors/spacings.

## Style Direction

Warm editorial "literary journal" look: paper-toned cream background, ink-dark serif quotations with oversized terracotta quote marks, soft white cards with hairline borders, pill chips and a calm sticky tag rail — modern, quiet and much more refined than the original Bootstrap page, while keeping its structure exactly.

## Colors

- `--color-bg`: **#faf7f2**
- `--color-surface`: **#ffffff**
- `--color-surface-sunken`: **#f2ece1**
- `--color-fg`: **#1b1917**
- `--color-fg-muted`: **#6b635c**
- `--color-fg-subtle`: **#9c948a**
- `--color-accent`: **#b0492b**
- `--color-accent-hover`: **#983d22**
- `--color-accent-active`: **#7f321b**
- `--color-accent-soft`: **#f7e9e2**
- `--color-border`: **#e4ddd2**
- `--color-border-strong`: **#cfc6b8**
- `--color-chip-bg`: **#efe8dd**
- `--color-chip-fg`: **#5c554d**
- `--color-quote-mark`: **#dcd2c3**
- `--color-on-accent`: **#ffffff**
- `--color-focus-ring`: **#b0492b**
- `--color-danger-text`: **#8c2d1c**

## Typography

- `font_family`: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Times New Roman", serif
- `font_family_ui`: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
- `heading_weight`: 600
- `body_weight`: 400
- `quote_size`: 18px mobile / 20px desktop, line-height 1.6
- `size_scale`: 12px (label), 13px (caption), 15px (body-ui), 17px (prose), clamp(28px,5vw,40px) (h1), 22px (h2 section), 20px (h3 card)
- `letterspacing_label`: 0.08em uppercase for eyebrow/section labels
- `numerals`: font-variant-numeric: tabular-nums for counts and page numbers

## Spacing Scale

- `--space-0`: 4px
- `--space-1`: 8px
- `--space-2`: 12px
- `--space-3`: 16px
- `--space-4`: 24px
- `--space-5`: 32px
- `--space-6`: 48px
- `--space-7`: 64px

## Border-Radii

- `--radius-sm`: 6px
- `--radius-md`: 10px
- `--radius-lg`: 18px
- `--radius-pill`: 999px

## Components

### Button

Two variants on one base. Base: font family = font_family_ui, 15px/600, min-height 44px (also desktop, tap target), padding 10px 20px, radius pill, display inline-flex center, gap 8px, transition background-color/transform 130ms ease-out. Primary: bg accent #b0492b, text #ffffff, border 1px solid transparent; hover bg #983d22; active bg #7f321b + translateY(1px); disabled bg #e4ddd2, text #9c948a, cursor not-allowed, no hover change, aria-disabled. Secondary/Ghost: bg transparent, text fg #1b1917, border 1px solid #cfc6b8; hover bg #f2ece1; active bg #efe8dd + translateY(1px); disabled text #9c948a, border #e4ddd2. Focus-visible (both): outline 2px solid #b0492b, outline-offset 2px, radius unchanged. Used as <a> when it navigates (Back to start, retry) and as <button> when it acts. No shadows. Labels use arrows as text: '← Previous', 'Next →', '← Back to all quotes'.

### Skip Link

First focusable element on every view. Visually hidden until focus: then position fixed top 12px left 12px, bg #1b1917, text #ffffff, 15px/600, padding 12px 20px, radius md, z-index 100. Text: 'Skip to quotes'. Targets the main landmark.

### Site Header

Full-width bar, bg #faf7f2 with 1px bottom border #e4ddd2, height 64px desktop / 56px mobile, inner container max-width 1180px, gutter matching layout. Left: wordmark link to '#/' — serif font_family, 20px/600, letter-spacing -0.01em, color fg, preceded by a 10x10px accent square rotated 45deg? no: a text glyph '“' in accent 26px as logo mark. Right: nav with one link 'Home' (font_family_ui 15px/500, color fg-muted, hover accent + underline 2px accent offset 4px), hit area min 44x44px via padding 10px 12px. Sticky on desktop (top 0, bg rgba(250,247,242,0.94), backdrop-filter blur(6px)); static on mobile. Nav has aria-label 'Main'. No login link anywhere.

### Page Heading Block

Eyebrow (optional): font_family_ui 12px/600 uppercase, letter-spacing 0.08em, color accent #b0492b. h1: font_family serif, clamp(28px,5vw,40px)/1.15, weight 600, color #1b1917, letter-spacing -0.02em, margin 8px 0 0. Subline: font_family_ui 14px, color #6b635c, tabular-nums, one line, margin-top 8px — e.g. '10 quotes on this page · Page 1 of 10' or '12 quotes with this tag'. h1 carries tabindex='-1' and receives focus programmatically after each route change (visible focus ring). Max width 68ch.

### Quote Card

bg #ffffff, border 1px solid #e4ddd2, radius lg 18px, padding 28px desktop / 20px mobile, position relative. Decorative opening quote mark: serif '“' 64px (mobile 48px), color #dcd2c3, line-height 1, absolute top 6px right 20px, aria-hidden, pointer-events none. Quote text: font_family serif, 20px desktop / 18px mobile, line-height 1.6, color #1b1917, max width 58ch, hanging punctuation via padding-left 0. Meta row below, margin-top 16px, display flex wrap, gap 8px 12px, align center: Author Link, then Tag Chips. Divider between text and meta: none; use 16px space. Card hover (only if card contains no interactive wrapper): border-color #cfc6b8, box-shadow 0 2px 12px rgba(27,25,23,0.06); 130ms ease-out. No 'read more', no card-level link — the quote text is not clickable, only author and tags are.

### Author Link

Inline text link to '#/author/:slug/'. font_family_ui 15px/600, color #b0492b (AA on white: 5.2:1), prefix a small serif em-dash? no — label is the author name followed by a muted '(about)': the '(about)' sits in font_family_ui 13px/400, color #9c948a, 4px left gap, keeps the original's hint. Hit area min 44x44px by padding 12px 8px 12px 0 and margin -12px 0 -12px 0. Hover: color #983d22, text-decoration underline 2px with 3px offset. Active: #7f321b. Focus-visible: outline 2px solid #b0492b, offset 2px, radius sm.

### Tag Chip

Link pill to '#/tag/:tag/'. font_family_ui 13px/500, color #5c554d, bg #efe8dd, radius pill, padding 6px 12px, border 1px solid transparent, white-space nowrap. Desktop min-height 32px; below 768px min-height 44px with padding 10px 14px so tap targets meet 44x44 (14px minimum width overshoot via padding). Hover: bg #e6dccd, color #1b1917. Active: bg #ddd1bf. Focus-visible: outline 2px solid #b0492b, offset 2px. Current tag (on its own tag page, in sidebar shown as active): bg #b0492b, color #ffffff.

### Tag Row (sidebar list item)

One row of the Top Ten Tags panel: link, display flex, justify-content space-between, align-items center, min-height 44px, padding 10px 12px, radius sm, font_family_ui 15px/500 color #1b1917. Right: count, font_family_ui 13px, color #9c948a, tabular-nums, e.g. '14'. Rank number optional left: 13px #9c948a width 18px tabular. Row hover: bg #f2ece1, color accent #b0492b. Focus-visible: outline 2px solid #b0492b, offset -2px. Rows separated by 1px border-bottom #e4ddd2 on all but the last.

### Top Ten Tags Panel

Sticky sidebar card: bg #ffffff, border 1px solid #e4ddd2, radius lg 18px, padding 20px. Heading h2: font_family_ui 12px/600 uppercase, letter-spacing 0.08em, color #6b635c, text 'Top Ten tags', margin 0 0 8px, 16px bottom padding with 1px border #e4ddd2. Body: Tag Row list, semantically an ordered list <ol>. Footer caption inside panel: font_family_ui 12px, color #9c948a, padding-top 12px, text 'Ranked by number of quotes' — text only, no link. Exactly ten rows, descending by quote count. On desktop sticky top 88px; on mobile static card without sticky.

### Pagination

Bar under the quote list, margin-top 32px, display flex align center justify-content space-between gap 12px, border-top 1px solid #e4ddd2, padding-top 20px, flex-wrap wrap on mobile (indicator centered on its own line at <480px). Left: Button-style link '← Previous' (secondary variant, min-height 44px). Right: 'Next →'. Center: page indicator font_family_ui 14px/500 color #6b635c, tabular-nums, format 'Page 1 of 10' inside a subtle pill bg #f2ece1 radius pill padding 8px 14px, aria-live='polite'. Disabled end (first page for Previous, last page for Next): rendered as <span aria-disabled='true'> with bg transparent, text #9c948a, border 1px solid #e4ddd2, cursor default, not focusable, no hover; label stays visible. Both ends disabled on single-page views → still render both, indicator 'Page 1 of 1'.

### Author Profile Header

Card on surface, no border, transparent bg, padding-block 0 24px, margin-bottom 24px, border-bottom 1px solid #e4ddd2. Row 1: Author Monogram + name. h1 name: serif clamp(28px,5vw,40px)/1.15 weight 600 color #1b1917, tabindex='-1' for route focus, letter-spacing -0.02em. Row 2: born line, font_family_ui 14px, color #6b635c, margin-top 8px, format exactly 'Born: March 14, 1879 in Ulm, Germany' (date = English long form, month name, day without leading zero, four-digit year). Row 3: description paragraph, font_family serif 17px/1.7, color #1b1917, max-width 68ch, margin-top 16px. Row 4: count line font_family_ui 14px color #6b635c, e.g. '12 quotes by Albert Einstein'. Back link above the name: '← All quotes'.

### Author Monogram

Placeholder portrait since no images are allowed: 64px circle (mobile 56px), bg #efe8dd, 1px border #cfc6b8, initials = first letter of first and last name, font_family serif 22px/500 color #b0492b, centered, aria-hidden (name follows as text). Sits 16px left of the h1 on ≥480px, above it stacked on <480px.

### Back Link

Inline link at the top of Author and Tag views: '← All quotes' to '#/', font_family_ui 14px/500 color #6b635c, min-height 44px inline-flex align-items center, padding 10px 4px. Hover: color #b0492b, underline 2px offset 3px. Focus-visible: outline 2px #b0492b offset 2px radius sm. No 'back to original site' links of any kind.

### Stat / Count Pill

Small informational pill used in headings and the sidebar: font_family_ui 13px/500, color #5c554d, bg #f2ece1, radius pill, padding 6px 12px, tabular-nums, non-interactive (never looks like a button). Used for '100 quotes', '14', page counts.

### Footer

Full-width, bg #faf7f2, border-top 1px solid #e4ddd2, margin-top 64px, padding 32px 0. Inner container max-width 1180px. Desktop: two text blocks on one row, space-between, font_family_ui 13px, color #6b635c — left 'Quotes by: GoodReads.com', right 'Made with ❤ by Zyte'. Mobile: stacked, left-aligned, 8px gap. Plain <p> text only, no links, no icons.

### Not Found Panel

Centered card: max-width 560px, margin 48px auto, bg #ffffff, border 1px solid #e4ddd2, radius lg 18px, padding 40px 32px (mobile 28px 20px), text-align left. Eyebrow '404' font_family_ui 12px/700 uppercase letter-spacing 0.14em color #b0492b. h1 serif 32px/1.2 color #1b1917, text 'This page doesn't exist', tabindex='-1'. Body paragraph font_family_ui 15px/1.65 color #6b635c explaining that the address matches no quote, author or tag. Primary Button '← Back to all quotes' linking to '#/', margin-top 24px. Below: 12px muted caption 'Or pick a tag from the list.' No fake controls. The Top Ten Tags sidebar stays visible next to it on desktop and below it on mobile.

### Skeleton Quote Card

Loading placeholder mirroring Quote Card geometry: bg #ffffff, border 1px #e4ddd2, radius lg, padding 28px/20px, contains 3 bars (widths 100%, 92%, 60%, height 14px, radius sm, bg #efe8dd, 12px gap) plus a meta bar 120x16px. Animated with opacity 1→0.55→1, 1400ms ease-in-out infinite; animation fully disabled under prefers-reduced-motion (static blocks). Rendered 3x while the data module resolves, aria-hidden='true', wrapper announces loading via visually hidden text + role='status'.

### Error Panel

Replaces the quote list when rendering fails: bg #ffffff, border 1px solid #cfc6b8, radius lg, padding 32px, max-width 560px. h2 font_family_ui 18px/600 color #1b1917 'Something went wrong loading these quotes'. Paragraph font_family_ui 14px/1.6 color #6b635c. Secondary Button 'Try again' that re-renders from the local data module. Role='alert'.

### Empty State

Shown only if a valid list resolves to zero items (should not happen in the shipped data): centered block, padding 48px 24px, serif 20px color #1b1917 line 'No quotes here yet.', font_family_ui 14px color #6b635c explanation, Secondary Button '← Back to all quotes'. Never used as a substitute for the 404 view.

## Layout Principles

- Container: max-width 1180px, centered; gutters 20px <768px, 32px 768–1199px, 48px ≥1200px.
- Grid: from 1024px two columns 'main 1fr / sidebar 300px' with 48px gap, sidebar sticky top 88px; below 1024px a single column, with the Top Ten Tags sidebar rendering AFTER the pagination (mobile order: heading → quotes → pagination → sidebar → footer).
- Breakpoints: 480px, 768px, 1024px, 1280px. No horizontal scrolling at 320px; long quote text wraps, never truncates.
- Vertical rhythm: header 64/56px; page top padding 32px mobile / 48px desktop; 24px between heading block and first card; 16px between quote cards on mobile, 20px on desktop; 32px before pagination; 64px before footer.
- Reading measure: quote text max 58ch (serif 18→20px), author description and page sublines max 68ch; headings letter-spacing -0.02em.
- Every date shown anywhere uses ONE format: English long form 'Month D, YYYY' with no leading zero, e.g. 'March 14, 1879' — used in the born line as 'Born: March 14, 1879 in Ulm, Germany'. Never numeric/short dates.
- Every count uses plain integers with tabular-nums and a noun: '10 quotes', '14 quotes', '12 quotes by Albert Einstein'; page indicator always 'Page 3 of 10' (no zero padding, no '3/10').
- Every page number, quote count and rank uses font-variant-numeric: tabular-nums so columns align.
- Links never use href='#' — all navigation is a real hash route; nothing styled like a button without a target.
- Focus: 2px solid #b0492b outline with 2px offset on every interactive element, visible on all backgrounds; all hit areas ≥44x44px (desktop included).
- Motion: 120–160ms ease-out on transform/opacity/background only, no layout-shifting animations; everything disabled under prefers-reduced-motion: reduce.
- No external fonts, images, scripts or styles: serif stack (Iowan/Palatino/Georgia) + system-ui stack only; icons are inline SVG or text arrows (←, →, ❤).
- After each route change: document title follows 'Quotes to Scrape — <view>' (e.g. 'Quotes to Scrape — Tag: love', 'Quotes to Scrape — Albert Einstein'), h1 receives focus, page scrolls to top.

## Screens

### Home (#/ for page 1 and #/page/:n/ for pages 2+)

Layout: Desktop ≥1024px: quote column 1fr + 300px sticky tag sidebar, 48px gap, inside a 1180px container. Below 1024px single column, sidebar card moves below the pagination; cards stack full width with 16px gaps at 320–767px.

- Skip link + Site Header: wordmark 'Quotes to Scrape' linking to '#/', single 'Home' nav link, no login entry.
- Page Heading Block: h1 'Quotes to Scrape', subline with total and current page ('100 quotes · Page 1 of 10'), h1 is the focus target after route changes.
- Quote list: exactly 10 Quote Cards per page — serif quote text with decorative quote mark, meta row with Author Link (name + muted '(about)') and its Tag Chips.
- Pagination: '← Previous' disabled on page 1, centred pill 'Page 1 of 10', 'Next →' disabled on the last page.
- Top Ten Tags Panel (sidebar): ordered list of the ten most frequent tags with counts, descending, each row a link to its tag page, caption 'Ranked by number of quotes'; sticky on desktop.
- Footer: 'Quotes by: GoodReads.com' and 'Made with ❤ by Zyte' as plain text, split left/right on desktop and stacked on mobile.

States: Loading: 3 Skeleton Quote Cards in the list area and 6 grey rows in the sidebar panel, announced via role='status'. Empty: Empty State panel with '← Back to all quotes' if a valid page resolves to zero quotes. Error: Error Panel with 'Try again' replacing the list. Out-of-range page number (#/page/99/) renders the Not Found view instead of an empty list.

### Tag Page (#/tag/:tag/ and #/tag/:tag/page/:n/)

Layout: Same two-column shell as Home: quotes 1fr + 300px sticky Top Ten Tags sidebar on ≥1024px; single column below, sidebar under the pagination. Ten quote cards per tag page, headline block spans the main column only.

- Skip link + Site Header with 'Home' link.
- Tag heading: back link '← All quotes', eyebrow 'Viewing tag', h1 = the tag name (e.g. 'love') in serif, subline '12 quotes with this tag · Page 1 of 2' — the exact string 'Viewing tag: <tag>' is preserved as eyebrow + h1 pair, h1 focusable.
- Quote list: all quotes carrying this tag, 10 per page, each with author link and tag chips (the current tag's chip rendered in the active accent state).
- Pagination: '← Previous' / 'Page 1 of 2' / 'Next →'; tags with a single quote render one card with 'Page 1 of 1' and both ends disabled (visible, not hidden).
- Top Ten Tags Panel (sidebar), current tag highlighted with accent background so its position is obvious.
- Footer, identical on every view.

States: Loading: skeleton headline bar + 3 Skeleton Quote Cards. Empty: not reachable for existing tags — a tag page always lists at least one quote; if data were inconsistent, Error Panel shows. Error: Error Panel with 'Try again'. Unknown tag slug (#/tag/does-not-exist/) renders the Not Found view.

### Author Page (#/author/:slug/)

Layout: Two-column shell on ≥1024px (profile + quotes at 1fr, 300px sticky sidebar); the Author Profile Header spans the main column, monogram and name side by side from 480px and stacked below 480px.

- Skip link + Site Header with 'Home' link.
- Back link '← All quotes' returning to '#/'.
- Author Profile Header: Author Monogram (initials), h1 author name, born line 'Born: March 14, 1879 in Ulm, Germany', description paragraph at max 68ch, count line '12 quotes by Albert Einstein'; h1 receives focus.
- Quote list: every quote of this author, all on one page (no pagination here), each card with quote text and its tag chips — the author link is omitted inside own-author cards.
- Top Ten Tags Panel (sidebar) as navigation to other slices of the collection.
- Footer, identical on every view.

States: Loading: skeleton avatar circle, two heading bars and 2 Skeleton Quote Cards. Empty: Empty State 'No quotes here yet.' with back button if an author had none (not expected in shipped data). Error: Error Panel with 'Try again'. Unknown author slug renders the Not Found view.

### Not Found (any unmatched hash, e.g. #/login, #/tag/unknown-tag/, #/author/unknown-person/, #/page/999/)

Layout: Two-column shell kept from the other views: the Not Found Panel sits centred in the main column (max 560px), the Top Ten Tags sidebar stays visible beside it on ≥1024px and below it on mobile — so there is always an exit route.

- Skip link + Site Header with 'Home' link (the nav never disappears).
- Not Found Panel: eyebrow '404', h1 'This page doesn't exist' as the focus target, explanation that the address matches no quote, author or tag, primary Button '← Back to all quotes' to '#/', caption 'Or pick a tag from the list.'.
- Top Ten Tags Panel (sidebar) acting as the recovery navigation.
- Footer, identical on every view.

States: Static view — no loading or empty state. The view sets the document title 'Quotes to Scrape — Page not found' and scrolls to top; the '#/login' route deliberately lands here since no login exists.
