<script>
  import { format, formatDistanceToNow, isPast } from 'date-fns'
  import { de } from 'date-fns/locale'
  import { deleteIssue } from './store.svelte.js'
  import { exportIcs, shareIssue } from './export.js'

  let { issue } = $props()

  // Warnung, wenn "jetzt" nach dem Due-Date liegt
  const overdue = $derived(isPast(new Date(issue.due)))

  const prioColor = { Hoch: 'bg-clay', Mittel: 'bg-amber-500', Niedrig: 'bg-moss' }

  // Beim Ziehen die ID mitgeben, die Lane liest sie beim Drop wieder aus
  function onDragStart(e) {
    e.dataTransfer.setData('text/plain', issue.id)
    e.dataTransfer.effectAllowed = 'move'
  }
</script>

<article
  draggable="true"
  ondragstart={onDragStart}
  class="cursor-grab rounded-lg border bg-card p-3 shadow-sm active:cursor-grabbing
    {overdue ? 'border-clay' : 'border-line'}"
>
  <div class="flex items-start justify-between gap-2">
    <h3 class="font-display text-lg leading-tight">{issue.title}</h3>
    <span class="mt-1 h-2.5 w-2.5 shrink-0 rounded-full {prioColor[issue.priority]}" title="Priorität: {issue.priority}"></span>
  </div>

  {#if issue.description}
    <p class="mt-1 text-sm text-ink/70">{issue.description}</p>
  {/if}

  <dl class="mt-3 space-y-0.5 text-xs text-ink/60">
    <div>Erstellt: {format(new Date(issue.created), 'dd.MM.yyyy', { locale: de })}</div>
    <div>Fällig: {format(new Date(issue.due), 'dd.MM.yyyy HH:mm', { locale: de })}
      ({formatDistanceToNow(new Date(issue.due), { locale: de, addSuffix: true })})</div>
  </dl>

  {#if overdue}
    <p class="mt-2 rounded bg-clay/15 px-2 py-1 text-xs font-semibold text-clay">⚠ Überfällig</p>
  {/if}

  <div class="mt-3 flex items-center justify-between">
    <span class="rounded-full bg-ink px-2 py-0.5 text-xs text-paper">{issue.points} SP</span>
    <div class="flex gap-1 text-xs">
      <button class="rounded px-2 py-1 hover:bg-line" onclick={() => exportIcs(issue)}>ICS</button>
      <button class="rounded px-2 py-1 hover:bg-line" onclick={() => shareIssue(issue)}>Teilen</button>
      <button class="rounded px-2 py-1 text-clay hover:bg-line" onclick={() => deleteIssue(issue.id)}>Löschen</button>
    </div>
  </div>
</article>