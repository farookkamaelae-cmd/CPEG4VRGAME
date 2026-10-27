# Computer Engineering Simulator — standalone build

Open `index.html` in this folder directly in a desktop browser. Application code uses classic JavaScript scripts, so desktop preview does not need a local server. Internet access is needed for A-Frame 1.6.0 from its CDN.

The interface is Thai-only. Configure each module's camera position and rotation in `shared/camera-locations.js`. Edit labels and room messages in `data/i18n.js`. Three rooms are registered through `src/main.js`: Hardware, Programming, and Network. Each room has one required `room.js` factory and may have supporting files; the script loading order is set in `index.html`.

Before implementing a room, read [TEAM_ARCHITECTURE.md](TEAM_ARCHITECTURE.md). It defines API v1, room lifecycle, shared session/event rules, and mouse/VR controller interaction. WebXR requires a supported headset/browser and a secure context such as HTTPS or localhost; opening via double-click is for desktop preview.

