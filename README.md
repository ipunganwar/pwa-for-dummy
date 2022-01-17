# pwa-for-dummy

# Service Worker
SW is basically js script running in background process even your application is closed

Core Building Block:
- Background Sync
- Caching
- Web Push
- Application Manifest - Allow install to Homescreen
- Responsive Design
- Geolocation API
- Media API - Access Device Camera and Microphone

### Service Worker FAQ
**Is the Service Worker installed everytime I refresh the page?** <br>
No, whilst the browser does of course (naturally) execute the `register()`  code everytime you refresh the page, it won't install the service worker if the service worker file hasn't changed. If it only changed by 1 byte though, it'll install it as a new service worker (but wait with the activation as explained).


## Manifest
- Manifest Property is metadata of your web app in JSON format

| Property Name | Value | Sample |
|---------------|-------|--------|
| name          | Long name of app (e.g. on SplashScreen) | "name": "Test App01"|
| short_name    | Short name of app (e.g. below icon)   |   "short_name": "App01"|
| start_url     | Which page to load on startup |   "start_url": "/index.html"  |
| scope         | Which pages all included in "PWA Experience"  |   "scope": "." |
| display       | Should it look like a standalone app ? | "display":"standalone" |
| background_color |  Background whilst loading & on SplashScreen | "background_color": "fff" |
| theme_color | Theme color (e.g ont top bar in task switcher) | "theme_color":"fff" |
| description | Description (e.g. as favorite) | "description": "Test running until you sweaty!" |
| dir | Read direction of your app | "dir": "ltr" |
| lang | Main language of your app | "lang": "en_US" |
| orientation | Set (and enfore) default orientation | "orientation":"landscape"|
| icons | Configure icons (e.g. homescreen) | "icons": [Arrays of Object] |

### Safari Support
in your index.html add this tag:
```
<meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <meta name="apple-mobile-web-app-title" content="PWAGram">
  <link rel="apple-touch-icon" href="/src/images/icons/apple-icon-57x57.png" sizes="57x57">
  <link rel="apple-touch-icon" href="/src/images/icons/apple-icon-60x60.png" sizes="60x60">
  <link rel="apple-touch-icon" href="/src/images/icons/apple-icon-72x72.png" sizes="72x72">
  <link rel="apple-touch-icon" href="/src/images/icons/apple-icon-76x76.png" sizes="76x76">
  <link rel="apple-touch-icon" href="/src/images/icons/apple-icon-114x114.png" sizes="114x114">
  <link rel="apple-touch-icon" href="/src/images/icons/apple-icon-120x120.png" sizes="120x120">
  <link rel="apple-touch-icon" href="/src/images/icons/apple-icon-144x144.png" sizes="144x144">
  <link rel="apple-touch-icon" href="/src/images/icons/apple-icon-152x152.png" sizes="152x152">
  <link rel="apple-touch-icon" href="/src/images/icons/apple-icon-180x180.png" sizes="180x180">
```

### Source
- https://web.dev/add-manifest/?utm_source=devtools
- https://web.dev/customize-install/
- https://jakearchibald.com/2014/offline-cookbook/#cache-persistence
- https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

## "Listenable" Events in Service Worker
| Event | Source |
|-------|--------|
| Fetch | Browser or Page-related Javascript initiates a Fetch (HTTP Request) |
| Push Notification | Service Worker receives Web Push Notification (from Server) |
| Notification Interaction | User interacts with displayed notification |
| Background Sync | Service Worker receives background sync event (e.g. Internet Connection was restored) |
| Service Worker Livecycle | Service Worker Phase changes |

## Service Worker Lifecycle
- Install - Trigger by the browser
- Activate - Trigger by the browser
- Fetch - Trigger by your web-app


# Service Worker Strategy in Advanced

## Precache in Install
in first install, do a cache in first time:
```
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('cache-name-here')
            .then(cache => {
                cache.addAll(['array-of-cache-file'])
            })
    )
})
```

## Cache Only
it's similar look like this behaviour, matches with cache in cache-storage:
```
self.addEventListener('fetch', function(event) {
   event.respondWith(
     caches.match(event.request)
   );
});
```

## Network Only
it's similar look like this behaviour, only get from fetch request:
```
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request)
  );
});
```

## Network With Cache Fallback 
get from network first, if error will get from cache:
```
self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request)
        .catch(err => {
            return caches.match(event.request)
        })
    )
});
```

but we can enhancement the fallback like this one:
```
self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request)
        .then(res => {
            return caches.open(CACHE_DYNAMIC_NAME)
                .then(cache => {
                    cache.put(event.request.url, res.clone())
                    return res
                })
        })
        .catch(err => {
            return caches.match(event.request)
        })
    )
});
```

## Cache With Offline File Provide
if get from cache has error, we can provide with offline file fallback:
```
self.addEventListener('fetch', function(event) {
   event.respondWith(
     caches.match(event.request)
     .catch(err => {
         return caches.open('static-cache-v1')
            .then(cache => {
                return cache.match('/offline.html') ---> this the offline file we had been provide
            })
     })
   );
});
```

## Cache Then Network
returning most fastest response e.g. from Cache or Server

```
const url = 'https://httpbin.org/get'

self.addEventListener('fetch', function(event) {
    const promise1 = new Promise((resolve, reject) => {
        caches.match(url).then(response => {
            resolve(response)
        })
    })

    const promise2 = new Promise((resolve, reject) => {
        fetch(url).then(response => {
            resolve(response)
        })
    })

    Promise.race([promise1, promise2]).then(response => {
        return response
    })
})
```

## Cache Then Network & Dynamic Caches
This one strategy has one cons, your cache will save redundant cache-file and multiply the cache every time you made a request from web.
```
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(CACHE_DYNAMIC_NAME)
    .then(cache => {
      return fetch(event.request)
      .then(response => {
        cache.put(event.request, response.clone())
        return response
      })
    })
  );
});
```

## Cache Then Network And Support Offline Fallback
We have to config 2 condition, if url request match then return with first strategy, if fail we must provide with `Offline fallback`

```
self.addEventListener('fetch', function(event) {
  const url = 'https://httpbin.org/get'

  if (event.request.url.indexOf(url) > -1) {
    event.respondWith(
      caches.open(CACHE_DYNAMIC_NAME)
      .then(cache => {
        return fetch(event.request)
        .then(response => {
          cache.put(event.request, response.clone())
          return response
        })
      })
    );
  }

  else {
    // Fallback with offline strategy

    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          if (response) {
            return response;
          } else {
            return fetch(event.request)
              .then(function(res) {
                return caches.open(CACHE_DYNAMIC_NAME)
                  .then(function(cache) {
                    cache.put(event.request.url, res.clone());
                    return res;
                  })
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
```