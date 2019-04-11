function setup() {
  canvas = createCanvas(700, 600);
  // Move the canvas so it’s inside our <div id="sketch-holder">.
  canvas.parent('sketch-holder');
  slider = createSlider(PI/16, PI/2-PI/16, PI/4, 0.01);
}

function draw() {
  let a = slider.value()
  let b = PI/2 - a;
  background(color('#fdf6e3'));
  
  translate(width/2, height);
  scale(1, -1)

  rectMode(CORNERS);
  let c = 200;
  fill(color('#859900'));
  rect(-c/2, 0, c/2, c);
  
  beginShape(CLOSE);
  vertex(-c/2, c);
  vertex(-c/2  + c*cos(a)**2, c+ c*cos(a)*sin(a));
  vertex(-c/2 + c*cos(a)**2 - c*cos(a)*sin(a), c + c*cos(a)*sin(a) + c*cos(a)**2);
  vertex(-c/2 - c*cos(a)*sin(a), c +  c*cos(a)**2);
  vertex(-c/2, c);
  endShape();
  
  beginShape(CLOSE);
  vertex(c/2, c);
  vertex(c/2  - c*cos(b)**2, c+ c*cos(b)*sin(b));
  vertex(c/2 - c*cos(b)**2 + c*cos(b)*sin(b), c + c*cos(b)*sin(b) + c*cos(b)**2);
  vertex(c/2 + c*cos(b)*sin(b), c +  c*cos(b)**2);
  vertex(c/2, c);
  endShape();
}