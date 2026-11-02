// Service Worker: speichert beim ersten Besuch alle Dateien im Cache,
// danach läuft die App komplett offline.
import { immutable, assets, prerendered } from '$app/manifest';
import { version } from '$app/env';

const CACHE = `kanban-${version}`;

// Build-Dateien + Dateien aus static/ + vorab erzeugte Seiten.
// Die Pfade sind relativ (die Startseite hat den Pfad ''), daher machen wir
// daraus vollständige URLs. '.' bedeutet: die Startseite selbst.
const ASSETS = [...immutable, ...assets, ...prerendered].map(
	(file) => new URL(file.path || '.', self.registration.scope).href
);

// Installieren: alle Dateien in den Cache legen
self.addEventListener('install', (event) => {
	event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});

// Aktivieren: alte Caches löschen
self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then(async (keys) => {
			for (const key of keys) {
				if (key !== CACHE) await caches.delete(key);
			}
		})
	);
});

// Anfragen: erst im Cache suchen, sonst aus dem Netz holen
self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;
	event.respondWith(caches.match(event.request).then((cached) => cached ?? fetch(event.request)));
});