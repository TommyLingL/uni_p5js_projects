var sfx;
var amplitude;
var score = 0;
var note_count = 0;
var sfx_array = [];
var notes_index = 0;
var key_flag = true;
var sfx_flag = false;
var info = "Drag any music file into the canvas..."
var colors = ['rgb(223,249,251)', 'rgb(75,75,75)', 'rgb(85,239,196)', 'rgb(129,236,236)', 'rgb(253,121,168)', 'rgb(255,250,101)', 'rgb(255,204,204)', 'rgb(50,255,126)', 'rgb(126,255,245)'];
let note_detect;

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.drop(gotFIle);
  noCursor();
  amplitude = new p5.Amplitude();
  note_detect = new BeatDetector(15, 0.95, 0.03);
}

function gotFIle(file)  {
  if (sfx_flag === false) {
    sfx = loadSound(file.data, loaded);
    sfx_flag = true;
    info = "Hit the notes with 'SPACE' key..."
  }
}

function loaded() {
  sfx.play();
  sfx.onended(restart);
  info = ""
}

function restart() {
  info = (note_count - score) +" Beats missed, Drag any music file into the canvas..."
  sfx_flag = false;
  score = 0;
}

function draw() {
  background(255);
  line(0.0,(windowHeight-windowHeight/5),windowWidth,(windowHeight-windowHeight/5));
  textSize(16 + score*0.01)
  textStyle(ITALIC);
  text("score: " + score, windowWidth-windowWidth/10, windowHeight/10)
  text(info, windowWidth*0.05, windowHeight*0.1);
  var level = amplitude.getLevel();
  if (note_detect.detect(level)) {
    sfx_array.push(new sfx_note(level));
    note_count += 1;
  }
  for (var i=0; i<sfx_array.length; i++) {
    sfx_array[i].display();
    if (sfx_array[i].y < -windowWidth*0.15) {
      sfx_array.splice(i, 1); //remove note
    }
  }
  if (score >= 1000) {
    text("IMPOSSIBLE!!!!!", windowWidth-windowWidth*0.15, windowHeight*0.15)
  } else if (score >= 750) {
    text("Fantastic!!!", windowWidth-windowWidth/10, windowHeight*0.15)
  } else if (score >= 500) {
    text("On Fire!!", windowWidth-windowWidth/10, windowHeight*0.15)
  }else if (score >= 250) {
    text("Excellent!", windowWidth-windowWidth/10, windowHeight*0.15)
  } else {
    text("");
  }
}

function keyPressed() {
  if (keyCode === 32) {
    strokeWeight(5);
    stroke(191);
  }
}

function keyReleased() {
  strokeWeight(1);
  stroke(0);
  key_flag = true;
  return false;
}

function sfx_note(note_v){
  this.x = windowWidth*note_v*4.15
  this.y = windowHeight
  this.alpha = 255
  this.col = random(colors);
  this.speed = 7.5
  this.hit = false

  this.display = function() {
    if (this.x > windowWidth*0.85) {
      this.x = this.x - windowWidth*0.85 + windowWidth*0.15
    }
    this.y -= this.speed
    fill(this.col)
    ellipse(this.x, this.y, windowWidth*0.05);
    if (this.y > (windowHeight-windowHeight/5-windowWidth*0.035) && keyIsDown(32) && this.hit === false && this.y < (windowHeight-windowHeight/5+windowWidth*0.035)) {
      if (key_flag === true) {
        score += 1;
        key_flag = false;
        this.hit = true;
        this.col = 255;
        this.speed = 5.0;
      }
    }
  };
}

class BeatDetector {

  constructor(holdTime, decayRate, minLevel) {
    this.holdTime = holdTime // the number of frames to hold a beat
    this.decayRate = decayRate
    this.minLevel = minLevel // a volume less than this is no beat

    this.cutOff = 0.0
    this.time = 0
  }

  detect(level) {
    const val = level || 0.0

    if (this.minLevel < val && this.cutOff < val) {
      this.cutOff = val * 1.1
      this.time = 0

      return true

    } else {
      if (this.time <= this.holdTime) {
        this.time += 1
      } else {
        const decayed = this.cutOff * this.decayRate
        this.cutOff = Math.max(decayed, this.minLevel)
      }
      return false
    }
  }
}
