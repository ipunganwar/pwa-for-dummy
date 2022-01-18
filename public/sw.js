
importScripts('/src/js/idb.js')
importScripts('/src/js/utils.js')

var CACHE_STATIC_NAME = 'static-v7';
var CACHE_DYNAMIC_NAME = 'dynamic-v2';
const STATIC_FILE = [
  '/',
  '/index.html',
  '/offline.html',
  '/src/js/app.js',
  '/src/js/feed.js',
  '/src/js/idb.js',
  '/src/js/promise.js',
  '/src/js/fetch.js',
  '/src/js/material.min.js',
  '/src/css/app.css',
  '/src/css/feed.css',
  '/src/images/main-image.jpg',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
]
self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function(cache) {
        console.log('[Service Worker] Precaching App Shell');
        cache.addAll(STATIC_FILE);
      })
  )
});


self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});

// *** OFFLINE-FALLBACK
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//       .then(function(response) {
//         if (response) {
//           return response;
//         } else {
//           return fetch(event.request)
//             .then(function(res) {
//               return caches.open(CACHE_DYNAMIC_NAME)
//                 .then(function(cache) {
//                   cache.put(event.request.url, res.clone());
//                   return res;
//                 })
//             })
//             .catch(function(err) {
//               return caches.open(CACHE_STATIC_NAME)
//               .then(cache => {
//                 return cache.match('/offline.html')
//               })
//             });
//         }
//       })
//   );
// });


// *** CACHE-ONLY
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//   );
// });

// *** NETWORK-ONLY
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     fetch(event.request)
//   );
// });

// *** NETWORK WITH CACHE FALLBACK
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     fetch(event.request)
//     .then(res => {
//       return caches.open(CACHE_DYNAMIC_NAME)
//               .then(function(cache) {
//                 cache.put(event.request.url, res.clone());
//                  return res;
//              })
//     })
//     .catch(err => {
//         return caches.match(event.request)
//     })
//   )
// })

// *** CACHE Then Network & Dynamic Caches
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.open(CACHE_DYNAMIC_NAME)
//     .then(cache => {
//       return fetch(event.request)
//       .then(response => {
//         cache.put(event.request, response.clone())
//         return response
//       })
//     })
//   );
// });


// *** CACHE Then Network And Support Offline Fallback
self.addEventListener('fetch', function(event) {
  const url = 'https://food-ninja-pwa-23296.firebaseio.com/posts'

  if (event.request.url.indexOf(url) > -1) {
    event.respondWith(
      fetch(event.request).then(res => {
        let cloneRes = res.clone()
        cloneRes.json().then(data => {
          for (let key in data) {
            writeData('posts', data[key])
          }
        })

        return res
      })
    );
  } else if (isInArray(event.request.url, STATIC_FILE)) {
    event.respondWith(
      caches.match(event.request)
    );
  } else {
    // Fallback with offline strategy

    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          if (response) {
            return response;
          } else {
            return fetch(event.request)
              .then(function(res) {
                return res;
              })
              .catch(function(err) {
                return caches.open(CACHE_STATIC_NAME)
                .then(cache => {
                  return cache.match('/offline.html')
                })
              });
          }
        })
    );
  }
  
});