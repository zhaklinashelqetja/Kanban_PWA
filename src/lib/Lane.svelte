<script>
  import IssueCard from './IssueCard.svelte'
  import { board, moveIssue, pointsOf } from './store.svelte.js'

  let { name } = $props()

  // nur die Issues dieser Lane
  const issues = $derived(board.issues.filter((i) => i.lane === name))
  const points = $derived(pointsOf(name))

  let over = $state(false) // true, solange ein Issue über der Lane schwebt

  function onDrop(e) {
    e.preventDefault()
    over = false
    moveIssue(e.dataTransfer.getData('text/plain'), name)
  }
</script>

<!-- preventDefault bei dragover ist nötig, sonst erlaubt der Browser kein Droppen -->
<section
  role="group"
  aria-label={name}
  ondragover={(e) => { e.preventDefault(); over = true }}
  ondragleave={() => (over = false)}
  ondrop={onDrop}
  class="flex min-h-64 flex-col rounded-xl border p-3 transition-colors
    {over ? 'border-moss bg-moss/10' : 'border-line bg-paper'}"
>
  <header class="mb-3 flex items-baseline justify-between border-b border-line pb-2">
    <h2 class="font-display text-xl">{name}</h2>
    <span class="text-sm text-ink/60">{points} SP · {issues.length}</span>
  </header>

  <div class="flex flex-col gap-3">
    {#each issues as issue (issue.id)}
      <IssueCard {issue} />
    {/each}
  </div>
</section>