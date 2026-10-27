# Hub V13 – tabletop Overview
- Desktop and immersive VR share a stationary 3D popup physically attached to the clicked station.
- Popup is at local position (0, 1.81, 0.22), scale 0.73, with a pop-in animation. No camera attachment or look-at tracking.
- The vertical work surface is at approx y=1m. If a popup seems too high/low, adjust `position` in `showPanel()` inside `interactions.js`.
- Controls remain close/previous/next/enter lab; clicking is routed through the station root.
- To avoid stale files, extract this ZIP to a NEW folder, then open that folder's `simulator/standalone/index.html`.
- VR controller selection still depends on available WebXR and raycaster wiring; test with actual equipment.
