# Team contract entry point

The canonical team target is [`simulator/standalone/`](simulator/standalone/). Use classic JavaScript, HTML, and A-Frame there. It is the double-click desktop build with the three registered rooms: Hardware, Programming, and Network; the shared Main Hub has its own `src/rooms/hub/` module; hub models are edited in `models.js`. The shell and shared API remain in `src/main.js`.

The exact room interface, shared context services, room lifecycle, translation data rules, script ordering, and mouse/controller input contract are defined in [`simulator/standalone/TEAM_ARCHITECTURE.md`](simulator/standalone/TEAM_ARCHITECTURE.md). That file is API v1 for all room teams.


