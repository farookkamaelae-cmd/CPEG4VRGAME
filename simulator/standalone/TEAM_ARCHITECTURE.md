# Standalone team contract (API v1)

This is the team's agreed integration contract for `simulator/standalone/`. It is the double-click build: classic JavaScript scripts, HTML, and A-Frame. Keep this contract stable while room teams develop in parallel.

## Run and input requirements

- Open this folder's `index.html` directly in a desktop browser. Its application scripts use classic `<script>` tags, so they do not need a local server.
- Internet access is needed to load A-Frame 1.6.0 from its CDN.
- WebXR/VR needs a supported headset/browser and a secure context (normally HTTPS or localhost). A double-click `file://` launch is for desktop preview and may not allow WebXR.
- Desktop mouse and VR controller laser input activate the same A-Frame `click` event. Controllers point at entities with `.selectable` and use the trigger to click them.
- The shared shell also shows a camera-attached room navigation bar during VR. It provides links to Hardware, Programming, Network, the Main Hub, and VR exit; room teams should not create separate copies of this global menu.

## Ownership and room files

```text
index.html                         Shared page, one A-Frame scene, shared input, script order
 data/i18n.js                      Thai UI text data; edit text here, not in shell logic
 src/main.js                       Navigation, room registry, shared API/session
 shared/room-structure.js          Shared 8 m x 8 m floor plan and 8 m wall height
 shared/camera-locations.js        Shared camera position and rotation per room
 src/rooms/hub/                    Main Hub lifecycle, models, and interactions
 src/rooms/<room-id>/room.js       Required room factory and mount/unmount lifecycle
 src/rooms/<room-id>/              Room-owned optional data, game, models, interactions, styles
 TEAM_ARCHITECTURE.md              This integration contract
```

Every room uses the same required entry file, `room.js`. A team may add as many supporting files as needed (for example `data.js`, `game.js`, `models.js`, `interactions.js`, or `room.css`). Keep each room's code and assets under its own folder. Supporting JavaScript files must be included in `index.html` before that room's `room.js`; all room registrations and shared API changes are coordinated by the integration owner in `src/main.js`.

The Main Hub is the shared `hub` module under `src/rooms/hub/`, and follows the same `mount(container)` / `unmount()` lifecycle. Its model code is in `models.js`, click/navigation handling is in `interactions.js`, and lifecycle wiring is in `room.js`. The shell in `src/main.js` still owns the room registry and shared services. Learning rooms are `hardware`, `programming`, and `network`.

Before mounting a room, `src/main.js` adds the shared room shell from `shared/room-structure.js` to `#world` and applies the camera coordinates from `shared/camera-locations.js`. The interior is 8 m wide, 8 m deep, and 8 m high; its floor is at y=0 and usable x/z coordinates run from -4 m to +4 m. Room modules should build only their room-specific objects and must not add another floor, ceiling, or enclosing walls. Edit the camera file to adjust a room's starting view; room modules must not override the shared camera position.

## Room registration and lifecycle

Scripts are classic scripts: do not use `import`, `export`, `fetch`, or dynamic imports. Each room registers one factory in the shared global registry:

```js
window.SimulatorRooms = window.SimulatorRooms || {};
window.SimulatorRooms.hardware = function createHardwareRoom(context) {
  return {
    mount(container) {
      // Build this room's A-Frame entities and append them to container.
    },
    unmount() {
      // Remove listeners, timers, and any room-owned state/entities.
    }
  };
};
```

`mount(container)` is called on room entry; `container` is the shared `#world` entity. `unmount()` is called before leaving the room. It must be safe to call once after a successful mount, and must clean up every listener and timer created by that room. Only change or remove nodes owned by the room. A room must not create another `<a-scene>` or edit another room's state.

## Shared API v1 (exact contract)

`createRoom(context)` receives one frozen context object. The context and its service objects are read-only; use the provided methods for shared work.

| API | Contract |
|---|---|
| `context.roomId` | Active module ID: `hub`, `hardware`, `programming`, or `network`. |
| `context.scene` | The one shared `<a-scene>` element. Use it for shared-scene events and listeners. |
| `context.ui.showMessage(key)` | Show a Thai translation string by key from `data/i18n.js`. |
| `context.ui.showError(message)` | Show a plain error message. |
| `context.ui.clearMessage()` | Clear the shared status message. |
| `context.i18n.getLanguage()` | Returns `'th'`. This project currently has Thai UI only. |
| `context.i18n.t(key)` | Returns the Thai string for a translation key; returns the key itself if it is missing. |
| `context.navigation.currentRoom()` | Returns the active room ID, or `null` in the hub. |
| `context.navigation.openRoom(roomId)` | Ask the shell to navigate to a registered learning room. |
| `context.navigation.listRooms()` | Returns a frozen array of room descriptors `{ id, labelKey, hubKey, color }` for Hub portal rendering. |
| `context.navigation.goHome()` | Leave the room and return to the hub. |
| `context.session.get()` | Returns a frozen copy of `{ score, errors, elapsedSeconds }`. |
| `context.session.update(patch)` | Updates only finite numeric `score`, `errors`, and/or `elapsedSeconds` values. Room-only state stays inside the room. |
| `context.emit(name, detail?)` | Dispatches `sim:<name>` as a `CustomEvent` on `context.scene`; `detail` defaults to `{}`. Names must be room-prefixed, e.g. `context.emit('hardware:part-installed', { partId, slotId })`. |

Example listener and event:

```js
function onPartInstalled(event) {
  console.log(event.detail.partId, event.detail.slotId);
}
context.scene.addEventListener('sim:hardware:part-installed', onPartInstalled);
// In unmount():
context.scene.removeEventListener('sim:hardware:part-installed', onPartInstalled);
```

Do not call `setLanguage`: language selection is outside API v1 because the application is Thai-only. The shell currently emits `sim:language-changed` with `{ language: 'th' }` during initialization for a consistent lifecycle hook; rooms do not need to subscribe unless a later agreed feature adds language switching.

## Shared interaction contract

- Any A-Frame object meant to be activated by mouse or VR laser must have `class="selectable"`.
- Handle the resulting `click` event and use event delegation where practical. Mouse and controller actions must call the same room action; do not create a separate controller-only game rule.
- If the room listens on `context.scene`, check that the event target belongs to that room before handling it. Remove the listener in `unmount()`.
- Keep the shell's toolbar, room registry, shared services, camera, controller entities, and scene setup in `index.html`/`src/main.js`. Hub visual models belong in `src/rooms/hub/models.js`; room code owns only its own scene content.

## Add a room or supporting file

1. Agree on a lowercase kebab-case room ID and Thai translation keys with the integration owner. The `hub` ID is reserved for the Main Hub.
2. Create `src/rooms/<room-id>/room.js` and register `window.SimulatorRooms['<room-id>']` using API v1.
3. Add optional room files under the same folder. Add their `<script>` tags to `index.html` before `room.js`, in dependency order.
4. Add Thai UI strings in `data/i18n.js`; do not put player-facing text directly in room logic when it can use a key.
5. The integration owner adds the room to the registry and navigation in `src/main.js`; this automatically makes it available through `context.navigation.listRooms()` for Hub portals.
6. Check mouse click, VR laser click when headset/browser are available, entering/leaving/re-entering, hub return, and cleanup before integration.

Do not change API v1, the scene element, shared input behavior, room IDs, or script order without coordinating with the integration owner. This agreement lets room teams implement independently while sharing one predictable interface.


