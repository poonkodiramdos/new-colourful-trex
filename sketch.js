//to create varibles
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudImage, cloudsGroup;
var obstclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImage, restartImage

var jumpSound, checkPointSound, dieSound;

function preload() {
  //to load animation and loadImage
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  restartImage = loadImage("restart.png")
  gameOverImage = loadImage("gameOver.png")

  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");

}

function setup() {
  createCanvas(windowWidth, windowHeight);

  //to create message
  var message = "this is a message";
  console.log(message)
  //to create sprite 
  trex = createSprite(50, height - 40, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided)
  trex.scale = 0.5;

  ground = createSprite(width /2, height, width, 2);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  invisibleGround = createSprite(width/2, height - 10, width, 145);
  invisibleGround.visible = false;

  gameOver = createSprite(width/2,height/2-50);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.5;

  restart = createSprite(width/2, height/2);
  restart.addImage(restartImage);
  restart.scale = 0.5;

  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  trex.setCollider("circle", 0, 0, 10);

  trex.debug = true;

  score = 0;

}

function draw() {
  //to create background
  background("lightblue")
  text("score:" + score, 500, 50);

  if (gameState === PLAY) {
    gameOver.visible = false;
    restart.visible = false;

    ground.velocityX = -(4 + 3 * score / 100);
    score = score + Math.round(getFrameRate() / 60);
    if (score > 0 && score % 100 === 0) {
      checkPointSound.play();
    }

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    //jump when the space key is pressed
    if ((touches.length >0 || keyDown("space")) && trex.y >= 100) {
      trex.velocityY = -12;
      jumpSound.play();
      touches = [];
    }

    //add gravity
    trex.velocityY = trex.velocityY + 0.8;

    //spawn the clouds
    spawnClouds();

    //spawn the obstacles
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      // trex.VelocityY=-12
      gameState = END;
      jumpSound.play();
      dieSound.play();
    }

  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    //change the trex animation
    trex.changeAnimation("collided", trex_collided);

    ground.velocityX = 0;
    trex.velocityY = 0;



    // set life time of the game objects
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);


    if (touches.length > 0 || keyDown("space")||mousePressedOver(restart)) {
      reset();
      touches = [];

    }
  }

  //stop trex from falling down
  trex.collide(invisibleGround);


  drawSprites();
}

//for restart
function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  trex.changeAnimation("running", trex_running);
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  score = 0;
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-95,20,30);
    obstacle.velocityX = -(6 + score / 100);

    //generate random obstacles  
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }
    //assign scale and lifeTime to the obstacle
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width-0, height-80, 40, 10);
    cloud.y = round(random(80, 120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //assign lifetime for clouds
    cloud.lifetime = 200;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}