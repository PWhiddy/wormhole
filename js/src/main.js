var WormholeSpace   = require("./wormholespace");
var Player          = require("./player");
var PlayerControlsKeyboard = require("./playercontrolskeyboard");
var PlayerControlsTouch = require("./playercontrolstouch");
var Renderer        = require("./renderer");
var UIControls      = require("./uicontrols");

var container = document.querySelector('#container');

var wormholeSpace = new WormholeSpace(1.4, 5);

var player = new Player(wormholeSpace);

var maxX = wormholeSpace.radius * 4 + wormholeSpace.throatLength;

var playerX = wormholeSpace.radius * 2 + wormholeSpace.throatLength;

player.position.set(playerX, Math.PI * 0.5, 0);
player.rotateY(-Math.PI * 0.5);

var playerControls = [
  new PlayerControlsKeyboard(player, container),
  new PlayerControlsTouch(player, container)
];

var clock = new THREE.Clock();

var renderer = new Renderer(container, wormholeSpace, maxX);

function animate() {
  requestAnimationFrame(animate);

  var delta = clock.getDelta();
  if (delta < 0.001) return;

  // If delta becomes too big we might get weird stuff happening
  if (delta > 0.1) {
    delta = 0.1;
  }

  playerControls.forEach(function(playerControl) {
    playerControl.update(delta);
  });

  if (player.position.x > maxX) {
    player.position.x = maxX;
  }
  else if (player.position.x < -maxX) {
    player.position.x = -maxX;
  }

  render();
}

function render() {
  renderer.render(player);
}

animate();

new UIControls({
  renderer: renderer,
  playerControls: playerControls,
  resetPlayer: function resetPlayer() {
    player.position.y = Math.PI * 0.5;
    player.quaternion.x = 0;
    player.quaternion.z = 0;
    player.quaternion.normalize();
  }
});
