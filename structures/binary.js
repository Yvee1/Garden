class Node {
  constructor(key){
    this.key = key;
    this.left = null;
    this.right = null;
    this.p = null;
  }
  setPos(x, y){
    this.x = x;
    this.y = y;
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

    while (v !== null) {
      p = v;
      node.key < v.key ? v = v.left : v = v.right;
    }

    if (p === null) {
      node.setPos(this.x, this.y);
      this.root = node;
    }
    else {
      if(node.key < p.key) { 
        node.setPos(p.x-50, p.y+50);
        p.left = node;
      }
      else {
        node.setPos(p.x+50, p.y+50);
        p.right = node;
      }
      this.links.push({source: p, target: node});
    }
    this.nodes.push(node);
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
T.insert(new Node(2));
T.insert(new Node(7));
// event listener on number input
d3.select("#insert-key").on("click", function() {
  let node = new Node(parseInt(d3.select("#key")._groups[0][0].value));
  T.insert(node);
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
    
  node.append('circle').attr("r", 20).style("fill","white"); //.text(function(node) {return node.key;});
  node.append("text").attr("text-anchor", "middle")
   .attr("alignment-baseline", "central").attr("color", "black")
   .text(function(d){return d.key;});

  simulation.nodes(T.nodes);
  simulation.alpha(1).restart();
  console.log(T.links);
}

