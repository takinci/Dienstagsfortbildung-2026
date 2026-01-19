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
