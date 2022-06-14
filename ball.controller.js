var gCanvas;
var gCtx;
var rafBall;
var rafScroller;
var gRects = [];

var gGame = {
  isOn: false,
};

var gScroller = {
  size: {
    x: 200,
    y: 50,
  },
  pos: {
    x: 100,
    y: 200,
  },
  vx: 4,
  draw: function () {
    gCtx.beginPath();
    gCtx.rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    gCtx.fillStyle = 'orange';
    gCtx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    gCtx.strokeStyle = 'black';
    gCtx.stroke();
  },
};

var gBall = {
  x: 200,
  y: 200,
  vx: 2,
  vy: 2,
  radius: 25,
  color: 'gold',
  draw: function () {
    gCtx.beginPath();
    gCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    gCtx.closePath();
    gCtx.fillStyle = this.color;
    gCtx.fill();
  },
};

var gBlocks = {
  draw: function () {
    gRects.forEach(function (block) {
      if (block.isBomb) block.color = 'blue';
      if (block.isBallSuper) block.color = 'red';
      gCtx.beginPath();
      gCtx.rect(block.pos.x, block.pos.y, block.size.x, block.size.y);
      gCtx.fillRect(block.pos.x, block.pos.y, block.size.x, block.size.y);
      gCtx.fillStyle = block.color;
      gCtx.strokeStyle = '#222';
      gCtx.stroke();
    });
  },
};

function onInit() {
  gCanvas = document.querySelector('canvas');
  gScroller.pos.x = gCanvas.width * 0.3;
  gScroller.pos.y = gCanvas.height - 60;
  gCtx = gCanvas.getContext('2d');
  gGame.isOn = true;
  createBlocks();
  renderGame();
}

function renderGame() {
  renderBall();
}

function drawItems() {
  gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
  gBall.draw();
  gScroller.draw();
  gBlocks.draw();
  onMoveBall();
  if (gGame.isOn) {
    rafBall = window.requestAnimationFrame(drawItems);
  }
}

function onMoveBall() {
  isBallHitScroller();

  gBall.x += gBall.vx;
  gBall.y += gBall.vy;

  if (gBall.y + gBall.vy + gBall.radius > gCanvas.height) gGame.isOn = false;
  if (gBall.y + gBall.vy - gBall.radius < 0) gBall.vy = -gBall.vy;
  if (
    gBall.x + gBall.vx + gBall.radius > gCanvas.width ||
    gBall.x + gBall.vx - gBall.radius < 0
  )
    gBall.vx = -gBall.vx;
  if (!gRects.length) gGame.isOn = false;
  isBallHitBlock();
}

function onMoveScroll(currDir) {
  gScroller.pos.x += currDir;
  if (gScroller.pos.x + gScroller.vx + gScroller.size.x > gCanvas.width - 20) {
    gScroller.pos.x -= gScroller.vx;
    return;
  }
  if (gScroller.pos.x + gScroller.size.x + gBall.vx < gScroller.size.x + 20) {
    gScroller.pos.x += gScroller.vx;
    return;
  }
}

function renderBall() {
  rafBall = window.requestAnimationFrame(drawItems);
  gBall.draw();
  gScroller.draw();
  gBlocks.draw();
}

function navigateScroll({ code }) {
  switch (code) {
    case 'ArrowLeft':
      onMoveScroll(-gScroller.vx);
      break;
    case 'ArrowRight':
      onMoveScroll(gScroller.vx);
      break;
  }
}

function createBlocks() {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 10; j++) {
      var block = {
        pos: {
          x: 100 * j + 10,
          y: i * 45 + 10,
        },
        size: {
          x: 75,
          y: 25,
        },
        isBomb: Math.random() > 0.8 ? true : false,
        isBallSuper: Math.random() < 0.2 ? true : false,
        color: 'orange',
      };
      gRects.push(block);
    }
  }
}

function isBallHitScroller() {
  if (
    gBall.y - gBall.radius > gScroller.pos.y - gScroller.size.y &&
    gBall.x > gScroller.pos.x &&
    gBall.x < gScroller.pos.x + gScroller.size.x
  ) {
    gBall.vy = gBall.vy * -1;
    gBall.vx = gBall.vx;
    if (
      gBall.y > gScroller.pos.y &&
      gBall.y < gScroller.pos.y + gScroller.size.y
    ) {
      gBall.vy = -gBall.vy;
      gBall.vx = -gBall.vx;
    }
  }
}

function isBallHitBlock() {
  gRects.forEach((block, idx) => {
    if (
      gBall.y - gBall.radius < block.pos.y + block.size.y &&
      gBall.y > block.pos.y &&
      gBall.x > block.pos.x &&
      gBall.x < block.pos.x + block.size.x
    ) {
      gBall.vy = gBall.vy * -1;
      gBall.vx = gBall.vx;
      var block = gRects.splice(idx, 1)[0];
      if (block.isBomb) {
        gScroller.size.x = gScroller.size.x / 2;
        setTimeout(() => {
          gScroller.size.x = 200;
        }, 10000);
      }
      //   if (block.isBallSuper) {
      //     gBall.vx = gBall.vx * -1 + 1;
      //     gBall.vy = gBall.vy * -1 + 1;
      //     setTimeout(() => {
      //       gBall.vx = gBall.vx < 0 ? 2 : -2;
      //       gBall.vy = gBall.vy < 0 ? 2 : -2;
      //       //   gBall.vy = gBall.vy * -1 - 1;
      //     }, 10000);
      //   }
    }
  });
}
