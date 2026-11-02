<script>
  // addIssue speichert ein neues Issue im Store (und damit in localStorage)
  import { addIssue } from './store.svelte.js'

  let dialog // Referenz auf das <dialog>-Element (wird unten mit bind:this gefüllt)

  // Von +page.svelte über bind:this aufrufbar: dialog.open() zeigt den Dialog an.
  // showModal() öffnet das <dialog> als Fenster über der Seite mit abgedunkeltem Hintergrund
  // (Esc schließt es, der Rest der Seite ist solange gesperrt).
  export function open() {
    dialog.showModal()
  }

  // Wird aufgerufen, wenn das Formular abgeschickt wird
  function onSubmit(e) {
    e.preventDefault() // verhindert, dass der Browser die Seite neu lädt
    // FormData liest alle Felder des Formulars anhand ihres name="..." aus
    const f = new FormData(e.target)
    addIssue({
      title: f.get('title'),
      description: f.get('description'),
      // datetime-local liefert einen Text wie "2026-11-05T14:00";
      // wir machen daraus ein Datum und speichern es als ISO-Text (einheitliches Format)
      due: new Date(f.get('due')).toISOString(),
      // Formularwerte sind immer Text, deshalb Number(), damit wir damit rechnen können
      points: Number(f.get('points')),
      priority: f.get('priority')
    })
    // id, lane ("Do") und Creation-Date ergänzt addIssue im Store selbst
    e.target.reset() // Formular leeren für das nächste Issue
    dialog.close() // Dialog schließen
  }
</script>

<!-- Das HTML-Element <dialog> ist das Pop-up-Fenster.
     bind:this speichert das Element in der Variable "dialog" oben. -->
<dialog bind:this={dialog} class="m-auto w-full max-w-md rounded-xl bg-card p-6 text-ink shadow-xl">
  <h2 class="font-display text-2xl">Neues Issue</h2>

  <!-- onsubmit läuft beim Klick auf "Anlegen" (nur wenn alle required-Felder ausgefüllt sind) -->
  <form onsubmit={onSubmit} class="mt-4 space-y-3 text-sm">
    <!-- name="..." ist der Schlüssel, unter dem FormData den Wert findet; required = Pflichtfeld -->
    <label class="block">Titel
      <input name="title" required class="mt-1 w-full rounded border border-line bg-white px-2 py-1.5" />
    </label>

    <label class="block">Beschreibung
      <textarea name="description" rows="3" class="mt-1 w-full rounded border border-line bg-white px-2 py-1.5"></textarea>
    </label>

    <!-- type="datetime-local": Browser zeigt eine Auswahl für Datum und Uhrzeit -->
    <label class="block">Fällig am
      <input name="due" type="datetime-local" required class="mt-1 w-full rounded border border-line bg-white px-2 py-1.5" />
    </label>

    <div class="flex gap-3">
      <!-- {#each}: erzeugt pro Zahl in der Liste eine <option> (typische Story-Point-Werte) -->
      <label class="block flex-1">Story Points
        <select name="points" class="mt-1 w-full rounded border border-line bg-white px-2 py-1.5">
          {#each [1, 2, 3, 5, 8, 13] as p}<option value={p}>{p}</option>{/each}
        </select>
      </label>
      <!-- "selected" legt fest, dass "Mittel" vorausgewählt ist -->
      <label class="block flex-1">Priorität
        <select name="priority" class="mt-1 w-full rounded border border-line bg-white px-2 py-1.5">
          <option>Niedrig</option>
          <option selected>Mittel</option>
          <option>Hoch</option>
        </select>
      </label>
    </div>

    <div class="flex justify-end gap-2 pt-2">
      <!-- type="button": schließt nur den Dialog und schickt das Formular nicht ab -->
      <button type="button" onclick={() => dialog.close()} class="rounded px-3 py-1.5 hover:bg-line">Abbrechen</button>
      <!-- type="submit": schickt das Formular ab und löst onSubmit aus -->
      <button type="submit" class="rounded bg-ink px-4 py-1.5 text-paper hover:bg-moss">Anlegen</button>
    </div>
  </form>
</dialog>