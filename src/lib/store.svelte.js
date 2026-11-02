// Zentraler Zustand des Boards. Alles hier wird automatisch in localStorage gespeichert.
// Wichtig: Der Dateiname endet auf .svelte.js, nur dann darf man $state in einer .js-Datei benutzen.

// Die Namen der vier Lanes, in der Reihenfolge, in der sie angezeigt werden
export const LANES = ['Do', 'Doing', 'Done', 'Archiv']
// Unter diesem Namen liegen die Issues im localStorage
const KEY = 'kanban-issues'

// Gespeicherte Issues laden (oder leere Liste)
function load() {
  try {
    // getItem gibt den gespeicherten Text zurück (oder null, wenn noch nichts gespeichert ist).
    // JSON.parse macht aus dem Text wieder ein Array. "?? []" nimmt eine leere Liste, wenn null herauskommt.
    return JSON.parse(localStorage.getItem(KEY)) ?? []
  } catch {
    // Fehler (z. B. kaputte Daten, oder beim Build gibt es noch keinen localStorage) -> leere Liste
    return []
  }
}

// Das Array steckt in einem Objekt (board.issues), weil man ein exportiertes $state
// nicht neu zuweisen darf, aber seine Eigenschaften schon.
export const board = $state({ issues: load() })

// Bei jeder Änderung speichern (spiegelt auch den Platz = lane)
function save() {
  // localStorage kann nur Text speichern, deshalb JSON.stringify (Array -> Text)
  localStorage.setItem(KEY, JSON.stringify(board.issues))
}

// Neues Issue anlegen. "data" kommt aus dem Dialog (title, description, due, points, priority)
export function addIssue(data) {
  board.issues.push({
    id: crypto.randomUUID(), // eindeutige ID, damit wir jedes Issue wiederfinden
    lane: 'Do', // neue Issues starten immer in der Lane "Do"
    created: new Date().toISOString(), // Creation-Date = jetzt
    ...data // die Felder aus dem Dialog dazukopieren
  })
  save()
}

// Issue löschen: behalte alle Issues, deren ID nicht die gesuchte ist
export function deleteIssue(id) {
  board.issues = board.issues.filter((i) => i.id !== id)
  save()
}

// Issue in eine andere Lane verschieben (wird beim Drop aufgerufen)
export function moveIssue(id, lane) {
  const issue = board.issues.find((i) => i.id === id) // Issue mit dieser ID suchen
  // Abbrechen, wenn es nicht gefunden wurde oder schon in dieser Lane liegt
  if (!issue || issue.lane === lane) return
  issue.lane = lane // neuen Platz setzen -> die Oberfläche aktualisiert sich automatisch
  save() // neuen Platz im localStorage speichern
  // Wenn ein Item auf Done gestellt wird -> Notification
  if (lane === 'Done') notifyDone(issue)
}

// Zeigt eine Browser-Benachrichtigung an
function notifyDone(issue) {
  // Abbrechen, wenn der Browser keine Notifications kann
  if (!('Notification' in window)) return
  // Kleine Funktion, die die Benachrichtigung mit Titel, Text (= Issue-Titel) und Icon erzeugt
  const show = () => new Notification('Issue erledigt ✓', { body: issue.title, icon: './icon-192.png' })
  if (Notification.permission === 'granted') show() // schon erlaubt -> sofort anzeigen
  else if (Notification.permission === 'default') {
    // noch nicht gefragt -> um Erlaubnis bitten, danach nur bei "granted" anzeigen
    Notification.requestPermission().then((p) => p === 'granted' && show())
  }
  // Wenn die Erlaubnis abgelehnt wurde ("denied"), passiert nichts
}

// Summe der Story Points pro Lane
export function pointsOf(lane) {
  return board.issues
    .filter((i) => i.lane === lane) // nur Issues dieser Lane
    .reduce((sum, i) => sum + Number(i.points), 0) // alle Punkte addieren, Start bei 0
}