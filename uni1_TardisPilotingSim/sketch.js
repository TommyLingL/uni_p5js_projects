var tar;
var img;
var bg;
var vid;
var sfx;

function preload() {
  tar = loadModel('assets/TARDIS.obj', true);
  img = loadImage('assets/TARDIS_D.jpg');
  bg = loadImage('assets/Earth.jpg');
  vid = createVideo('assets/video.mp4');
  sfx = loadSound('assets/sfx.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noCursor();
  sfx.setVolume(0.1);
  //sfx.play();
  sfx.setLoop(true);
  vid.hide();
  vid.loop();
}

function draw() {
  background(0);
  rotateY(frameCount * 0.01);
push();
  texture(vid)
  cylinder(windowWidth/2.0,windowHeight)
pop();
  ambientLight(155);
  directionalLight(255, 255, 255, 0, 0, 0.75);
  pointLight(250, 250, 250, 512, 512, 25);
  rotateY(frameCount * 0.01);
push();
  texture(bg)
  sphere(128, 128);
pop();
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.05);
  rotateZ(frameCount * 0.01);
  var dirX = mouseX - (windowWidth / 2);
  var dirY = mouseY - (windowHeight / 2);
  translate(dirX + 50.0, dirY + 75.0, 250.0);
push();
  texture(img);
  model(tar);
pop();
}
