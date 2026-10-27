// NETWORK / ANSWER CHECKING
// Edit validation, scoring and attempt rules here; keep connector drawing in room.js.
window.NetworkRoom = window.NetworkRoom || {};
window.NetworkRoom.Game = {
  isCorrect: function (placedOrder, answer) {
    return placedOrder.length === answer.length && placedOrder.every(function (wire, index) { return wire === answer[index]; });
  }
};
