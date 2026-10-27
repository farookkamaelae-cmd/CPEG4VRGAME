// NETWORK ROOM GAME RULES
window.NetworkRoom = window.NetworkRoom || {};
window.NetworkRoom.Game = {
  isCorrect: function (placedOrder, answer) {
    return Array.isArray(placedOrder) && placedOrder.length === answer.length &&
      placedOrder.every(function (wire, index) { return wire === answer[index]; });
  },
  isTesterAnswerCorrect: function (selected, expected) { return selected === expected; },
  getScorePatch: function (current, correct) {
    return { score: current.score + (correct ? 1 : 0), errors: current.errors + (correct ? 0 : 1) };
  }
};
