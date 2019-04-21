// Inspired by Daniel Shiffman @ Coding Train: https://www.youtube.com/watch?v=0jjeOYMjmDU 

let angle;
let previousAngle;

function setup() {
  if (windowWidth<640 || windowWidth<windowHeight){
    baseSize=(1/11)*windowWidth;  // 100% of width if small screen
    if (windowWidth > 500) {
      baseSize = 500/11;
      select('.sketch').style("width", "500px");
    }
    else {
      select('.sketch').style("width", "100%");
    }
  }
  else{
    baseSize=(0.6/11)*windowWidth;  // 60% of width if big screen
    if (windowWidth > 500) {
      baseSize = 500/11;
      select('.sketch').style("width", "500px");
    }
    else {
      select('.sketch').style("width", "60%");
    }
  }
  canvas = createCanvas(11*baseSize, 9*baseSize);
  // Move the canvas so it’s inside our <div id="sketch-holder">.
  canvas.parent('sketch-holder');

  stroke(0);
  translate(width/2, height);
  scale(1, -1);
  background(color('#eee8d5'));
  angle = 0.67;
  branch(height/3);
  angle = 3*PI/4;
  previousAngle = angle;
}

function windowResized() {
  if (windowWidth<640 || windowWidth<windowHeight){
    baseSize=(1/11)*windowWidth;  // 100% of width if small screen
    if (windowWidth > 500) {
      baseSize = 500/11;
      select('.sketch').style("width", "500px");
    }
    else {
      select('.sketch').style("width", "100%");
    }
  }
  else{
    baseSize=(0.6/11)*windowWidth;  // 60% of width if big screen
    if (windowWidth > 500) {
      baseSize = 500/11;
      select('.sketch').style("width", "500px");
    }
    else {
      select('.sketch').style("width", "60%");
    }
  }
  resizeCanvas(11*baseSize, 9*baseSize);
  // Move the canvas so it’s inside our <div id="sketch-holder">.
  canvas.parent('sketch-holder');
  branch(height/3);
}

function draw(){
  angle = map(mouseX, 0, width, 3*PI/4, PI/24);
  angle = constrain(angle, PI/24, 3*PI/4);
  translate(width/2, height);
  scale(1, -1);

  if (angle != previousAngle) {
    background(color('#eee8d5'));
    branch(height/3);
  }
  previousAngle = angle;
}

function branch(len) {
  strokeWeight(len/10);
  line(0, 0, 0, len);
  translate(0, len);
  if (len>3){
    push();
    rotate(angle);
    branch(len*0.67);
    pop();
    push();
    rotate(-angle);
    branch(len*0.67);
    pop();
  }
}
