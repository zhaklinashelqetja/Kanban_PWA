<script>
  import IssueCard from './IssueCard.svelte'
  // board = alle Issues, moveIssue = Issue in andere Lane verschieben,
  // pointsOf = Summe der Story Points einer Lane
  import { board, moveIssue, pointsOf } from './store.svelte.js'

  // $props: Die Seite übergibt den Namen der Lane (<Lane name="Do" />)
  let { name } = $props()

  // nur die Issues dieser Lane.
  // $derived: wird automatisch neu berechnet, wenn sich board.issues ändert.
  const issues = $derived(board.issues.filter((i) => i.lane === name))
  // Summe der Story Points dieser Lane (ebenfalls automatisch aktuell)
  const points = $derived(pointsOf(name))

  // $state: veränderbarer Wert, bei dem Svelte die Anzeige mit aktualisiert
  let over = $state(false) // true, solange ein Issue über der Lane schwebt

  // Wird aufgerufen, wenn man eine Karte über der Lane loslässt (Drop)
  function onDrop(e) {
    e.preventDefault() // verhindert die Standard-Reaktion des Browsers auf gedroppte Daten
    over = false // Hervorhebung wieder ausschalten
    // ID der gezogenen Karte auslesen (von IssueCard mit setData gespeichert)
    // und das Issue in diese Lane (name) verschieben
    moveIssue(e.dataTransfer.getData('text/plain'), name)
  }
</script>

<!-- Die ganze Lane ist das Drop-Ziel.
     ondragover: läuft ständig, solange eine Karte darüber schwebt.
       preventDefault bei dragover ist nötig, sonst erlaubt der Browser kein Droppen.
     ondragleave: Karte verlässt die Lane -> Hervorhebung aus.
     ondrop: Karte wird losgelassen -> onDrop läuft.
     role und aria-label: Beschreibung für Screenreader (und damit Svelte nicht warnt).
     Die Klasse wechselt je nach "over": grüner Rand und Hintergrund, solange man darüber schwebt. -->
<section
  role="group"
  aria-label={name}
  ondragover={(e) => { e.preventDefault(); over = true }}
  ondragleave={() => (over = false)}
  ondrop={onDrop}
  class="flex min-h-64 flex-col rounded-xl border p-3 transition-colors
    {over ? 'border-moss bg-moss/10' : 'border-line bg-paper'}"
>
  <!-- Kopf der Lane: Name links, rechts "Summe SP · Anzahl Issues" -->
  <header class="mb-3 flex items-baseline justify-between border-b border-line pb-2">
    <h2 class="font-display text-xl">{name}</h2>
    <span class="text-sm text-ink/60">{points} SP · {issues.length}</span>
  </header>

  <!-- Pro Issue eine Karte. (issue.id) ist der Schlüssel: So erkennt Svelte jede Karte
       wieder, auch wenn sie verschoben wird. -->
  <div class="flex flex-col gap-3">
    {#each issues as issue (issue.id)}
      <IssueCard {issue} />
    {/each}
  </div>
</section>