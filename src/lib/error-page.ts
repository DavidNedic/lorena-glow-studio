export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <title>Seite konnte nicht geladen werden · The Golden Cosmetics</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 'Hanken Grotesk', system-ui, sans-serif; background: #F8F0EC; color: #2f241f; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 999px; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #2f241f; color: #F8F0EC; }
      .secondary { background: transparent; color: #2f241f; border-color: #2f241f; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Die Seite konnte nicht geladen werden</h1>
      <p>Da ist etwas schiefgelaufen. Versuch es bitte noch einmal oder wähle einen Bereich.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Erneut versuchen</button>
        <a class="secondary" href="/behandlungen">Behandlungen</a>
        <a class="secondary" href="/academy">Academy</a>
        <a class="secondary" href="/">Startseite</a>
      </div>
    </div>
  </body>
</html>`;
}
