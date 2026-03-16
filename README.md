# Contao Standard Theme

Ein modernes Starter-Theme für **Contao 5.7** (Managed Edition) mit sauberem Twig-Layout, modernem CSS (OKLCH, Dark Mode, CSS Nesting) und DDEV-Entwicklungsumgebung.

## Voraussetzungen

- [DDEV](https://ddev.com) ≥ 1.23
- Docker
- PHP 8.4 (via DDEV)
- Composer 2

## Installation

```bash
git clone https://github.com/mstudio-dev/contao-standard-theme.git
cd contao-standard-theme
ddev start
ddev composer install
ddev exec vendor/bin/contao-setup
```

Anschließend unter `https://test.ddev.site/contao` das Backend aufrufen und die Datenbank einrichten.

## Projektstruktur

```
├── .ddev/                        # DDEV-Konfiguration (PHP 8.4, MariaDB 11.8, Apache)
├── files/
│   └── theme/
│       └── css/
│           └── style.css         # Einziges Theme-Stylesheet
├── templates/
│   ├── mod_article.html.twig     # Artikel-Modul Override
│   └── page/
│       └── layout/
│           └── my_layout.html.twig  # Custom Page-Layout
├── composer.json
└── composer.lock
```

## Theme

### Stylesheet (`files/theme/css/style.css`)

Modernes CSS ohne Build-Schritt:

- **Design Tokens** via CSS Custom Properties (`--primary`, `--surface`, `--spacing` …)
- **OKLCH-Farbwerte** für perceptually uniform Colors
- **Dark Mode** via `@media (prefers-color-scheme: dark)`
- **CSS Nesting** (native, kein Präprozessor)
- Contao-spezifische Selektoren: `.inside`, `.level_1/2`, `.module-*`, `.content-*`, `.syndication`, `nav.pagination`, `.formbody`

### Page Layout (`templates/page/layout/my_layout.html.twig`)

Erweitert `@Contao/page/layout.html.twig` und bindet das Stylesheet ein. Definiert die Slots `header`, `main` und `footer` mit `.inside`-Wrapper.

### Bundles

| Bundle | Zweck |
|---|---|
| `contao/manager-bundle` | Contao Managed Edition Core |
| `contao/news-bundle` | News/Blog |
| `contao/calendar-bundle` | Veranstaltungen |
| `contao/faq-bundle` | FAQ |
| `contao/comments-bundle` | Kommentare |
| `contao/newsletter-bundle` | Newsletter |
| `contao/listing-bundle` | Listenmodul |

## Entwicklung

```bash
ddev start          # Umgebung starten
ddev stop           # Umgebung stoppen
ddev ssh            # In den Container wechseln
ddev composer …     # Composer-Befehle ausführen
```

Frontend: `https://test.ddev.site`  
Backend:  `https://test.ddev.site/contao`

## Lizenz

LGPL-3.0-or-later
