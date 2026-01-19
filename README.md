# Dienstagsfortbildung 2026 – Overview / Übersicht

## English

This is a small, static single-page app to manage the weekly Tuesday training series in 2026.

### What the page does
- Shows the next upcoming lecture (date + speaker) and hides past sessions.
- Lists all remaining 2026 sessions in a table.
- Provides search by date and/or speaker (substring match supported).
- Updates the local clock live so "future" is always relative to now.
- Offers simple email opt-in/out: address is stored locally; optional backend calls are prepared.

### Technical overview
- Everything lives in one file: [index.html](index.html) (HTML, CSS, JavaScript).
- The schedule is embedded as JSON (`DATA_2026`) inside the script.
- Rendering and filtering are fully client-side; no build or server is required.

### Project structure
- [index.html](index.html): current static entry point (kept at repo root for GitHub Pages).
- [src/frontend](src/frontend): working copy of the frontend for future TS/tooling work.
- [src/backend](src/backend): minimal Node backend (Express) for subscribe/unsubscribe/notify; see its README.
- [.devcontainer](.devcontainer): VS Code Dev Container configuration (Node image, installs backend deps, forwards 3000).

### How to use
1) Open `index.html` (double-click or serve via any static host).
2) "Next lecture" and the table automatically show only dates from today onward.
3) Use search: pick a date and/or type a speaker substring, then click "Search" (Enter works too).
4) Email opt-in/out: enter an address, click "Subscribe" or "Unsubscribe." The address is saved in `localStorage`.

### Dev Container (optional)
- Open in VS Code → "Reopen in Container".
- After build, backend deps are installed (via `postCreateCommand`).
- Run backend + frontend together: `npm run dev` from `src/backend`, then visit http://localhost:3000.

### Email notifications (optional backend)
- Default: no real emails, only local storage in the browser.
- For production, implement these endpoints and adjust URLs if needed:
  - `POST /api/subscribe` with `{ email, seriesTitle }`
  - `POST /api/unsubscribe` with `{ email, seriesTitle }`
  - `POST /api/notify` (not wired yet, but recommended) to send the next-lecture info to all registered users.
- Backend call failures are caught; the local record remains.

### Customization
- Add more sessions: extend `DATA_2026` in the script or fetch from a backend.
- Texts/translations: edit them directly in [index.html](index.html).
- Styling: adjust the color/layout variables in the `:root` block near the top of the file.

### Next sensible steps
- Add a small backend (e.g., serverless functions) for real subscribe/unsubscribe/notify flows.
- Add tests (smoke test for table, filter logic, email validation).
- Add a CI check that lints the HTML and runs a short browser test (e.g., Playwright).

---

## Deutsch

Dies ist eine kleine, statische Ein-Seiten-Anwendung zur Verwaltung der wöchentlichen Dienstagsfortbildungen 2026.

### Was die Seite kann
- Zeigt den nächsten anstehenden Vortrag (Datum + Referent:in) und blendet vergangene Termine aus.
- Listet alle verbleibenden Termine des Jahres 2026 tabellarisch.
- Bietet eine Suche nach Datum und/oder Referent:in (Teilstrings werden unterstützt).
- Aktualisiert die lokale Uhrzeit live, damit klar ist, welche Termine als "zukünftig" gelten.
- Ermöglicht eine einfache E-Mail-An-/Abmeldung: Adresse wird lokal im Browser gespeichert; optionale Backend-Calls sind vorbereitet.

### Technischer Überblick
- Alles steckt in einer einzigen Datei: [index.html](index.html) (HTML, CSS, JavaScript).
- Die Terminliste ist als eingebettetes JSON (`DATA_2026`) im Skript hinterlegt.
- Rendering und Filterung erfolgen vollständig im Browser; es ist kein Build- oder Server-Setup nötig.

### Nutzung
1) Datei öffnen: Doppelklick auf `index.html` oder per einfachem Static-File-Hoster servieren.
2) "Nächster Vortrag" und die Tabelle zeigen automatisch nur Termine ab heutigem Datum.
3) Suche nutzen: Datum wählen und/oder Referent:in eingeben, dann "Suchen" klicken (Enter funktioniert ebenfalls).
4) E-Mail an-/abmelden: Adresse eintragen, "Anmelden" oder "Abmelden" klicken. Die Adresse wird in `localStorage` gesichert.

### E-Mail-Benachrichtigungen (optional mit Backend)
- Standard: Keine echten Mails, nur lokale Speicherung im Browser.
- Für Produktion: Implementiere folgende Endpunkte und passe die URLs bei Bedarf an:
  - `POST /api/subscribe` mit `{ email, seriesTitle }`
  - `POST /api/unsubscribe` mit `{ email, seriesTitle }`
  - `POST /api/notify` (nicht verknüpft, aber empfohlen) zum Versand der nächsten Vortragsinfos an alle Registrierten.
- Fehler beim Backend-Aufruf werden abgefangen; die lokale Speicherung bleibt trotzdem bestehen.

### Anpassungen
- Weitere Termine: `DATA_2026` im Skript ergänzen oder durch einen Fetch von einem Backend ersetzen.
- Übersetzungen/Texte: Direkt in [index.html](index.html) ändern.
- Styling: Farb- und Layout-Variablen stehen im `:root`-Block am Anfang der Datei.

### Nächste sinnvolle Schritte
- Kleines Backend ergänzen (z.B. Serverless-Funktionen) für echte Subscribe/Unsubscribe/Notify-Flows.
- Tests hinzufügen (Smoke-Test für Tabelle, Filterlogik, E-Mail-Validierung).
- CI-Check einrichten, der das HTML lintet und einen kurzen Browser-Test fährt (z.B. Playwright).
