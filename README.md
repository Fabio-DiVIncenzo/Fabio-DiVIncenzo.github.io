# CF Bulls and Bears – Rebuilding Mom & Dad + Meta Conversions API

Übergabe für die nächste Sitzung (Branch `cfbb-mom-und-dad`).

## Ziel

Jede Anmeldung auf der Landingpage „Rebuilding Mom & Dad“ soll zusätzlich als
**`Lead`-Event an die Meta Conversions API** gehen (für die Meta-Kampagne).
Der neue Schritt kommt in die n8n-Automation **„CF Bulls and Bears Preise“**,
direkt nach dem Node **Webhook3**.

## Stand

| Was | Status |
|---|---|
| Landingpage `rebuilding-mom-and-dad.html` mit erweiterten Webhook-Daten | erledigt, im Browser getestet |
| Fertiger n8n-Node `n8n/meta-capi-lead-node.json` | erledigt, Logik lokal getestet |
| Node in n8n eingebaut | **offen** |
| Pixel-ID und Access Token eingetragen | **offen** |
| Test im Events Manager | **offen** |
| Meta Pixel im Browser (optional) | **offen**, noch nicht entschieden |

## Dateien

- `rebuilding-mom-and-dad.html`: Landingpage (läuft eingebettet in Wix unter
  https://www.crossfitbullsandbears.de/rebuilding-mom-and-dad).
  Das Formular sendet per `POST` (`application/x-www-form-urlencoded`, `no-cors`) an:
  `https://n8n.app.gympilot.de/webhook/e3947da4-a135-4e56-a4da-8f9f2fd8ab60` (= Webhook3)
- `n8n/meta-capi-lead-node.json`: HTTP-Request-Node zum Einfügen in n8n (Strg+V im Editor).

## Daten, die beim Webhook ankommen (`$json.body`)

Bestehende Felder:
`anfrage_fuer` (`selbst`/`eltern`), `name`, `elternteil_name`, `email`, `telefon`,
`alter`, `trainingserfahrung`, `standort`, `einwilligung`, `quelle`, `zeitpunkt`

Neu für die Conversions API:

| Feld | Inhalt |
|---|---|
| `event_id` | eindeutige ID pro Anmeldung (für Deduplizierung mit einem späteren Pixel) |
| `event_time` | Unix-Zeit in Sekunden |
| `event_source_url` | öffentliche Seiten-URL |
| `user_agent` | Browser des Besuchers |
| `fbc` | aus dem Cookie `_fbc` oder aus `fbclid` gebildet (`fb.1.<ms>.<fbclid>`) |
| `fbp` | Cookie `_fbp` (leer, solange kein Pixel auf der Seite ist) |
| `fbclid`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` | aus der URL; werden im localStorage gemerkt |

Die IP-Adresse liest der Node aus dem Header `x-forwarded-for` (`$json.headers`).

## Der n8n-Node „Meta Conversions API (Lead)“

- `POST https://graph.facebook.com/v21.0/PIXEL_ID_HIER/events?access_token=ACCESS_TOKEN_HIER`
- Body (per Expression gebaut): `event_name: Lead`, `action_source: website`,
  `event_id`, `event_time`, `event_source_url`
- `user_data`, per SHA-256 gehasht: `em`, `ph` (Ziffern, `0…` → `49…`), `fn`, `ln`,
  `ct` (frankfurt), `country` (de), `external_id` (E-Mail).
  Ungehasht: `client_ip_address`, `client_user_agent`, `fbc`, `fbp`
- `custom_data`: `content_name`, `lead_type`, `standort`, `alter`, UTM-Werte
- Leere Felder werden weggelassen.
- `onError: continueRegularOutput`: Fällt Meta aus, läuft der Rest des Workflows weiter.
- Nutzt `$json`, muss also **direkt an Webhook3** hängen (als zusätzlicher Zweig
  neben der bestehenden Kette, z. B. zu HighLevel). Steht er an anderer Stelle,
  `$json` durch `$('Webhook3').item.json` ersetzen.

## Nächste Schritte

1. Workflow „CF Bulls and Bears Preise“ in n8n öffnen.
2. Inhalt von `n8n/meta-capi-lead-node.json` einfügen und Webhook3 → neuer Node verbinden.
3. `PIXEL_ID_HIER` und `ACCESS_TOKEN_HIER` ersetzen
   (Events Manager → Datenquelle → Einstellungen → Conversions API → Zugriffsschlüssel generieren).
   Besser: Token als n8n-Credential (Query Auth) statt im Klartext.
4. Zum Testen `"test_event_code": "TESTxxxx"` auf oberster Ebene des Bodies ergänzen
   (neben `data`), eine Testanmeldung abschicken und im Events Manager unter
   „Events testen“ prüfen. Danach wieder entfernen.
5. Workflow speichern, aktiv lassen.
6. Optional: Meta Pixel mit Cookie-Einwilligung auf der Seite einbauen, mit
   `fbq('track', 'Lead', {}, {eventID: event_id})`, damit Browser- und Server-Event
   dedupliziert werden und `fbp` gefüllt ist.
7. Die geänderte HTML-Seite in Wix aktualisieren.

## Was in der letzten Sitzung nicht ging

- Die n8n-MCP-Verbindung kann Workflows nur lesen/starten, nicht bearbeiten, und sieht
  „CF Bulls and Bears Preise“ nicht (nur „Dashboard Daten bauen“).
- Die Cloud-Umgebung blockiert `n8n.app.gympilot.de` (Netzwerk-Einstellung).
- Claude in Chrome gibt es nur in lokalen Sitzungen.

Für die neue Sitzung also eine dieser Varianten:
- **Lokal mit Claude in Chrome** (`claude --chrome` oder `/chrome`), in n8n eingeloggt, oder
- **Cloud-Sitzung** mit `n8n.app.gympilot.de` unter „Allowed domains“ plus n8n-API-Key
  (n8n → Settings → n8n API). Dann über `GET/PUT /api/v1/workflows/{id}` bearbeiten.
