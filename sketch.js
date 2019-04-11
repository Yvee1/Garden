let alpha, beta;
let baseSize;

function setup() {
  baseSize=0.06*windowWidth;
  canvas = createCanvas(10*baseSize, 5*baseSize);
  // Move the canvas so it’s inside our <div id="sketch-holder">.
  canvas.parent('sketch-holder');
  slider = select('#alpha');
  draw_();
  slider.input(draw_);
}

function draw_() {
  alpha = slider.value()
  beta = PI / 2 - alpha;
  background(color('#fdf6e3'));
  push();
  translate(width / 2, height);
  scale(1, -1)

  rectMode(CORNERS);

  fill(color('#859900'));
  let c = baseSize;
  btlt = createVector(-c / 2, 0);
  btrt = createVector(c / 2, 0);
  tplt = createVector(-c / 2, c);
  tprt = createVector(c / 2, c);

  seed = new Block(btlt, btrt, tprt, tplt, 0);
  seed.show();
  addBlocks(seed, 0, 0);
  pop();
}

class Block {
  constructor(bl, br, tr, tl, layer) {
    this.bl = bl;
    this.br = br;
    this.tr = tr;
    this.tl = tl;
    this.layer = layer;
    this.len = this.tr.copy().sub(this.tl).mag();
  }

  show() {
    fill(133, 100+this.layer*15, 0);
    beginShape(CLOSE);
    vertex(this.bl.x, this.bl.y);
    vertex(this.br.x, this.br.y);
    vertex(this.tr.x, this.tr.y);
    vertex(this.tl.x, this.tl.y);
    vertex(this.bl.x, this.bl.y);
    endShape();
  }
}

function addBlocks(block, layer, angle) {
  layer += 1;
  let a = alpha;
  let b = beta;
  let c = block.len;

  let side = createVector(c * cos(a) ** 2,  c * cos(a) * sin(a));
  side.rotate(angle);
  let bl = block.tl.copy();
  let br = bl.copy().add(side);
  side.rotate(PI/2);
  let tr = br.copy().add(side);
  let tl = bl.copy().add(side);
  let left = new Block(bl, br, tr, tl, layer);

  side = createVector(- c * cos(b) ** 2,  c * cos(b) * sin(b));
  side.rotate(angle);
  br = block.tr.copy();
  bl = br.copy().add(side);
  side.rotate(-PI/2);
  tr = br.copy().add(side);
  tl = bl.copy().add(side);

  let right = new Block(bl, br, tr, tl, layer);

  left.show();
  right.show();

  if (layer < 8) {
    addBlocks(left, layer, angle+alpha);
    addBlocks(right, layer, angle-beta);
  }
}
