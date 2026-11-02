<script>
  import Lane from '../lib/Lane.svelte'
  import IssueDialog from '../lib/IssueDialog.svelte'
  import { LANES, board } from '../lib/store.svelte.js'
  import { exportCsv } from '../lib/export.js'

  let dialog // Referenz auf die Dialog-Komponente
</script>

<main class="mx-auto max-w-7xl px-4 py-6">
  <header class="mb-6 flex flex-wrap items-end justify-between gap-3">
    <div>
      <h1 class="font-display text-4xl">Kanban</h1>
      <p class="text-sm text-ink/60">Ziehen &amp; ablegen, um Issues zu verschieben.</p>
    </div>
    <div class="flex gap-2 text-sm">
      <button onclick={() => exportCsv(board.issues)} class="rounded border border-line px-3 py-1.5 hover:bg-line">
        CSV exportieren
      </button>
      <button onclick={() => dialog.open()} class="rounded bg-ink px-4 py-1.5 text-paper hover:bg-moss">
        + Neues Issue
      </button>
    </div>
  </header>

  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {#each LANES as lane (lane)}
      <Lane name={lane} />
    {/each}
  </div>
</main>

<IssueDialog bind:this={dialog} />