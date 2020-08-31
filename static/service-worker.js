/**
 * Service worker for the PWA. Handles the caching of the app's shell, and files used to create the shell,
 * such as stylesheets, jQuery and bootstrap.
 * @author Richard Hindes
 */

let CACHE_NAME = "cache_v1";
// Defines a list of files to be cached.
let urlsToCache = [];

/**
 * Upon registering the ServiceWorker, creates a cache with name CACHE_NAME and stores the files
 * defined in the urlsToCache list.
 *
 */
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache){
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

/** Whenever the browser tries to load a page,
 *  tries to instead serve a cached version of the page, if one exists.
 *
 */
self.addEventListener('fetch', function(event) {
  event.respondWith(
      fetch(event.request).catch(function(){
          return caches.match(event.request);
      })
  );
});