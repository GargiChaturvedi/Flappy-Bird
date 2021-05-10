var bird, birdImg, birdTilted, backdrop, backdropImg, backdrop2Img, ground;
var topPipe, bottomPipe, topPipeGroup, bottomPipeGroup, topPipeImg, bottomPipeImg;
var topRandY, bottomRandY;
var gameState = "play";
var score = 0;
var replay, replayImg;

function preload() {
  birdImg = loadAnimation("bird.png");
  birdTilted = loadAnimation("birdTilted.png");
  backdropImg = loadAnimation("backdrop.png");
  backdrop2Img = loadAnimation("backdrop2.jpg");
  topPipeImg = loadImage("topPipe.png");
  bottomPipeImg = loadImage("bottomPipe.png");
  replayImg = loadImage("replay.png");
}

function setup() {
  createCanvas(550, 450);
  
  backdrop = createSprite(50, 65, 400, 400);
  backdrop.addAnimation("backdrop", backdropImg);
  backdrop.addAnimation("backdrop2", backdrop2Img);
  
  bird = createSprite(100, 200, 50, 50);
  bird.addAnimation("bird", birdImg);
  bird.addAnimation("birdTilted", birdTilted);
  bird.scale = 0.12;
  bird.debug = false;
  bird.setCollider("circle", 0, 0, 150);
  
  ground = createSprite(275, 400, 550, 20);
  ground.visible = false;
  
  replay = createSprite(275, 100, 50, 50);
  replay.addImage("replay", replayImg);
  replay.scale = 0.2;
  
  topPipeGroup = new Group();
  bottomPipeGroup = new Group();
}

function draw() {
  background("black");
  
  getTime();
  
  if(gameState === "play") {
    replay.visible = false;
    backdrop.setVelocity(-5, 0);
    bird.changeAnimation("bird", birdImg);
    spawnTopPipe();
    spawnBottomPipe();
    score += Math.round(getFrameRate()/60);
  }

  bird.collide(ground);
  
  if(backdrop.x === 40 && gameState === "play") {
    backdrop.x = width/2;
  }
  
  if((keyDown("space") || keyDown(UP_ARROW)) && gameState === "play") {
    bird.setVelocity(0, -5);
  }
  
  if((bottomPipeGroup.isTouching(bird) || topPipeGroup.isTouching(bird)) && gameState === "play") {
    gameState = "end";
  }
  
  if(gameState === "end") {
    end();
  }
  
  if(mousePressedOver(replay) && gameState === "end") {
    reset();
  }
  bird.velocityY += 0.5;
      
  drawSprites();
  
  textSize(20);
  fill("maroon");
  text("Score: " + score, 25, 25);
}

function spawnTopPipe() {
  if(frameCount % 75 === 0) {
    topRandY = Math.round(random(25, 100));
    topPipe = createSprite(560, topRandY, 30, 100);
    topPipe.addImage("topPipe", topPipeImg);
    topPipe.scale = 0.75;
    topPipe.setVelocity(-4, 0);
    topPipe.lifetime = 137.5;
    topPipeGroup.add(topPipe);
  }
}

function spawnBottomPipe() {
  if(frameCount % 75 === 0) {
    bottomRandY = Math.round(random(350, 450));
    bottomPipe = createSprite(550, bottomRandY, 30, 100);
    bottomPipe.addImage("bottomPipe", bottomPipeImg);
    bottomPipe.scale = 0.75;
    bottomPipe.setVelocity(-4, 0);
    bottomPipe.lifetime = 137.5;
    bottomPipe.depth = replay.depth;
    replay.depth++;
    bottomPipeGroup.add(bottomPipe);
  }
}

function end() {
  backdrop.setVelocity(0, 0);
  bottomPipeGroup.setVelocityEach(0, 0);
  topPipeGroup.setVelocityEach(0, 0);
  bottomPipeGroup.setLifetimeEach(-1);
  topPipeGroup.setLifetimeEach(-1);
  replay.visible = true;
  bird.changeAnimation("birdTilted", birdTilted);
}

function reset() {
  gameState = "play";
  bottomPipeGroup.destroyEach();
  topPipeGroup.destroyEach();
  score = 0;
  bottomPipeGroup.setLifetimeEach(137.5);
  topPipeGroup.setLifetimeEach(137.5);
  bird.y = 200;
}

async function getTime() {
  var response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
  var jsonResponse = await response.json();
  var datetime = jsonResponse.datetime;
  var hour = datetime.slice(11, 13);
  if(hour > 6 && hour < 18) {
    backdrop.changeAnimation("backdrop", backdropImg);
    backdrop.x = 50;
    backdrop.y = 65;
    backdrop.scale = 1;
    bird.tint = null;
    replay.tint = null;
  } else {
    backdrop.changeAnimation("backdrop2", backdrop2Img);
    backdrop.x = 350;
    backdrop.y = 225;
    backdrop.scale = 1.75;
    bird.tint = "salmon";
    replay.tint = "yellow";
  }
}