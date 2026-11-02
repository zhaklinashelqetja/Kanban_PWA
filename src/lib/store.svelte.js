// Zentraler Zustand des Boards. Alles hier wird automatisch in localStorage gespeichert.

export const LANES = ['Do', 'Doing', 'Done', 'Archiv']
const KEY = 'kanban-issues'

// Gespeicherte Issues laden (oder leere Liste)
function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? []
  } catch {
    return []
  }
}

// $state macht das Array "reaktiv": ändert es sich, aktualisiert Svelte die Oberfläche
export const board = $state({ issues: load() })

// Bei jeder Änderung speichern (spiegelt auch den Platz = lane)
function save() {
  localStorage.setItem(KEY, JSON.stringify(board.issues))
}

export function addIssue(data) {
  board.issues.push({
    id: crypto.randomUUID(),
    lane: 'Do',
    created: new Date().toISOString(),
    ...data
  })
  save()
}

export function deleteIssue(id) {
  board.issues = board.issues.filter((i) => i.id !== id)
  save()
}

export function moveIssue(id, lane) {
  const issue = board.issues.find((i) => i.id === id)
  if (!issue || issue.lane === lane) return
  issue.lane = lane
  save()
  // Wenn ein Item auf Done gestellt wird -> Notification
  if (lane === 'Done') notifyDone(issue)
}

function notifyDone(issue) {
  if (!('Notification' in window)) return
  const show = () => new Notification('Issue erledigt ✓', { body: issue.title, icon: './icon-192.png' })
  if (Notification.permission === 'granted') show()
  else if (Notification.permission === 'default') {
    Notification.requestPermission().then((p) => p === 'granted' && show())
  }
}

// Summe der Story Points pro Lane
export function pointsOf(lane) {
  return board.issues.filter((i) => i.lane === lane).reduce((sum, i) => sum + Number(i.points), 0)
}