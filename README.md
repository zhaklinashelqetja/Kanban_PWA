# Kanban Board (PWA)

Ein einfaches Kanban-Board mit SvelteKit (Svelte 5), Tailwind CSS und date-fns. Installierbar als PWA und komplett offline nutzbar.

## Features

- 4 Lanes: **Do, Doing, Done, Archiv**
- Issues per `<dialog>` anlegen (Title, Description, Creation-Date, Due-Date, Story Points, Priority)
- Drag & Drop ohne Library (HTML5 Drag and Drop API)
- Speicherung aller Issues und ihrer Lane in `localStorage`
- Export einzelner Issues als **ICS**, Teilen per **Web Share API** (Fallback: Zwischenablage)
- Export aller Issues als **CSV**
- Datum/Zeit mit **date-fns** (z. B. „in 2 Tagen“)
- Summe der **Story Points** pro Lane
- Visuelle Warnung „Überfällig“, wenn das Due-Date vorbei ist
- **Notification**, wenn ein Issue nach *Done* gezogen wird
- **PWA**: Manifest + eigener Service Worker, alle Dateien werden vorab gecacht

## Projektstruktur

```
src/
  app.html                Grundgerüst (Manifest, Theme-Color)
  service-worker.js       Offline-Cache
  routes/
    +layout.js            statisch, ohne Server-Rendering
    +layout.svelte        lädt die Styles
    +page.svelte          Seite: Header, 4 Lanes, Dialog
    layout.css            Tailwind + eigene Farben
  lib/
    store.svelte.js       Zustand + localStorage + Notification
    export.js             ICS, CSV, Web Share
    Lane.svelte           Eine Spalte (Drop-Ziel, Punktesumme)
    IssueCard.svelte      Eine Karte (Drag-Quelle, Warnung, Aktionen)
    IssueDialog.svelte    Dialog zum Anlegen
static/                   manifest.webmanifest, Icons
```

## Starten

```bash
npm install
npm run dev       # Entwicklung
npm run build     # Produktions-Build nach build/
npm run preview   # Build lokal testen (PWA/Offline testen)
```

## Hinweise

- Notifications brauchen die Erlaubnis des Browsers (wird beim ersten Mal nach *Done* abgefragt).
- Drag & Drop funktioniert mit der Maus; auf Touch-Geräten nur eingeschränkt (Browser-Eigenschaft der HTML5-API).
- Offline-Test: `npm run build && npm run preview`, Seite einmal laden, dann im Browser „Offline“ stellen.