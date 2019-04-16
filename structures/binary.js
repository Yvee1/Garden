class Node {
  constructor(key){
    this.key = key;
    this.left = null;
    this.right = null;
    this.p = null;
  }
}

class Tree {
  constructor(root){
    this.root = root;
  }

  insert(node) {
    let y = null;
    let x = this.root;

    while (x !== null) {
      y = x;
      node.key < x.key ? x = x.left : x = x.right;
    }
    
    if (y === null) {
      this.root = x;
    }
    else {
      node.key < y.key ? y.left = node : y.right = node;
    }
  }
}

// default tree
root = new Node(4);
T = new Tree(root);
T.insert(new Node(2));
T.insert(new Node(7));
// event listener on number input
d3.select("#insert-key").on("click", function() {
  let node = new Node(d3.select("#key")._groups[0][0].value);
  T.insert(node);
  drawSubtree(T.root, 200, 35);
});
let svg = d3.select("svg");
let g = svg.append("g");
var link = d3.linkHorizontal()
    .x(function(d) { return d[0]; })
    .y(function(d) { return d[1]; });
drawSubtree(T.root, 200, 35);

function drawSubtree(node, x, y){
  if (node === null) {
    return
  }
    if (node.left !== null){
  g.append("path").attr("d", link({"source" : [x, y], "target" : [x-50, y+50]}))
   .style("fill", "none")
   .style("stroke", "darkslateblue")
   .style("stroke-width", "4px");
  drawSubtree(node.left, x-50, y+50);
  } if (node.right !== null){
    g.append("path").attr("d", link({"source" : [x, y], "target" : [x+50, y+50]}))
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
