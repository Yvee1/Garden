class Node {
  constructor(key){
    this.key = key;
    this.left = null;
    this.right = null;
    this.parent = null;
  }

  setPos(x, y){
    this.x = x;
    this.y = y;
  }

  min() {
    let current = this;
    while (current.left) {
      current = current.left;
    }
    return current;
  }

  max() {
    let current = this;
    while (current.right) {
      current = current.right;
    }
    return current;
  }

  successor() {
    if (this.right){
      return this.right.min();
    }
    let x = this;
    let y = x.parent;
    while (y && x === y.right) {
      x = y;
      y = x.parent;
    }
    return y;
  }
}

class Tree {
  constructor(x, y){
    this.nodes = [];
    this.links = [];
    this.x = x;
    this.y = y;
    this.root = null;
  }

  insert(node) {
    let p = null;
    let v = this.root;

    // Go to the appropriate place
    while (v !== null) {
      p = v;
      node.key < v.key ? v = v.left : v = v.right;
    }

    // If no parent, there are no nodes so set this as root
    if (p === null) {
      node.setPos(this.x, this.y);
      this.root = node;
    }
    // Otherwise adjust field of inserted node and to be parent
    else {
      if(node.key < p.key) { 
        node.setPos(p.x-50, p.y+50);
        p.left = node;
      }
      else {
        node.setPos(p.x+50, p.y+50);
        p.right = node;
      }
      node.parent = p;
      this.links.push({source: p, target: node});
    }
    this.nodes.push(node);
  }
  
  delete(node) {
    // Backend TODO duplicates
    // Root?
    console.log(node)
    if (node === this.root && !node.left && !node.right){
      this.root = null;
      console.log("1a");
    }
    // No children? Very easy
    else if (!node.left && !node.right) {
      node.parent.left === node ? node.parent.left = null : node.parent.right = null;
      console.log("1b");
    }
    else {
      // One child? Easy
      if (node.left && !node.right){
        if (!node.parent){
          let temp = node.left;
          this.delete(temp);
          this.root.key = temp.key;
          console.log("2a");
          return;
        }
        else if (node.parent.left === node){
          node.parent.left = node.left;
          this.links.push({source: node.parent, target: node.left});
          console.log("2b");
        }
        else {
          node.parent.right = node.left;
          this.links.push({source: node.parent, target: node.right});
          console.log("2c")
        }
        node.left.parent = node.parent;
      }
      else if (!node.left && node.right){
        if (!node.parent){
          let temp = node.right;
          this.delete(temp);
          this.root.key = temp.key;
          console.log("3a")
          return;
        }
        else if (node.parent.left === node){
          node.parent.left = node.right;
          this.links.push({source: node.parent, target: node.left});
          console.log("3b")
        }
        else {
          node.parent.right = node.right;
          this.links.push({source: node.parent, target: node.right});
          console.log("3c");
        }
        node.right.parent = node.parent;
      }

      // Two children? Medium
      else {
        console.log("4");
        let succ = node.successor();
        this.delete(succ);
        node.key = succ.key;
        return;
      }
    }
    // Frontend
    T.nodes.splice(T.nodes.indexOf(node), 1);
    T.links.splice(T.links.findIndex(obj => obj.source === node || obj.target === node), 1);
    let loc = T.links.findIndex(obj => obj.source === node || obj.target === node);
    if (loc != -1) {
    T.links.splice(loc, 1);
    }
  }
}

let svg = d3.select("svg");
let width = svg.style("width").replace('px', '');
let g = svg.append("g");
var curvy = d3.linkHorizontal()
   .x(function(d) { return d.x; })
   .y(function(d) { return d.y; });

// default tree
root = new Node(4);
T = new Tree(width/2, 75);
T.insert(root);
T.insert(new Node(1));
T.insert(new Node(2));
T.insert(new Node(3));

// event listener on number input
d3.select("#insert-key").on("click", function() {
  let node = new Node(parseInt(d3.select("#key")._groups[0][0].value));
  T.insert(node);
  console.log(T);
  restart();
  //  drawSubtree(T.root, 200, 35);
});
// drawSubtree(T.root, 200, 35);

function drawSubtree(node, x, y){
  if (node === null) {
    return
  }
    if (node.left !== null){
  g.append("path").attr("d", curvy({"source" : [x, y], "target" : [x-50, y+50]}))
   .style("fill", "none")
   .style("stroke", "darkslateblue")
   .style("stroke-width", "4px");
  drawSubtree(node.left, x-50, y+50);
  } if (node.right !== null){
    g.append("path").attr("d", curvy({"source" : [x, y], "target" : [x+50, y+50]}))
     .style("fill", "none")
     .style("stroke", "darkslateblue")
     .style("stroke-width", "4px");
     drawSubtree(node.right, x+50, y+50);
  }
  g.append("circle").attr("cx", x)
   .attr("cy", y).attr("r", 20).style("fill", "white");
  g.append("text").attr("x", x).attr("y", y)
   .attr("text-anchor", "middle")
   .attr("alignment-baseline", "central")
   .text(node.key);

}

let link = g.append("g").attr("stroke", "#000").attr("stroke-width", 1.5).selectAll(".link");
let node = g.append("g").attr("stroke-width", 1.5).selectAll("g");
let simulation = d3.forceSimulation(T.nodes).force('charge', d3.forceManyBody().strength(-10)).force('link', d3.forceLink().links(T.links).distance(100)).on('tick', ticked);
restart();
function ticked() {
  node.attr("transform", function(d) {return "translate("+d.x+", "+d.y+")";})
  link.attr("d", function(d) {return curvy(d);});
 }
function restart() {
  link = link.data(T.links);
  link.exit().remove();
  link = link.enter().append("path")
    .attr("d", function(d) {return curvy(d);})
    .style("fill", "none")
    .style("stroke", "darkslateblue")
    .style("stroke-width", "4px")
    .merge(link);


  node = node.data(T.nodes);
  node.exit().remove();
  node = node.enter().append("g")
    .attr("transform", function(d) {return "translate("+d.x+", "+d.y+")";}).merge(node);
  node.on("click", function() {bad_node = d3.select(this)._groups[0][0].__data__; console.log(T); T.delete(bad_node); console.log(T); restart();});   
  node.append('circle').attr("r", 20).style("fill","white"); //.text(function(node) {return node.key;});
  node.append("text").attr("text-anchor", "middle")
   .attr("alignment-baseline", "central").attr("color", "black")
   .text(function(d){return d.key;});

  simulation.nodes(T.nodes);
  simulation.alpha(1).restart();
}

