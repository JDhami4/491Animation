var AM = new AssetManager();

class Animation {
  constructor(
    spriteSheet,
    frameWidth,
    frameHeight,
    sheetWidth,
    frameDuration,
    frames,
    loop,
    scale
  ) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
  }

  drawFrame(tick, ctx, x, y) {
    this.elapsedTime += tick;

    if (this.isDone()) {
      if (this.loop) {
        this.elapsedTime = 0;
      }
    }

    let frame = this.currentFrame();
    let xIndex = 0;
    let yIndex = 0;
    xIndex = frame % this.sheetWidth;
    yIndex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(
      this.spriteSheet,
      xIndex * this.frameWidth,
      yIndex * this.frameHeight, // source from sheet
      this.frameWidth,
      this.frameHeight,
      x,
      y,
      this.frameWidth * this.scale,
      this.frameHeight * this.scale
    );
  }

  currentFrame() {
    return Math.floor(this.elapsedTime / this.frameDuration);
  }

  isDone() {
    return this.elapsedTime >= this.totalTime;
  }
}

var showCarn = false;
var standAlone = false;
class Venom {
  constructor(game, spriteSheet) {
    this.firstAnimation = new Animation(
      spriteSheet,
      235,
      300,
      6,
      0.6,
      6,
      true,
      1
    );

    this.venomSpinAnimation = new Animation(
      AM.getAsset("./img/venomSpin.png"),
      107,
      120,
      4,
      0.1,
      4,
      true,
      3
    );
    this.venomSwingAnimation = new Animation(
      AM.getAsset("./img/venomSwing.png"),
      99,
      300,
      5,
      0.25,
      5,
      true,
      2
    );

    this.venomRunAnimation = new Animation(
      AM.getAsset("./img/venomRun.png"),
      155,
      150,
      7,
      0.2,
      7,
      true,
      2
    );

    this.x = 800;
    this.y = 450;
    this.speed = 150;
    this.game = game;
    this.ctx = game.ctx;
    this.firstBlock = true;
    this.venomSpin = false;
    this.venomSwing = false;
    this.venomRun = false;
    this.standCount = 0;
  }
  draw(ctx) {
    if (this.firstBlock) {
      if (this.firstAnimation.elapsedTime < 3.5) {
        this.firstAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
      } else {
        this.standing = true;
        this.firstAnimation.elapsedTime = 3.5;
        this.firstAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
      }
    } else if (this.venomSpin) {
      this.venomSpinAnimation.drawFrame(
        this.game.clockTick,
        ctx,
        this.x,
        this.y
      );
    } else if (this.venomSwing) {
      this.venomSwingAnimation.drawFrame(
        this.game.clockTick,
        ctx,
        this.x,
        this.y
      );
    } else if (this.venomRun) {
      this.venomRunAnimation.drawFrame(
        this.game.clockTick,
        ctx,
        this.x,
        this.y
      );
    }
  }

  update() {
    if (this.standing) {
      if (this.x > 1000 || this.x < 50) {
        this.x = 800;
      }
      this.standCount++;
      if (this.standCount > 25) {
        this.firstAnimation.scale += 0.1;
        this.y -= 30;
        if (Math.random() > 0.5) {
          this.x += 200;
        } else {
          this.x -= 200;
        }
        this.standCount = 0;
        if (this.firstAnimation.scale > 2.75) {
          this.standing = false;
          this.firstBlock = false;
          this.x = 100;
          this.y = 450;
          this.venomSpin = true;
        }
      }
    } else if (this.venomSpin) {
      this.y = 345;
      this.x += this.game.clockTick * this.speed;
      if (this.x > 1000) {
        this.venomSpin = false;
        showCarn = true;
        this.x = 0;
        this.y = 10;
        this.venomSwing = true;
      }
    } else if (this.venomSwing) {
      if (this.x > 1240) {
        this.venomSwing = false;
        this.venomRun = true;
        this.x = -10;
        this.y = 400;
      }
      this.x += this.game.clockTick * this.speed;
    } else if (this.venomRun) {
      if (this.x > 1400) {
        showCarn = false;
        standAlone = true;
        this.firstBlock = true;
        this.venomSpin = false;
        this.venomSwing = false;
        this.venomRun = false;
        this.standCount = 0;
        this.firstAnimation.elapsedTime = 0;
        this.firstAnimation.scale = 1;
        this.x = 800;
        this.y = 450;
      }
      this.x += this.game.clockTick * this.speed;
    }
  }
}

class Carnage {
  constructor(game, spriteSheet) {
    this.animation = new Animation(spriteSheet, 440, 455, 1, 0.4, 5, true, 1);

    this.x = 1400;
    this.y = 290;
    this.speed = 150;
    this.game = game;
    this.ctx = game.ctx;
  }

  draw(ctx) {
    if (showCarn) {
      this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
  }

  update() {
    if (showCarn) {
      if (this.x > 700) {
        this.x -= this.game.clockTick * this.speed;
      }
    } else {
      this.x = 1800;
    }
  }
}

class StandAlone {
  constructor(game, spriteSheet) {
    this.animation = new Animation(spriteSheet, 265, 275, 4, 0.8, 14, true, 1);

    this.x = 60;
    this.y = 340;
    this.speed = 150;
    this.game = game;
    this.ctx = game.ctx;
  }

  draw(ctx) {
    if (standAlone) {
      this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
  }

  update() {}
}

// no inheritance
function Background(game, spritesheet) {
  this.x = 0;
  this.y = 0;
  this.spritesheet = spritesheet;
  this.game = game;
  this.ctx = game.ctx;
}

Background.prototype.draw = function() {
  this.ctx.drawImage(this.spritesheet, this.x, this.y);
};

Background.prototype.update = function() {};

AM.queueDownload("./img/background2.jpg");
AM.queueDownload("./img/venomRise.png");
AM.queueDownload("./img/venomSpin.png");
AM.queueDownload("./img/venomSwing.png");
AM.queueDownload("./img/carnage.png");
AM.queueDownload("./img/venomRun.png");
AM.queueDownload("./img/standAlone.png");

AM.downloadAll(function() {
  var canvas = document.getElementById("gameWorld");
  var ctx = canvas.getContext("2d");

  var gameEngine = new GameEngine();
  gameEngine.init(ctx);
  gameEngine.start();
  gameEngine.addEntity(
    new Background(gameEngine, AM.getAsset("./img/background2.jpg"))
  );

  gameEngine.addEntity(
    new Venom(gameEngine, AM.getAsset("./img/venomRise.png"))
  );

  gameEngine.addEntity(
    new Carnage(gameEngine, AM.getAsset("./img/carnage.png"))
  );

  gameEngine.addEntity(
    new StandAlone(gameEngine, AM.getAsset("./img/standAlone.png"))
  );

  console.log("All Done!");
});
