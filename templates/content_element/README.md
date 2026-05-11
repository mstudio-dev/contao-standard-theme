# Contao Standard Theme — Redakteurs-Quickstart

## Übersicht

Dieses Theme stellt ein modulares CSS-System bereit.
Redakteure steuern das Aussehen ausschließlich über **CSS-Klassen** im Backend-Feld „CSS-Klasse".

---

## Erlaubte CSS-Klassen im Backend

### Text & Typografie

| Klasse | Wirkung |
|---|---|
| `lead` | Einleitungstext: größere Schrift, mehr Zeilenabstand |
| `text-center` | Text zentriert |
| `text-right` | Text rechtsbündig |
| `text-muted` | Grauer, weniger betonter Text |
| `font-bold` | Fettschrift |

### Abstände

| Klasse | Wirkung |
|---|---|
| `mt-8` | Abstand oben (2 rem) |
| `mb-0` | Kein Abstand unten |
| `section-gap` | Großer Abstand oben und unten (3 rem) |
| `section-gap-sm` | Kleinerer Abstand oben und unten (1.5 rem) |

### Hervorhebungen & Boxen

| Klasse | Wirkung |
|---|---|
| `highlight-box` | Grauer Hintergrund, Rahmen, Innenabstand |
| `callout` | Farbiger linker Rand (Primärfarbe), leichter Hintergrund |

### Bilder

| Klasse | Wirkung |
|---|---|
| `img-rounded` | Abgerundete Ecken |
| `img-fluid` | Bild passt sich der Spaltenbreite an |

### Layout (für Wrapper-Elemente)

| Klasse | Wirkung |
|---|---|
| `row` | 12-Spalten-Grid (Kinder brauchen `col--*`) |
| `col--6` | Halbe Breite (ab 768 px) |
| `col--4` | Drittelbreite (ab 768 px) |
| `col--3` | Viertelbreite (ab 768 px) |
| `card-grid` | Responsive Card-Raster (1 → 2 → 3 Spalten) |

---

## Buttons

Buttons werden als **Hyperlink-Inhaltselement** (`ce_hyperlink`) mit CSS-Klasse angelegt:

```
btn btn--primary     → Primär-Button (gefüllt)
btn btn--secondary   → Sekundär-Button (Rahmen)
btn btn--ghost       → Transparenter Button mit Rahmen
btn btn--sm          → Kleiner Button
btn btn--lg          → Großer Button
```

**Beispiel:**
> Inhaltselement → Hyperlink → CSS-Klasse: `btn btn--primary`

---

## Icons (SVG Sprite)

Icons liegen in `files/theme/img/sprite.svg`.

### Verfügbare Icons

| ID | Verwendung |
|---|---|
| `icon-home` | Startseite |
| `icon-search` | Suche |
| `icon-menu` | Hamburger-Menü |
| `icon-x` | Schließen |
| `icon-chevron-down` | Dropdown-Pfeil |
| `icon-chevron-right` | Navigation vorwärts |
| `icon-chevron-left` | Navigation zurück |
| `icon-arrow-right` | Link-Pfeil |
| `icon-arrow-left` | Zurück-Link |
| `icon-external-link` | Externer Link |
| `icon-download` | Download |
| `icon-document` | Dokument |
| `icon-mail` | E-Mail |
| `icon-phone` | Telefon |
| `icon-map-pin` | Standort |
| `icon-calendar` | Datum/Kalender |
| `icon-user` | Benutzer |
| `icon-check` | Häkchen/Erfolg |
| `icon-info` | Information |
| `icon-warning` | Warnung |
| `icon-print` | Drucken |

### Icon-Nutzung im HTML-Block (CE HTML)

**Dekoratives Icon** (Screen-Reader ignoriert es):
```html
<svg aria-hidden="true" focusable="false" width="20" height="20">
  <use href="/files/theme/img/sprite.svg#icon-download"/>
</svg>
```

