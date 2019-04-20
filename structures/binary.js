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
  //unused
  copy() {
    let clone = new Node(this.key);
    clone.left = this.left;
    clone.right = this.right;
    clone.parent = this.parent;
    return clone;
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
    if (node === this.root && !node.left && !node.right){
      this.root = null;
    }
    // No children? 
    else if (!node.left && !node.right) {
      node.parent.left === node ? node.parent.left = null : node.parent.right = null;
    }
    else {
      // One child? 
      if (node.left && !node.right){
        if (!node.parent){
          let temp = node.left;
          this.delete(temp);
          this.root.key = temp.key;
          return;
        }
        else if (node.parent.left === node){
          node.parent.left = node.left;
          node.left.x = node.x;
          node.left.y = node.y;
          this.links.push({source: node.parent, target: node.left});
        }
        else {
          node.parent.right = node.left;
          node.left.x = node.x;
          node.left.y = node.y;
          this.links.push({source: node.parent, target: node.left});
        }
        node.left.parent = node.parent;
      }
      else if (!node.left && node.right){
        if (!node.parent){
          let temp = node.right;
          this.delete(temp);
          this.root.key = temp.key;
          return;
        }
        else if (node.parent.left === node){
          node.parent.left = node.right;
          node.right.x = node.x;
          node.right.y = node.y;
          this.links.push({source: node.parent, target: node.right});
        }
        else {
          node.parent.right = node.right;
          node.right.x = node.x;
          node.right.y = node.y;
          this.links.push({source: node.parent, target: node.right});
        }
        node.right.parent = node.parent;
      }

      // Two children?
      else {
        let succ = node.successor();
        this.delete(succ);
        node.key = succ.key;
        return;
      }
    }
    // Frontend
    T.nodes.splice(T.nodes.indexOf(node), 1);
    let loc = T.links.findIndex(obj => obj.source === node || obj.target === node);
    if (loc != -1) {
      T.links.splice(loc, 1);
    }
    loc = T.links.findIndex(obj => obj.source === node || obj.target === node);
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
root = new Node(5);
T = new Tree(width/2, 75);
T.insert(root);
T.insert(new Node(3));
T.insert(new Node(8));
T.insert(new Node(4));
T.insert(new Node(2));

// event listener on number input
d3.select("#insert-key")
  .on("click", handleInsertion)
d3.select("#key")
  .on("keyup", function() {
    console.log("PRESSED");
    if(d3.event.keyCode === 13) {
      event.preventDefault();
      handleInsertion();
    }
  });

function handleInsertion() {
  let node = new Node(parseInt(d3.select("#key")._groups[0][0].value));
  T.insert(node);
  restart();
};

// make groups of for links and nodes
let link = g.append("g")
  .attr("stroke", "#000")
  .attr("stroke-width", 1.5)
  .selectAll(".link");
let node = g.append("g")
  .attr("stroke-width", 1.5)
  .selectAll("g");
// make a force simulation
let simulation = d3.forceSimulation(T.nodes)
  .force('charge', d3.forceManyBody().strength(-10))
  .force('link', d3.forceLink().links(T.links).distance(100))
  .on('tick', ticked);
// start the simulation
restart();

function ticked() {
  // gets called every tick of the simulation, update locations
  node.attr("transform", d => "translate("+d.x+", "+d.y+")");
  link.attr("d", d => curvy(d));
 }
function restart() {
  // check for new links and add/remove them accordingly
  link = link.data(T.links);
  link.exit().remove();
  link = link.enter().append("path")
    .attr("d", d => curvy(d))
    .style("fill", "none")
    .style("stroke", "darkslateblue")
    .style("stroke-width", "4px")
    .merge(link);


  // check for new nodes and add/remove them accordingly
  node = node.data(T.nodes);
  node.exit().remove();
  node = node.enter().append("g")
    .attr("transform", d => "translate("+d.x+", "+d.y+")")
    .merge(node);

  // add click event handlers for new nodes: delete the node
  node.on("click", function(d) {
        let succ = d.successor();
    d3.select(this).classed("highlighted", false);
    if (succ) {
      node.filter((d, i) => i === succ.index)
        .classed("successor", false);
    }
    T.delete(d);
    restart();

  });   

  // add hover event handlers: hightlight current and successor
  node.on("mouseover", function(d) {
    let succ = d.successor();
    d3.select(this).classed("highlighted", true);
    if (succ) {
      node.filter((d, i) => i === succ.index)
        .classed("successor", true);
    }
  });
  node.on("mouseout", function(d) {
    let succ = d.successor();
    d3.select(this).classed("highlighted", false);
    if (succ) {
      node.filter((d, i) => i === succ.index)
        .classed("successor", false);
    }
  });

  // add circle for each new node with text for the key
  node.append('circle')
    .attr("r", 20);
  node.append("text")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "central")
    .text(function(d){return d.key;});

  simulation.nodes(T.nodes);
  simulation.alpha(1).restart();
}

