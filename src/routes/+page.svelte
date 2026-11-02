<script>
  import Lane from '../lib/Lane.svelte'
  import IssueDialog from '../lib/IssueDialog.svelte'
  import { LANES, board } from '../lib/store.svelte.js'
  import { exportCsv } from '../lib/export.js'

  // Variable zum Speichern der Dialog-Komponente
  let dialog
</script>

<!-- Hauptbereich der Kanban-Seite -->
<main class="mx-auto max-w-7xl px-4 py-6">

  <!-- Kopfbereich mit Überschrift und Beschreibung -->
  <header class="mb-6 flex flex-wrap items-end justify-between gap-3">
    <div>
      <!-- Titel der Seite -->
      <h1 class="font-display text-4xl">Kanban</h1>

      <!-- Kurze Erklärung zur Bedienung des Kanban-Boards -->
      <p class="text-sm text-ink/60">Ziehen &amp; ablegen, um Issues zu verschieben.</p>
    </div>

    <!-- Bereich für die beiden Aktionsbuttons -->
    <div class="flex gap-2 text-sm">

      <!-- Beim Klick werden alle Issues aus dem Board als CSV exportiert -->
      <button onclick={() => exportCsv(board.issues)} class="rounded border border-line px-3 py-1.5 hover:bg-line">
        CSV exportieren
      </button>

      <!-- Beim Klick wird die open()-Funktion des Dialogs aufgerufen -->
      <button onclick={() => dialog.open()} class="rounded bg-ink px-4 py-1.5 text-paper hover:bg-moss">
        + Neues Issue
      </button>
    </div>
  </header>

  <!-- Grid-Layout für die vier Kanban-Spalten -->
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

    <!-- Durchläuft alle Elemente im Array LANES -->
    {#each LANES as lane (lane)}

      <!-- Erstellt für jede Spalte eine Lane-Komponente -->
      <!-- Der Name der aktuellen Spalte wird als Prop übergeben -->
      <Lane name={lane} />

    {/each}
  </div>
</main>

<!-- Bindet die Dialog-Komponente an die Variable dialog -->
<!-- Dadurch können wir von oben mit dialog.open() den Dialog öffnen -->
<IssueDialog bind:this={dialog} />