**Informatives Icon** (mit Alternativtext):
```html
<svg role="img" aria-labelledby="icon-1" width="20" height="20">
  <title id="icon-1">Datei herunterladen</title>
  <use href="/files/theme/img/sprite.svg#icon-download"/>
</svg>
```

---

## Brand-Farben ändern (custom.css)

Brand-Farben **ausschließlich** in `files/theme/css/custom.css` über `:root`-Variablen anpassen.
**Keine anderen CSS-Regeln** in dieser Datei — ein CI-Check wird das erzwingen.

```css
@layer custom {
  :root {
    --color-primary: oklch(0.52 0.18 145); /* Beispiel: Grün */
  }
}
```

OKLCH-Farbe generieren: [oklch.com](https://oklch.com)
Kontrast prüfen: [APCA-Tool](https://www.myndex.com/APCA/)

---

## Accessibility-Checkliste pro Komponente

### Textelemente
- [ ] Überschriften-Hierarchie korrekt (h1 → h2 → h3, keine Ebenen überspringen)
- [ ] Links haben beschreibenden Text (nicht „hier klicken")
- [ ] Kontrast Text auf Hintergrund ≥4.5:1

### Bilder
- [ ] Dekorative Bilder: Alt-Text leer lassen (`alt=""`)
- [ ] Informative Bilder: Alt-Text beschreibt den Bildinhalt
- [ ] Keine Texte in Bildern (oder Alt-Text wiederholt Bildtext)

### Navigation
- [ ] Tastaturnavigation möglich (Tab-Reihenfolge logisch)
- [ ] Aktive Seite mit `aria-current="page"` ausgezeichnet
- [ ] Dropdown per Tastatur bedienbar (Enter öffnet, Escape schließt)

### Formulare
- [ ] Jedes Formularfeld hat ein sichtbares Label
- [ ] Pflichtfelder sind gekennzeichnet (Sternchen + SR-Erklärung)
- [ ] Fehlermeldungen sind programmatisch mit dem Feld verknüpft (`aria-describedby`)
- [ ] Fokusindikator nach Interaktion sichtbar

### Icons
- [ ] Dekorative Icons: `aria-hidden="true"` gesetzt
- [ ] Informative Icons: `<title>` vorhanden und per `aria-labelledby` verknüpft

### Modal/Dropdown
- [ ] Fokus wird beim Öffnen ins Modal/Dropdown gesetzt
- [ ] Fokus wird beim Schließen zum auslösenden Element zurückgesetzt
- [ ] Escape schließt die Komponente
- [ ] Hintergrund-Inhalte haben `aria-hidden="true"` während Modal offen

---

## Staging-Audit Checkliste

### Nach Deployment
1. `bin/contao cache:clear` — Contao-Cache leeren
2. Im Backend: Seitenlayout → Template auf `my_layout` setzen
3. Styles in DevTools prüfen: `01-tokens` → `02-framework` → … → `custom.css`
4. Mobile Ansicht testen (375 px, 768 px, 1024 px)

### Lighthouse (Mobile)
```
Performance:    ≥90
Accessibility:  ≥95
Best Practices: ≥95
SEO:            ≥90
```

### axe Core / WAVE
- 0 kritische Fehler
- Alle Bilder haben Alt-Text
- Farbkontrast-Checker grün

### Manuelle Tests
- [ ] Skip-Link sichtbar bei Tab-Druck (erster Fokus)
- [ ] Tastaturnavigation durch gesamte Seite möglich
- [ ] Modal: Fokus-Trap aktiv, Escape schließt, Fokus kehrt zurück
- [ ] Dropdown: Pfeiltasten navigieren, Escape schließt
- [ ] Screen-Reader-Test mit NVDA (Windows) oder VoiceOver (macOS/iOS)
- [ ] Dark-Mode: `prefers-color-scheme: dark` in DevTools aktivieren
- [ ] Reduced-Motion: `prefers-reduced-motion: reduce` — keine Animationen
