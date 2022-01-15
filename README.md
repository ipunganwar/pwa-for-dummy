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

## "Listenable" Events in Service Worker
| Event | Source |
|-------|--------|
| Fetch | Browser or Page-related Javascript initiates a Fetch (HTTP Request) |
| Push Notification | Service Worker receives Web Push Notification (from Server) |
| Notification Interaction | User interacts with displayed notification |
| Background Sync | Service Worker receives background sync event (e.g. Internet Connection was restored) |
| Service Worker Livecycle | Service Worker Phase changes |