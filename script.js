/*
 * QuickFind visualization
 */

// Generate our data- a list of n nodes and an empty list of links, formatted according to d3's needs
function generateNodes(n) {
  const nodesArr = [...Array(n).keys()].map((i) => {
    return { id: i, group: i, changed: false };
  });
  const data = { nodes: nodesArr, links: [] };
  return data;
}

function quickFindVis() {
  console.log("hello quickfind");
  // Specify the dimensions of the chart.
  const width = 800;
  const height = 600;
  let graph = generateNodes(10);
  // function chart(graph) {
  console.log("chart function??");
  var svg = d3
    .select("#quickfind-viz")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; background:#f8f9f1");
  console.log("for example the svg isn't null here");
  console.log(svg);

  var simulation = d3
    .forceSimulation()
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force(
      "charge",
      d3
        .forceManyBody()
        .strength(-20)
        .distanceMax(height / 2)
    )
    .nodes(graph.nodes)
    .force("link", d3.forceLink(graph.links).distance(60))
    .on("tick", function () {
      svg
        .selectAll(".link")
        .attr("x1", function (d) {
          return d.source.x;
        })
        .attr("y1", function (d) {
          return d.source.y;
        })
        .attr("x2", function (d) {
          return d.target.x;
        })
        .attr("y2", function (d) {
          return d.target.y;
        });

      svg
        .selectAll(".node")
        .attr("cx", function (d) {
          return d.x;
        })
        .attr("cy", function (d) {
          return d.y;
        })
        .attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ")";
        });
    });
  // Array tracker
  const cellSize = 40;
  var xOffset = width / 2 - (graph.nodes.length * cellSize) / 2;

  var idArray = svg
    .selectAll(".tracker-box")
    .data(graph.nodes)
    .join(
      (enter) => {
        let tracker = enter.append("g").attr("class", "tracker-box");
        let idLabels = tracker
          .append("text")
          .text((d) => d.id)
          .attr("x", (d) => xOffset + d.id * cellSize)
          .attr("y", height - cellSize * 1.2)
          .attr("stroke", "#000")
          .style("text-anchor", "middle")
          .style("font-size", "15px");

        // backing rectangles
        let arrayBoxes = tracker
          .append("rect")
          .attr("width", cellSize - 5)
          .attr("height", cellSize - 5)
          .attr("x", (d) => xOffset + 2.5 + d.id * cellSize - cellSize / 2)
          .attr("y", height - cellSize)
          .style("fill", "#282828ff");

        // labels in rectangles indicating connection group
        let groupLabels = tracker
          .append("text")
          .attr("class", "group-label")
          .text((d) => d.group)
          .attr("x", (d) => xOffset + d.id * cellSize)
          .attr("y", 3 + height - cellSize / 2)
          .attr("z", 5)
          .attr("fill", "#fff")
          .style("text-anchor", "middle")
          .style("font-size", "15px");
        return tracker;
      },
      (update) => update,
      (exit) => exit.remove()
    );

  function update() {
    idArray.call((update) => {
      update.selectAll(".group-label").remove();
      update
        .append("text")
        .attr("class", "group-label")
        .text((d) => d.group)
        .attr("x", (d) => xOffset + d.id * cellSize)
        .attr("y", 3 + height - cellSize / 2)
        .attr("z", 5)
        .attr("fill", "#fff")
        .style("text-anchor", "middle")
        .style("font-size", "15px");
      update.attr("class", (d) =>
        d.changed ? "tracker-box changed" : "tracker-box"
      );
      let changed = svg.selectAll(".changed rect");
      console.log("changed nodes?");
      console.log(changed);

      changed
        .transition()
        .style("fill", "#8be2f9")
        .delay((d, i) => i * 300)
        .duration(200)
        .transition()
        .duration(300)
        .style("fill", "#282828")
        .delay((d, i) => i * 300);
    });
    // update links
    var link = svg.selectAll(".link").data(graph.links);
    link
      .enter()
      .insert("line", ".node")
      .attr("class", "link")
      .style("stroke", "#282828");
    link.exit().remove();

    // update nodes
    var node = svg.selectAll(".node").data(graph.nodes);
    var g = node.enter().append("g").attr("class", "node");
    g.append("circle").attr("r", 20).style("fill", "#8be2f9");
    g.append("text")
      .attr("class", "text")
      .style("text-anchor", "middle")
      .attr("y", "5")
      .text(function (d) {
        return d.id;
      });
    node.exit().remove();

    // update simulation
    simulation
      .nodes(graph.nodes)
      .force("link", d3.forceLink(graph.links).distance(60))
      .force(
        "charge",
        d3
          .forceManyBody()
          .strength(-20)
          .distanceMax(height / 2)
      )
      .alpha(0.5)
      .restart();
  }

  update();

  function updateNodeGroups(node1, node2) {
    const node2Obj = graph.nodes[node2]; //graph.nodes.find((n) => n.id == node2);
    const node2Group = node2Obj.group;
    const node1Obj = graph.nodes[node1]; //graph.nodes.find((n) => n.id == node1);
    const updatedNodes = graph.nodes.map((n) => {
      if (n.group == node2Group) {
        n.group = node1Obj.group;
        n.changed = true;
      } else {
        n.changed = false;
      }
      return n;
    });
    return updatedNodes;
  }

  function connectNodes(source, target) {
    graph.links.push({
      source: source,
      target: target,
    });
    graph.nodes = updateNodeGroups(source, target);
    update();
  }

  const unionBtn = document.querySelector("#qf_union");
  const input1 = document.querySelector("#qf_node1");
  const input2 = document.querySelector("#qf_node2");

  unionBtn.addEventListener("click", function (e) {
    e.preventDefault();
    if (input1.value && input2.value) {
      const node1 = parseInt(input1.value);
      const node2 = parseInt(input2.value);
      connectNodes(node1, node2);
    }
  });
}

window.onload = function () {
  quickFindVis();
};
