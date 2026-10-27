# Main Hub V4 — Desktop vs VR

Desktop: click OVERVIEW to open a Thai HTML lesson. Browser fullscreen remains desktop, including the A-Frame fullscreen fallback.

Immersive headset: VR learning board appears only if renderer.xr.getSession().mode === "immersive-vr" and xr.isPresenting. Attached to [camera], so it follows head rotation. Select CLOSE with controller laser.

When leaving a real VR session, the Thai desktop HTML panel is restored if a lesson is active.

Only the hub's interactions.js has been changed from V3, plus this README.

Testing: open standalone/index.html in Chrome/Edge for desktop with internet. For actual HTC Vive/Valve Index WebXR testing, use a supported immersive WebXR browser/runtime in HTTPS or localhost. Browser fullscreen by itself is not VR.
