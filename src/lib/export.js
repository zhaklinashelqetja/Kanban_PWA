import { format } from 'date-fns'

// Datei im Browser herunterladen
function download(filename, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// ICS-Datum (lokale Zeit, ohne Z): 20261102T083000
const icsDate = (iso) => format(new Date(iso), "yyyyMMdd'T'HHmmss")

// Einzelnes Issue als Kalender-Datei (.ics)
export function exportIcs(issue) {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kanban PWA//DE',
    'BEGIN:VEVENT',
    `UID:${issue.id}`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(issue.due)}`,
    `DTEND:${icsDate(issue.due)}`,
    `SUMMARY:${issue.title}`,
    `DESCRIPTION:${issue.description.replace(/\n/g, '\\n')} (Priorität: ${issue.priority}, Story Points: ${issue.points})`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')
  download(`${issue.title}.ics`, ics, 'text/calendar')
}

// Alle Issues als CSV (Felder mit " werden verdoppelt)
export function exportCsv(issues) {
  const head = ['Title', 'Description', 'Lane', 'Created', 'Due', 'StoryPoints', 'Priority']
  const cell = (v) => `"${String(v).replace(/"/g, '""')}"`
  const rows = issues.map((i) =>
    [i.title, i.description, i.lane, i.created, i.due, i.points, i.priority].map(cell).join(',')
  )
  download('kanban.csv', [head.join(','), ...rows].join('\n'), 'text/csv')
}

// Einzelnes Issue mit der Web Share API teilen
export async function shareIssue(issue) {
  const text = `${issue.title}\n${issue.description}\nFällig: ${format(new Date(issue.due), 'dd.MM.yyyy HH:mm')}\nPriorität: ${issue.priority} · ${issue.points} SP`
  if (navigator.share) {
    try {
      await navigator.share({ title: issue.title, text })
    } catch {
      // Nutzer hat abgebrochen -> nichts tun
    }
  } else {
    // Fallback für Browser ohne Web Share API (z. B. Desktop-Firefox)
    await navigator.clipboard.writeText(text)
    alert('Teilen wird hier nicht unterstützt – Text wurde kopiert.')
  }
}