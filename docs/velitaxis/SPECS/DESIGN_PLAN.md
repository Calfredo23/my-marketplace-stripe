# DESIGN PLAN — The Market

## Direction

Airbnb-inspired marketplace. The listings do the work: white canvas, large 4:3 photography,
borderless cards, tight display type, and one coral action color. The interface stays quiet
so the photos and prices read first. This is a marketplace, not a social feed and not a
Facebook clone.

## System

- One system: `airbnb` from the looksmaxxing library.
- Palette: white canvas, `#222` ink, `#6a6a6a` muted, `#ddd` hairline, deep coral
  `#e31c5f` for primary actions and the mark.
- Type: one system sans for UI, with a Georgia serif wordmark. Display 56/1.05, section 28,
  card title 16/600, body 16/1.45, meta 13. Tight negative tracking only on display.
- Radii: 8px inputs/buttons, 14px cards, 20px hero/form/seller panels, pill search.
- Elevation: cards are flat. Seller/form panels use Airbnb's stacked hairline+blur shadow.
- Motion: 150–200ms, transform/opacity, reduced-motion honored.

## Layout

- Sticky white header: serif wordmark with a `buy / sell` tagline, full-width pill search,
  coral Sell button.
- Home: 56px headline, short copy, icon category tabs with an ink underline, result count,
  view toggle, three balanced 4:3 photo columns.
- Cards: image 14px radius; price, two-line title, muted category/date below. No outer card
  border or shadow.
- List view: 240px image left, details centered, hairline separators.
- Detail: large 20px image left; title/price/description below. Right rail: seller card,
  category/listed facts, coral Message Seller, safety note.
- Sell: 720px one-column form, 20px panel, photo dropzone first, 48px inputs, coral publish.

## Interaction

- Search button is a coral circle; Enter and click both submit.
- Search and category filtering are client-side; no page reload. Clearing the search resets
  the category and shows all products.
- Category tabs wrap on mobile so all categories stay visible.
- Fields validate on blur, clear on input, and show a specific message.
- Buttons: hover darkens, active scales, focus is a 2px ink ring.
- No meaning by color alone; every error has text.

## Quality gates

- Contrast >= 4.5:1 for text, >= 3:1 for large text and UI.
- No horizontal scroll at 320, 360, 768, 1440.
- Axe zero at 390 and 1440.
- Touch targets >= 44px for primary controls.
- All images have alt text; the seller email is a mailto link.
