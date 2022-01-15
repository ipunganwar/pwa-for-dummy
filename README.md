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
- Manifest Property (JSON)

| Property Name | Value | Sample |
|---------------|-------|
| name          | Long name of app (e.g. on SplashScreen) | "name": "Test App01"|
| short_name    | Short name of app (e.g. below icon)   |   "short_name": "App01"|
| start_url     | Which page to load on startup |   "start_url": "/index.html"  |
| scope         | Which pages all included in "PWA Experience"  |   "scope": "." |
| display       | Should it look like a standalone app ? | "display":"standalone" |
| background_color |  Background whilst loading & on SplashScreen | "background_color": "fff" |
| theme_color | Theme color (e.g ont top bar in task switcher) | "theme_color":"fff" |
| description | Description (e.g. as favorite) | "description": "Test running until you sweaty!" |
| dir | Read direction of your app | "dir": "ltr" |

