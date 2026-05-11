# Contao Standard Theme

Modulares Starter-Theme für **Contao 5.7** (Managed Edition) — mobile-first, barrierefrei (WCAG AA / BITV / BFSG), keine Build-Kette.

---

## Voraussetzungen

| Tool | Version |
|---|---|
| [DDEV](https://ddev.com) | ≥ 1.23 |
| Docker | aktuell |
| PHP | 8.4 (via DDEV) |
| Composer | 2 |

## Installation

```bash
git clone https://github.com/mstudio-dev/contao-standard-theme.git
cd contao-standard-theme
ddev start
ddev composer install
ddev exec vendor/bin/contao-setup
```

Backend: `https://contao-standard-theme.ddev.site/contao`  
Frontend: `https://contao-standard-theme.ddev.site`

---

## Projektstruktur

```
├── files/theme/
│   ├── css/
│   │   ├── 01-tokens.css          # Design Tokens (OKLCH, Spacing, Breakpoints)
│   │   ├── 02-framework.css       # Reset, Typografie, Container, Grid
│   │   ├── 03-components.css      # Buttons, Forms, Nav, Cards, Alerts, Modal
│   │   ├── 04-utilities.css       # Redakteurs-Utilities
│   │   ├── 05-accessibility.css   # Skip-Links, Fokus, Reduced-Motion, Print
│   │   └── custom.css             # ← Nur :root-Variablen, Brand-Overrides
│   ├── img/
│   │   └── sprite.svg             # SVG-Icon-Sprite (21 Heroicons)
│   └── js/
│       ├── a11y.js                # trapFocus, aria toggles, SR-Announcements
│       ├── dropdown.js            # Accessible Dropdown (Keyboard + ARIA)
│       └── modal.js               # Accessible Modal (Fokus-Trap + ARIA)
│
├── templates/
│   ├── page/
│   │   └── ms_layout.html.twig   # Page Layout — Slots + CSS-Loading
│   ├── content_element/
│   │   ├── html--skiplinks.html.twig     # Theme-Inhaltselement: Skip-Links
│   │   ├── html--jsonld-org.html.twig    # Theme-Inhaltselement: JSON-LD
│   │   ├── html--gtm-head.html.twig      # Theme-Inhaltselement: GTM <head>
│   │   ├── html--gtm-body.html.twig      # Theme-Inhaltselement: GTM <body>
│   │   ├── ce_text_variants.html.twig    # Snippet-Referenz für Redakteure
│   │   └── README.md                     # Redakteurs-Quickstart
│   └── mod_article.html.twig     # Artikel-Wrapper mit .inside + SVG-Icons
│
├── composer.json
└── .ddev/
```

---

## CSS-Architektur

Kein Build-Schritt. Alle Dateien werden in definierter Reihenfolge über `ms_layout.html.twig` geladen.

### Ladereihenfolge

```
01-tokens → 02-framework → 03-components → 04-utilities → 05-accessibility → custom.css
```

Jede Datei arbeitet mit `@layer`, sodass die Spezifität kontrolliert bleibt:

| Datei | Layer | Inhalt |
|---|---|---|
| `01-tokens.css` | `tokens` | OKLCH-Farben, Spacing, Breakpoints, Logo-Maße |
| `02-framework.css` | `framework.*` | Reset, Typografie, `.inside`, Grid (12 Spalten, mobile-first) |
| `03-components.css` | `components.*` | `.btn`, Forms, Nav, Cards, Alerts, Modal, Dropdown |
| `04-utilities.css` | `utilities` | Redakteurs-Klassen (Text, Abstand, Boxen) |
| `05-accessibility.css` | `accessibility` | `.invisible`, Fokus, Skip-Links-CSS, Print |
| `custom.css` | `custom` | **Nur `:root`-Variablen** — Brand-Farbe, Logo, Schrift |

### Brand anpassen

Ausschließlich in `files/theme/css/custom.css`:

```css
@layer custom {
  :root {
    --color-primary: oklch(0.52 0.18 145); /* Grün — Kontrast prüfen! */
    --logo-height:   55px;
  }
}
```

Farbe generieren: [oklch.com](https://oklch.com) · Kontrast prüfen: [myndex.com/APCA](https://www.myndex.com/APCA/)

> **Regel:** `custom.css` darf **keine Selektoren** enthalten — nur `:root { }`. Ein CI-Check kann das erzwingen.

---

## Slot-Architektur (`ms_layout.html.twig`)

```
<head>
  CSS (Infrastruktur, hardcodiert)
  {% slot head_meta %}        ← JSON-LD, GTM-Script, Custom Meta
</head>
<body>
  {% slot header %}           ← Logo, Navigation
  {% slot before %}           ← optionaler Bereich über Main
  {% slot left %}             ← Sidebar links (optional)
  {% slot main %}             ← Hauptinhalt
  {% slot right %}            ← Sidebar rechts (optional)
  {% slot after %}            ← optionaler Bereich unter Main
  {% slot footer %}           ← Footer
{% slot body_end %}           ← GTM-noscript, deferred JS, Cookie-Lib
```

Slots werden im Backend unter **Layout → Seitenlayout → Sektionen** befüllt.

---

## Theme-Inhaltselemente

Moderne Contao-5.7-Elemente, die direkt einem Theme gehören und in Layoutsektionen eingebunden werden — keine Frontend-Module.

**Backend-Einrichtung:**
> Design → Theme → Inhaltselemente → Neu → Typ **HTML** → Template wählen → Slot zuweisen

### Verfügbare Templates

| Template | Slot | Zweck |
|---|---|---|
| `html--skiplinks` | `before` / erste Sektion | WCAG 2.4.1 Skip-Navigation |
| `html--jsonld-org` | `head_meta` | Schema.org Organization (Structured Data) |
| `html--gtm-head` | `head_meta` | Google Tag Manager `<script>` |
| `html--gtm-body` | `body_end` | Google Tag Manager `<noscript>` |

### Neues Theme-Inhaltselement erstellen

1. Template anlegen: `templates/content_element/html--{name}.html.twig`
2. Basisstruktur:

```twig
{% extends "@Contao/content_element/html.html.twig" %}

{% block html %}
  {# HTML hier #}
{% endblock %}
```

3. Im Backend: **Design → Theme → Inhaltselemente → Neu → Template `html--{name}`**

---

## SVG-Icon-Sprite

Pfad: `files/theme/img/sprite.svg`  
21 Icons aus [Heroicons v2](https://heroicons.com) (MIT).

**Dekoratives Icon** (Screen-Reader ignoriert es):
```html
<svg aria-hidden="true" focusable="false" width="20" height="20">
  <use href="{{ asset('files/theme/img/sprite.svg') }}#icon-download"/>
</svg>
```

**Informatives Icon** (mit Alternativtext):
```html
<svg role="img" aria-labelledby="icon-lbl-1" width="20" height="20">
  <title id="icon-lbl-1">Datei herunterladen</title>
  <use href="{{ asset('files/theme/img/sprite.svg') }}#icon-download"/>
</svg>
```

Verfügbare IDs: `icon-home`, `icon-search`, `icon-menu`, `icon-x`, `icon-chevron-down/right/left`, `icon-arrow-right/left`, `icon-external-link`, `icon-download`, `icon-document`, `icon-mail`, `icon-phone`, `icon-map-pin`, `icon-calendar`, `icon-user`, `icon-check`, `icon-info`, `icon-warning`, `icon-print`

---

## JavaScript

Alle Module sind **ES-Module ohne Abhängigkeiten**. Einbinden über Theme-Inhaltselement im `body_end`-Slot oder direkt im Template.

```html
<script type="module" src="{{ asset('files/theme/js/dropdown.js') }}"></script>
<script type="module" src="{{ asset('files/theme/js/modal.js') }}"></script>
```

| Datei | Exports | Zweck |
|---|---|---|
| `a11y.js` | `trapFocus`, `releaseFocus`, `toggleAriaExpanded`, `onEscape`, `announceToScreenReader` | Accessibility-Helfer |
| `dropdown.js` | `Dropdown`, `initDropdowns` | Keyboard-navigierbar, `aria-expanded` |
| `modal.js` | `Modal`, `initModals`, `getModal` | Fokus-Trap, `aria-modal`, Escape |

---

## Accessibility

WCAG 2.1 AA · BITV 2.0 · BFSG

| Anforderung | Umsetzung |
|---|---|
| Skip-Links | Theme-Inhaltselement `html--skiplinks` → `before`-Slot |
| Fokus-Indikatoren | `05-accessibility.css` → `:focus-visible` global |
| Touch-Targets | min. 44 × 44 px in allen Komponenten |
| Kontrast | Tokens dokumentiert, APCA-Prüfung empfohlen |
| Reduced Motion | `@media (prefers-reduced-motion: reduce)` in allen Animationen |
| Screen-Reader | `.invisible` für SR-only-Text, `aria-*` in JS-Modulen |
| Dark Mode | `@media (prefers-color-scheme: dark)` in `01-tokens.css` |

---

## Backend-Einrichtung (Erstinstallation)

```
1. Design → Theme → Seitenlayouts → Neu
   Template: ms_layout

2. Design → Theme → Inhaltselemente → Neu (je Element)
   html--skiplinks  → Slot: before (als erstes Element)
   html--jsonld-org → Slot: head_meta (Firmendaten anpassen)
   html--gtm-head   → Slot: head_meta (GTM-ID eintragen)
   html--gtm-body   → Slot: body_end  (GTM-ID eintragen)

3. custom.css: Primärfarbe und Logo-Maße eintragen

4. Contao-Cache leeren: bin/contao cache:clear
```

---

## Deploy-Checkliste

```bash
# 1. Cache leeren
bin/contao cache:clear

# 2. Styles in DevTools prüfen
#    Reihenfolge: 01-tokens → … → custom.css

# 3. Lighthouse Mobile (Ziele)
#    Performance ≥ 90 · Accessibility ≥ 95 · SEO ≥ 90

# 4. axe Core / WAVE — 0 kritische Fehler

# 5. Manuelle Checks
#    [ ] Skip-Link sichtbar bei erstem Tab
#    [ ] Keyboard-Navigation vollständig
#    [ ] Modal: Fokus-Trap + Escape
#    [ ] Dark Mode (DevTools → prefers-color-scheme: dark)
#    [ ] Reduced Motion (DevTools → prefers-reduced-motion: reduce)
#    [ ] Kontrast custom.css Primärfarbe: myndex.com/APCA
```

---

## Entwicklungsumgebung

```bash
ddev start          # Umgebung starten
ddev stop           # Umgebung stoppen
ddev ssh            # In den Container
ddev composer …     # Composer-Befehle
```

---

## Bundles

| Bundle | Zweck |
|---|---|
| `contao/manager-bundle` | Contao Managed Edition Core |
| `contao/news-bundle` | News / Blog |
| `contao/calendar-bundle` | Veranstaltungen |
| `contao/faq-bundle` | FAQ |
| `contao/comments-bundle` | Kommentare |
| `contao/newsletter-bundle` | Newsletter |
| `contao/listing-bundle` | Listenmodul |

---

## Lizenz

LGPL-3.0-or-later
