// PROGRAMMING / GAME RULES
// Edit command execution and success/failure rules here; keep scene drawing in room.js.
window.ProgrammingRoom = window.ProgrammingRoom || {};
window.ProgrammingRoom.Game = {
  run: function (commands, data) {
    var state = { x: data.start.x, z: data.start.z, direction: data.start.direction };
    commands.forEach(function (command) {
      if (command === 'left') state.direction = (state.direction + 90) % 360;
      else if (command === 'right') state.direction = (state.direction + 270) % 360;
      else {
        var radians = state.direction * Math.PI / 180;
        state.x += Math.round(Math.sin(radians));
        state.z += Math.round(-Math.cos(radians));
        state.x = Math.max(data.min, Math.min(data.max, state.x));
        state.z = Math.max(data.min, Math.min(data.max, state.z));
      }
    });
    return { state: state, success: state.x === data.goal.x && state.z === data.goal.z };
  }
};
