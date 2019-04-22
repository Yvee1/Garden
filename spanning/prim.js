class Node {
  constructor(i){
    this.index = i;
    this.id = 'n' + i;
    this.label = 'Node ' + i;
    this.x =  Math.random();
    this.y = Math.random();
    this.size = Math.random();
    this.color = '#666';
    this.parent = null;
  }
}

class Heap {
  static insert(array, node){
    node.key = Infinity;
    array[array.length] = node;
  }

  static minimum(array){
    if(array.length < 1)
      return null;
    
    return array[0];
  }

  static extractMin(array){
    if (array.length < 1)
      return null;
    let min = array[0];
    array[0] = array[array.length-1]
    array.pop();
    Heap.minHeapify(array, 0);
    return min;
  }

  /*ensures that the heap whose root is stored
  at position i has the min-heap property*/
  static minHeapify(array, index){
    let left = Heap.left(array, index),
        right = Heap.right(array, index),
        largest;

    // calculate largest
    largest = left < array.length && array[left].key > array[index].key ? left : index;
    if (right < array.length && array[right].key > array[largest].key) largest = right;
    // if our root is not the largest, swap it with the largest and recurse
    if (largest != index){
      Heap.exchange(array, index, largest);
      Heap.minHeapify(array, largest);
    }
  }

  static decreaseKey(array, index, newKey){
    let node = array[index];
    if (newKey > node.key) {
      throw("decreaseKey should receive a lower key than current.");
      return
    }

    node.key = newKey;
    while (index>0 && array[Heap.parent(array, index)].key > node.key){
      Heap.exchange(array, Heap.parent(array, index), index);
      index = Heap.parent(array, index);
    }
  }

  static parent(array, index){
    return Math.floor((index+1)/2) - 1;
  }

  static left(array, index){
    return 2*(index+1) - 1;
  }

  static right(array, index){
    return 2*(index+1);
  }

  static exchange(array, i, j){
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

// Adapted from sigma.js example (added Prim's algorithm)

let i,
    s,
    N = 100,    // Number of nodes
    E = 500,    // Number of edges
    g = {       // The graph
      nodes: [],
      edges: []
    },
    Q = [],     // Min-priority queue
    Adj = [];   // Adjacency list 

// Generate a random nodes
for (i = 0; i < N; i++){
  g.nodes.push(new Node(i));
  Heap.insert(Q, new Node(i));
  Adj[i] = [];
}

// Generate random edges
for (i = 0; i < E; i++){
  let node1 = Math.floor(Math.random() * N);
  let node2 = Math.floor(Math.random() * N);
  // Add to adjacency list
  Adj[node1].push(node2);
  Adj[node2].push(node1);
}

// Prim's algorithm
Heap.decreaseKey(Q, 0, 0); // Set key of root to 0
while(Q.length > 0){
  let u = Heap.extractMin(Q);
  for (i = 0; i < Adj[u.index].length; i++){
    // Get the node v in Q (if it is in Q)
    let v_index = Adj[u.index][i];
    let v_Q_index = Q.findIndex(obj => obj.id === 'n' + v_index);

    let v = v_Q_index >= 0 ? Q[v_Q_index] : null;
    if (v){
      let dist = weight(u, v);
      if (dist < v.key){
        g.nodes[v_index].parent = u.index;
        Heap.decreaseKey(Q, v_Q_index , dist);
      }
    }
  }
}

// Take Euclidean distance as weight of the edges
function weight(node1, node2){
  // no square root since it saves computation time
  return ((node1.x - node2.x)**2 + (node1.y - node2.y)**2);
}

// Add all edges to the graph and color them grey 
let current_edge = 0;
for (i = 0; i < N; i++){
  for (j = 0; j < Adj[i].length; j++){
    g.edges.push({
      id: 'e' + current_edge,
      source: 'n' + (i | 0),
      target: 'n' + (Adj[i][j] | 0),
      size: 0.5,
      color: '#ccc'
    });
    current_edge++;
  }
}

// Add spanning tree edges to graph and color them red
for (i = 0; i < N; i++){
  if (g.nodes[i].parent !== null){
  g.edges.push({
    id: 'e' + current_edge,
    source: 'n' + (i | 0),
    target: 'n' + (g.nodes[g.nodes[i].parent].index | 0),
    size: 3,
    color: '#6c71c4'
  });
  current_edge++;
  }
}

// Instantiate sigma
s = new sigma({
  graph: g,
  container: 'graph-container'
});

s.settings({
  minEdgeSize: 0.5,
  maxEdgeSize: 3,
});

s.refresh();
