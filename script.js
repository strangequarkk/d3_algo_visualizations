/*
 * QuickFind visualization
 */

// Generate our data- a list of n nodes and an empty list of links, formatted according to d3's needs
function generateNodes(n) {
  const nodesArr = [...Array(n).keys()].map((i) => {
    return { id: i, name: i };
  });
  const data = { nodes: nodesArr, links: [] };
  return data;
}

function quickFindVis() {
  function chart(data) {
    // Specify the dimensions of the chart.
    const width = 800;
    const height = 600;

    // Specify the color scale.
    //const color = d3.scaleOrdinal(d3.schemeCategory10);

    // The force simulation mutates links and nodes, so create a copy
    // so that re-evaluating this cell produces the same result.
    const links = data.links.map((d) => ({ ...d }));
    const nodes = data.nodes.map((d) => ({ ...d }));

    // Create a simulation with several forces.
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(links).id((d) => d.id)
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", ticked);

    // Create the SVG container.
    const svg = d3
      .select("#quickfind-viz")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; background:#f8f9f1");

    // Add a line for each link, and a circle for each node.
    const link = svg
      .append("g")
      .attr("stroke", "#282828ff")
      .attr("stroke-opacity", 0.6)
      .selectAll()
      .data(links)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.value));

    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll()
      .data(nodes)
      .join("g")
      .append("circle")
      .attr("r", 20)
      .attr("fill", "#8be2f9ff");

    const label = node.select(function () {
      return this.parentNode;
    });

    label
      .append("text")
      .text((d) => d.id)
      .attr("fill", "#000")
      .attr("stroke", "none")
      .style("text-anchor", "middle")
      .style("font-size", "15px");

    // Add a drag behavior.
    // node.call(
    //   d3
    //     .drag()
    //     .on("start", dragstarted)
    //     .on("drag", dragged)
    //     .on("end", dragended)
    // );

    // Set the position attributes of links and nodes each time the simulation ticks.
    function ticked() {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      label
        .select("text")
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y + 5);
    }

    // // Reheat the simulation when drag starts, and fix the subject position.
    // function dragstarted(event) {
    //   if (!event.active) simulation.alphaTarget(0.3).restart();
    //   event.subject.fx = event.subject.x;
    //   event.subject.fy = event.subject.y;
    // }

    // // Update the subject (dragged node) position during drag.
    // function dragged(event) {
    //   event.subject.fx = event.x;
    //   event.subject.fy = event.y;
    // }

    // // Restore the target alpha so the simulation cools after dragging ends.
    // // Unfix the subject position now that it’s no longer being dragged.
    // function dragended(event) {
    //   if (!event.active) simulation.alphaTarget(0);
    //   event.subject.fx = null;
    //   event.subject.fy = null;
    // }

    // When this cell is re-run, stop the previous simulation. (This doesn’t
    // really matter since the target alpha is zero and the simulation will
    // stop naturally, but it’s a good practice.)
    //invalidation.then(() => simulation.stop());

    const idArray = svg.append("g").selectAll().data(nodes).join("g");
    const cellSize = 40;
    var xOffset = width / 2 - (nodes.length * cellSize) / 2;
    console.log("x offset?", xOffset);
    //node ids indicating index
    idArray
      .append("text")
      .text((d) => d.id)
      .attr("x", (d) => xOffset + d.id * cellSize)
      .attr("y", height - cellSize * 1.2)
      .attr("stroke", "#000")
      .style("text-anchor", "middle")
      .style("font-size", "15px");

    //rectangles
    idArray
      .append("rect")
      .attr("width", cellSize - 5)
      .attr("height", cellSize - 5)
      .attr("x", (d) => xOffset + 2.5 + d.id * cellSize - cellSize / 2)
      .attr("y", height - cellSize)
      .style("fill", "#282828ff");

    //labels in rectangles
    idArray
      .append("text")
      .text((d) => d.name)
      .attr("x", (d) => xOffset + d.id * cellSize)
      .attr("y", 3 + height - cellSize / 2)
      .attr("z", 5)
      //.attr("stroke", "#fff")
      .attr("fill", "#fff")
      .style("text-anchor", "middle")
      .style("font-size", "15px");
    // const arrayLabels =
    return svg.node();
  }

  data = generateNodes(10);
  chart(data);
}

window.onload = function () {
  quickFindVis();
};
