// date-fns: Bibliothek zum Formatieren von Datum und Uhrzeit
import { format } from 'date-fns'

// Hilfsfunktion: lädt eine Datei im Browser herunter.
function download(filename, content, type) {
  // Blob = Datei im Arbeitsspeicher, createObjectURL macht daraus eine temporäre Adresse
  const url = URL.createObjectURL(new Blob([content], { type }))
  // Unsichtbarer Link, der auf diese Adresse zeigt
  const a = document.createElement('a')
  a.href = url
  a.download = filename // "download" sagt dem Browser: speichern statt öffnen
  a.click() // Klick simulieren -> Download startet
  URL.revokeObjectURL(url) // temporäre Adresse wieder freigeben (Speicher aufräumen)
}

// Wandelt ein Datum in das ICS-Format um, z. B. 20261102T083000
// Das 'T' steht in Anführungszeichen, damit es als normaler Buchstabe zählt
const icsDate = (iso) => format(new Date(iso), "yyyyMMdd'T'HHmmss")

// Ein Issue als Kalender-Datei (.ics) exportieren
export function exportIcs(issue) {
  // Eine ICS-Datei ist reiner Text, Zeile für Zeile nach einem festen Muster
  const ics = [
    'BEGIN:VCALENDAR', // Anfang der Kalender-Datei
    'VERSION:2.0', // ICS-Version
    'PRODID:-//Kanban PWA//DE', // Name des Programms, das die Datei erzeugt hat
    'BEGIN:VEVENT', // Anfang eines Termins
    `UID:${issue.id}`, // eindeutige ID des Termins
    `DTSTAMP:${icsDate(new Date())}`, // Zeitpunkt, an dem die Datei erzeugt wurde
    `DTSTART:${icsDate(issue.due)}`, // Start = Due-Date des Issues
    `DTEND:${icsDate(issue.due)}`, // Ende = gleicher Zeitpunkt (Termin ohne Dauer)
    `SUMMARY:${issue.title}`, // Titel des Termins
    // Beschreibung; Zeilenumbrüche müssen in ICS als \n (Text) geschrieben werden
    `DESCRIPTION:${issue.description.replace(/\n/g, '\\n')} (Priorität: ${issue.priority}, Story Points: ${issue.points})`,
    'END:VEVENT', // Ende des Termins
    'END:VCALENDAR' // Ende der Kalender-Datei
  ].join('\r\n') // ICS verlangt als Zeilenende \r\n
  download(`${issue.title}.ics`, ics, 'text/calendar')
}

// Alle Issues als CSV-Datei exportieren (Tabelle, die Excel/Numbers öffnen kann)
export function exportCsv(issues) {
  // Erste Zeile: die Spaltenüberschriften
  const head = ['Title', 'Description', 'Lane', 'Created', 'Due', 'StoryPoints', 'Priority']
  // Jeder Wert kommt in Anführungszeichen, damit Kommas im Text die Spalten nicht kaputt machen.
  // Ein " im Text wird verdoppelt ("") – so verlangt es das CSV-Format.
  const cell = (v) => `"${String(v).replace(/"/g, '""')}"`
  // Pro Issue eine Zeile: Werte in der Reihenfolge der Überschriften, mit Komma getrennt
  const rows = issues.map((i) =>
    [i.title, i.description, i.lane, i.created, i.due, i.points, i.priority].map(cell).join(',')
  )
  // Überschrift + alle Zeilen, getrennt durch Zeilenumbruch
  download('kanban.csv', [head.join(','), ...rows].join('\n'), 'text/csv')
}

// Ein Issue mit der Web Share API teilen (Teilen-Menü des Geräts)
export async function shareIssue(issue) {
  // Der Text, der geteilt wird: Titel, Beschreibung, Fälligkeit, Priorität, Punkte
  const text = `${issue.title}\n${issue.description}\nFällig: ${format(new Date(issue.due), 'dd.MM.yyyy HH:mm')}\nPriorität: ${issue.priority} · ${issue.points} SP`
  // Prüfen, ob der Browser die Web Share API kennt (z. B. Handy, Safari)
  if (navigator.share) {
    try {
      await navigator.share({ title: issue.title, text }) // öffnet das Teilen-Menü
    } catch {
      // Nutzer hat das Menü geschlossen -> das löst einen Fehler aus, wir ignorieren ihn
    }
  } else {
    // Fallback für Browser ohne Web Share API (z. B. Desktop-Firefox):
    // Text in die Zwischenablage kopieren und Bescheid geben
    await navigator.clipboard.writeText(text)
    alert('Teilen wird hier nicht unterstützt – Text wurde kopiert.')
  }
}