<script>
  import { addIssue } from './store.svelte.js'

  let dialog // Referenz auf das <dialog>-Element

  // Von +page.svelte über bind:this aufrufbar
  export function open() {
    dialog.showModal()
  }

  function onSubmit(e) {
    e.preventDefault()
    const f = new FormData(e.target)
    addIssue({
      title: f.get('title'),
      description: f.get('description'),
      due: new Date(f.get('due')).toISOString(),
      points: Number(f.get('points')),
      priority: f.get('priority')
    })
    e.target.reset()
    dialog.close()
  }
</script>

<dialog bind:this={dialog} class="m-auto w-full max-w-md rounded-xl bg-card p-6 text-ink shadow-xl">
  <h2 class="font-display text-2xl">Neues Issue</h2>

  <form onsubmit={onSubmit} class="mt-4 space-y-3 text-sm">
    <label class="block">Titel
      <input name="title" required class="mt-1 w-full rounded border border-line bg-white px-2 py-1.5" />
    </label>

    <label class="block">Beschreibung
      <textarea name="description" rows="3" class="mt-1 w-full rounded border border-line bg-white px-2 py-1.5"></textarea>
    </label>

    <label class="block">Fällig am
      <input name="due" type="datetime-local" required class="mt-1 w-full rounded border border-line bg-white px-2 py-1.5" />
    </label>

    <div class="flex gap-3">
      <label class="block flex-1">Story Points
        <select name="points" class="mt-1 w-full rounded border border-line bg-white px-2 py-1.5">
          {#each [1, 2, 3, 5, 8, 13] as p}<option value={p}>{p}</option>{/each}
        </select>
      </label>
      <label class="block flex-1">Priorität
        <select name="priority" class="mt-1 w-full rounded border border-line bg-white px-2 py-1.5">
          <option>Niedrig</option>
          <option selected>Mittel</option>
          <option>Hoch</option>
        </select>
      </label>
    </div>

    <div class="flex justify-end gap-2 pt-2">
      <button type="button" onclick={() => dialog.close()} class="rounded px-3 py-1.5 hover:bg-line">Abbrechen</button>
      <button type="submit" class="rounded bg-ink px-4 py-1.5 text-paper hover:bg-moss">Anlegen</button>
    </div>
  </form>
</dialog>