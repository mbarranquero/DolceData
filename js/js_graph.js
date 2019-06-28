function drawGraph(dataset, yearMin, yearMax)
{
  //create somewhere to put the force directed graph
  var svg_graph = d3.select("#graph"),
   width = +svg_graph.node().getBoundingClientRect().width,
   height = +svg_graph.node().getBoundingClientRect().height;

  svg_graph.selectAll("*").remove();

  var nodes_data = computeAllNodes(dataset);

  var links_data = computeAllLinks(dataset);

  //set up the simulation
  //nodes only for now
  var simulation = d3.forceSimulation()
                .nodes(nodes_data);

  window.scrollBy(100, 0); 
  //add forcess
  //we're going to add a charge to each node
  //also going to add a centering force
  simulation
      .force("charge_force", d3.forceManyBody().strength(-100))
      .force("x", d3.forceX(width / 2))
      .force("y", d3.forceY(height / 2));

  var radius = 10;

  function sizeBlob(t) {
      return 12 + t/25;
  }

  //draw lines for the links
  var link = svg_graph.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links_data)
        .enter().append("line")
        .attr("stroke-width", linkThickness)
        .style("stroke", "lightgrey");

  //draw circles for the F
  var node = svg_graph.append("g")
          .attr("class", "nodes")
          .selectAll("rect")
          .data(nodes_data)
          .enter()
          .append("rect")
          .attr("width", d =>sizeBlob(d.popularity))
          .attr("height", d =>sizeBlob(d.popularity))
          .attr("rx", d => d.category != "director" ? 100 : 0)
          .attr("fill", nodeColour)
          .style("stroke", "black")
          .attr("stroke-width", 0)
          .on("click", handleClick)
          .on("mouseover", handleMouseOver)
          .on("mouseout", handleMouseOut);

  var lastCircle = null;

  function handleClick(d, i) {  // Add interactivity
        if(lastCircle != null)
        {
            d3.select(lastCircle).attr("stroke-width", 0);
        }

        if(this == lastCircle)
        {
          d3.select(lastCircle).attr("stroke-width", 0);
          lastCircle = null;
        }
        else
        {
          // Use D3 to select element, change color and size
          d3.select(this).attr("stroke-width", 2);
          lastCircle = this;
          console.log("handle!");
          drawFicheActeur(dataset, yearMin, yearMax, d.name, d.category);
        }
      }

  // Create Event Handlers for mouse
  function handleMouseOver(d, i) {  // Add interactivity
      // Specify where to put label of text
      svg_graph.append("text").attr("id", "t" + i).attr("x", function() { return d.x - 30; }).attr("y", function() { return d.y - 15; })
      .text(d.name);
    }

  function handleMouseOut(d, i) {
      // Select text by id and then remove
      d3.select("#t" + i).remove();  // Remove text location
    }


  //Create the link force
  //We need the id accessor to use named sources and targets
  var link_force =  d3.forceLink(links_data)
                          .id(function(d) { return d.name; })

  simulation.force("links",link_force)

  function nodeColour(d){
      if(d.favSubject == "Comedy"){
          return "pink";
      }
      else if(d.favSubject == "Horror"){
        return "black";
      }
      else if(d.favSubject == "Action"){
        return "red";
      }
      else if(d.favSubject == "Drama"){
        return "lightblue";
      }
      else if(d.favSubject == "Science Fiction"){
        return "green";
      }
      else if(d.favSubject == "Mystery"){
        return "yellow";
      }
      else if(d.favSubject == "Music"){
        return "blue";
      }
      else if(d.favSubject == "War"){
        return "orange";
      }
      else if(d.favSubject == "Westerns" | d.favSubject == "Western"){
        return "grey";
      }
      else if(d.favSubject == "Short"){
        return "purple";
      }
      else if(d.favSubject == "Adventure"){
        return "cyan";
      }
      else if(d.favSubject == "Fantasy"){
        return "rainbow";
      }
      else if(d.favSubject == "Romance"){
        return "magenta";
      }
  }

  //Function to choose the line thickness
  function linkThickness(d){
      return 1+d.nbOfFilm;
  }


  // The complete tickActions function
  function tickActions() {
      //update circle positions each tick of the simulation
      node
          .attr("x", function(d) { return d.x- sizeBlob(d.popularity)/2; })
          .attr("y", function(d) { return d.y- sizeBlob(d.popularity)/2; });

      //update link positions
      //simply tells one end of the line to follow one node around
      //and the other end of the line to follow the other node around
      link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
    }

  simulation.on("tick", tickActions );

  //create drag handler with d3.drag()
  var drag_handler = d3.drag()
      .on("start", drag_start)
      .on("drag", drag_drag)
      .on("end", drag_end);

  function drag_start(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function drag_drag(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  var fixedNodes = [];

  function drag_end(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = d.x;
    d.fy = d.y;
    fixedNodes.push(d);
  }

  document.getElementById('body').addEventListener('keydown', (e) => {
      if(e.key == "r")
      {
        for(d in fixedNodes)
        {
          fixedNodes[d].fx = null;
          fixedNodes[d].fy = null;
        }

        fixedNodes = [];
      }
      else if(e.key == 's')
      {
        simulation.stop();
      }
  });


  //apply the drag_handler to our circles
  drag_handler(node);
  drag_handler(link);
}
