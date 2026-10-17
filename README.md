# Quotes to Scrape

Eine moderne, vollständig statische Neuauflage von quotes.toscrape.com: eine kuratierte Zitatesammlung zum Stöbern nach Autorinnen und Autoren sowie nach Schlagwörtern. Die Seite kommt ohne Framework, ohne Build-Schritt und ohne externe Dienste aus; alle Zitate, Autoren und Tags liegen als JavaScript-Module im Repository. Die Login-Funktion der Vorlage entfällt vollständig. Stattdessen gibt es eine ruhige, warme Editorial-Optik mit klarer Typografie, einer Top-Ten-Tags-Leiste und einer durchgängigen Tastaturbedienung.

## Technik

- HTML5, CSS3 und JavaScript (ES-Module) ohne Framework
- Clientseitiges Routing über den URL-Hash
- Statischer Datenbestand in `js/data/` — kein Backend, keine Datenbank
- Keine externen Schriften, Bilder, Skripte oder Stylesheets
- Tests mit `node --test`

## Installation

Es gibt keine Laufzeit-Abhängigkeiten und keinen Installationsschritt. Voraussetzungen:

- Python 3 für den statischen Dateiserver
- Node.js 22 oder neuer für die Tests

```bash
git clone <repository-url>
cd <repository>
```

## Lokal starten

Die Seite muss über einen HTTP-Server ausgeliefert werden, weil Browser ES-Module über `file://` aus Sicherheitsgründen blockieren.

```bash
python3 -m http.server 8080
```

Anschließend im Browser öffnen:

```text
http://localhost:8080/#/
```

Ein Produktions-Build ist nicht nötig: Das Repository wird unverändert ausgeliefert. Jeder andere statische Dateiserver funktioniert ebenfalls, solange er das Repository-Verzeichnis als Wurzel verwendet.

## Tests

```bash
node --test "tests/**/*.test.mjs"
```

Die Tests prüfen die Routen und die Datenintegrität (Pflichtfelder, auflösbare Autor- und Tag-Referenzen, keine doppelten Zitate).

## Benutzung

Die Navigation läuft vollständig über den Hash der URL; ein Neuladen ist nicht erforderlich.

| Adresse | Ansicht |
| --- | --- |
| `#/` | Startseite mit den Zitaten, Seite 1 |
| `#/page/2/` | Weitere Seite der Startseite |
| `#/tag/love/` | Alle Zitate mit dem Schlagwort „love“ |
| `#/tag/love/page/2/` | Weitere Seite einer Tag-Ansicht |
| `#/author/Albert-Einstein/` | Autorenseite mit Lebensdaten, Beschreibung und allen Zitaten |
| jede unbekannte Adresse | 404-Ansicht mit Link zurück zur Startseite |

Auf der Startseite und auf den Tag-Seiten stehen pro Seite zehn Zitate. Jede Zitatkarte zeigt den Zitattext, einen Link auf die Autorenseite und die zugehörigen Schlagwörter. Unter der Liste liegt die Paginierung mit „← Previous“, der aktuellen Seite und „Next →“; auf der ersten bzw. letzten Seite ist die jeweilige Richtung sichtbar deaktiviert. Die Leiste „Top Ten tags“ führt zu den zehn häufigsten Schlagwörtern, absteigend nach Anzahl.

Bedienung:

- Mit `Tab` durch alle Links und Schaltflächen wandern, mit `Enter` auslösen.
- Die erste Tab-Station ist der Sprunglink „Skip to quotes“, der direkt zum Hauptinhalt führt.
- Nach jedem Seitenwechsel steht der Tastaturfokus auf der Hauptüberschrift; die Seite scrollt nach oben.
- Der Fokusrahmen ist auf jedem Bedienelement sichtbar.
- Bei aktivierter Systemeinstellung „Bewegung reduzieren“ werden Animationen und Übergänge abgeschaltet.

## Funktionen

- Startseite mit zehn Zitaten pro Seite und funktionierender Paginierung
- Autorenseiten mit Geburtsdatum, Geburtsort, Beschreibung und allen Zitaten der Person
- Tag-Seiten mit allen Zitaten eines Schlagworts, ebenfalls zehn pro Seite
- Top-Ten-Tags-Leiste, absteigend nach Anzahl der Zitate, mit hervorgehobenem aktiven Tag
- 404-Ansicht für unbekannte Adressen mit Rückweg zur Startseite
- Responsives Layout: eine Spalte auf dem Smartphone, Zitatspalte und Tags-Leiste nebeneinander ab 1024 Pixeln
- Vollständige Tastaturbedienung, sichtbarer Fokus und Fokus auf der Überschrift nach jedem Routenwechsel
- Dokumenttitel benennt die aktuelle Ansicht (Startseite, Tag oder Autor)
- Kein Login, kein Anmeldeformular und keine externen Netzwerkanfragen
- Fußbereich mit „Quotes by: GoodReads.com“ und „Made with ❤ by Zyte“ auf jeder Ansicht
