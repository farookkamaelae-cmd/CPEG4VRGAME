// SHARED CAMERA LOCATIONS
// Set each room's camera position and rotation here (meters and degrees).
// Coordinates are world coordinates; the camera looks toward negative Z when rotation is 0, 0, 0.
window.SimulatorCameraLocations = {
  defaults: {
    position: { x: 0, y: 1.6, z: 5 },
    rotation: { x: 0, y: 0, z: 0 }
  },
  rooms: {
    hub: {
      position: { x: 0, y: 1.6, z: 5 },
      rotation: { x: 0, y: 0, z: 0 }
    },
    hardware: {
      position: { x: 0, y: 1.6, z: 5 },
      rotation: { x: 0, y: 0, z: 0 }
    },
    programming: {
      position: { x: 0, y: 1.6, z: 5 },
      rotation: { x: 0, y: 0, z: 0 }
    },
    network: {
      position: { x: 0, y: 1.6, z: 5 },
      rotation: { x: 0, y: 0, z: 0 }
    }
  },
  apply: function (roomId, cameraElement) {
    if (!cameraElement) return;
    var location = this.rooms[roomId] || this.defaults;
    cameraElement.setAttribute('position', location.position);
    cameraElement.setAttribute('rotation', location.rotation);
  }
};
