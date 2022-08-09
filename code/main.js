import kaboom from "kaboom";

const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 800;
const SPEED = 480;

// initialize context
kaboom({
  width: 1200,
  height: 600,
  // font: "sinko",
  canvas: document.querySelector("#mycanvas"),
  background: [135, 206, 235],
});

// load assets
loadSprite("bean", "sprites/bean.png");

let highScore = window.localStorage.getItem("highScore") || 0;

scene("game", () => {
  // define gravity
  gravity(2400);

  // add a game object to screen
  const player = add([
    // list of components
    sprite("bean"),
    pos(80, 40),
    area(),
    body(),
  ]);

  // floor
  add([
    rect(width(), FLOOR_HEIGHT),
    outline(4),
    pos(0, height()),
    origin("botleft"),
    area(),
    solid(),
    color(0, 255, 0),
  ]);

  function jump() {
    if (player.grounded()) {
      player.jump(JUMP_FORCE);
    }
  }

  // jump when user press space, up, or clicks
  onKeyPress("space", jump);
  onKeyPress("up", jump);
  onClick(jump);

  onKeyPressRepeat("space", jump);
  onKeyPressRepeat("up", jump);

  function spawnTree() {
    // add tree obj
    add([
      rect(48, rand(32, 96)),
      area(),
      outline(4),
      pos(width(), height() - FLOOR_HEIGHT),
      origin("botleft"),
      color(255, 0, 0),
      move(LEFT, SPEED),
      "tree",
    ]);

    // wait a random amount of time to spawn next tree
    wait(rand(0.5, 1.5), spawnTree);
  }

  // start spawning trees
  spawnTree();

  // lose if player collides with any game obj with tag "tree"
  player.onCollide("tree", () => {
    // go to "lose" scene and pass the score
    go("lose", score);
    // burp();
    addKaboom(player.pos);
  });

  // keep track of score
  let score = 0;

  const scoreLabel = add([text(score), pos(24, 24)]);

  const highScoreLabel = add([text(highScore), pos(900, 24)]);

  // increment score every frame
  onUpdate(() => {
    if (highScore > score) {
      score++;
      scoreLabel.text = score;
    }
    if (highScore <= score) {
      score++;
      scoreLabel.text = score;
      highScore = score - 1;
      highScoreLabel.text = score;
    }
  });
});

scene("lose", score => {
  add([
    sprite("bean"),
    pos(width() / 2, height() / 2 - 80),
    scale(2),
    origin("center"),
  ]);

  // display score
  add([
    text("your score " + score),
    pos(width() / 2, height() / 2 + 80),
    scale(1.5),
    origin("center"),
  ]);

  add([
    text("high score " + highScore),
    pos(width() / 2, height() / 2 - 160),
    scale(1),
    origin("center"),
  ]);

  window.localStorage.setItem("highScore", highScore);

  // go back to game with space is pressed
  onKeyPress("space", () => go("game"));
  onKeyPress("up", () => go("game"));
  onClick(() => go("game"));
});

go("game");
