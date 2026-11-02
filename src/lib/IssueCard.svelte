<script>
  // date-fns: format = Datum als Text, formatDistanceToNow = "in 3 Tagen", isPast = liegt in der Vergangenheit?
  import { format, formatDistanceToNow, isPast } from 'date-fns'
  // deutsche Sprache für die Datums-Texte
  import { de } from 'date-fns/locale'
  // Funktionen aus unseren eigenen Dateien
  import { deleteIssue } from './store.svelte.js'
  import { exportIcs, shareIssue } from './export.js'

  // $props: Die Karte bekommt von der Lane ein Issue übergeben (<IssueCard {issue} />)
  let { issue } = $props()

  // Warnung, wenn "jetzt" nach dem Due-Date liegt.
  // $derived: Der Wert wird automatisch neu berechnet, wenn sich das Issue ändert.
  const overdue = $derived(isPast(new Date(issue.due)))

  // Welche Farbe gehört zu welcher Priorität (Tailwind-Klassen)
  const prioColor = { Hoch: 'bg-clay', Mittel: 'bg-amber-500', Niedrig: 'bg-moss' }

  // Wird aufgerufen, sobald man die Karte zu ziehen beginnt.
  // Wir legen die ID des Issues in dataTransfer, die Lane liest sie beim Drop wieder aus.
  function onDragStart(e) {
    e.dataTransfer.setData('text/plain', issue.id)
    e.dataTransfer.effectAllowed = 'move' // Karte wird verschoben, nicht kopiert
  }
</script>

<!-- draggable="true" erlaubt das Ziehen, ondragstart startet unsere Funktion.
     Der Rand ist rot (clay), wenn das Issue überfällig ist, sonst normal. -->
<article
  draggable="true"
  ondragstart={onDragStart}
  class="cursor-grab rounded-lg border bg-card p-3 shadow-sm active:cursor-grabbing
    {overdue ? 'border-clay' : 'border-line'}"
>
  <!-- Kopf: Titel links, farbiger Punkt für die Priorität rechts -->
  <div class="flex items-start justify-between gap-2">
    <h3 class="font-display text-lg leading-tight">{issue.title}</h3>
    <span class="mt-1 h-2.5 w-2.5 shrink-0 rounded-full {prioColor[issue.priority]}" title="Priorität: {issue.priority}"></span>
  </div>

  <!-- Beschreibung nur anzeigen, wenn eine eingegeben wurde -->
  {#if issue.description}
    <p class="mt-1 text-sm text-ink/70">{issue.description}</p>
  {/if}

  <!-- Datumsangaben: Erstelldatum und Due-Date, mit date-fns formatiert -->
  <dl class="mt-3 space-y-0.5 text-xs text-ink/60">
    <div>Erstellt: {format(new Date(issue.created), 'dd.MM.yyyy', { locale: de })}</div>
    <!-- formatDistanceToNow mit addSuffix ergibt Texte wie "in 3 Tagen" oder "vor 2 Tagen" -->
    <div>Fällig: {format(new Date(issue.due), 'dd.MM.yyyy HH:mm', { locale: de })}
      ({formatDistanceToNow(new Date(issue.due), { locale: de, addSuffix: true })})</div>
  </dl>

  <!-- Visuelle Warnung, nur wenn das Due-Date schon vorbei ist -->
  {#if overdue}
    <p class="mt-2 rounded bg-clay/15 px-2 py-1 text-xs font-semibold text-clay">⚠ Überfällig</p>
  {/if}

  <!-- Fußzeile: Story Points links, Buttons rechts -->
  <div class="mt-3 flex items-center justify-between">
    <span class="rounded-full bg-ink px-2 py-0.5 text-xs text-paper">{issue.points} SP</span>
    <div class="flex gap-1 text-xs">
      <!-- () => ... ist nötig, damit die Funktion erst beim Klick läuft und nicht schon beim Anzeigen -->
      <button class="rounded px-2 py-1 hover:bg-line" onclick={() => exportIcs(issue)}>ICS</button>
      <button class="rounded px-2 py-1 hover:bg-line" onclick={() => shareIssue(issue)}>Teilen</button>
      <button class="rounded px-2 py-1 text-clay hover:bg-line" onclick={() => deleteIssue(issue.id)}>Löschen</button>
    </div>
  </div>
</article>