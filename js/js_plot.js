// Set the dimensions of the canvas / graph
var svg_plot = d3.select("#canvas_svg"),
 w = +svg_plot.node().getBoundingClientRect().width,
 h = +svg_plot.node().getBoundingClientRect().height;

var dataset = [];

var padding = 50;

d3.csv("data/film.csv")
  .row( (d, i) => {
      return {
        year: +d["Year"],
        length: +d.Length,
        title: d.Title,
        subject: d.Subject,
        actor: d.Actor,
        director: d.Director,
        actress: d.Actress,
        popularity: +d.Popularity,
        award: d.Awards,
      };
  })
  .get((error, rows) => {
      x = d3.scaleLinear()
        .domain(d3.extent(rows, (row) => row.year))
        .range([padding, w - padding * 2]);
      y = d3.scaleLinear()
        .domain(d3.extent(rows, (row) => row.popularity))
        .range([h - padding * 2, padding]);
      dataset = rows;
      draw(dataset);
      drawGraph(dataset, 1920, 1997);
  });

var canvas = d3.select("#canvas");

//Create SVG element
var svg = d3.select("#canvas_svg")
            .attr("width", w)
            .attr("height", h);

function circleColour(d){
    if(d.subject == "Comedy"){
        return "pink";
    }
    else if(d.subject == "Horror"){
      return "black";
    }
    else if(d.subject == "Action"){
      return "red";
    }
    else if(d.subject == "Drama"){
      return "lightblue";
    }
    else if(d.subject == "Science Fiction"){
      return "green";
    }
    else if(d.subject == "Mystery"){
      return "yellow";
    }
    else if(d.subject == "Music"){
      return "blue";
    }
    else if(d.subject == "War"){
      return "orange";
    }
    else if(d.subject == "Westerns" | d.subject == "Western"){
      return "grey";
    }
    else if(d.subject == "Short"){
      return "purple";
    }
    else if(d.subject == "Adventure"){
      return "cyan";
    }
    else if(d.subject == "Fantasy"){
      return "rainbow";
    }
    else if(d.subject == "Romance"){
      return "magenta";
    }
}

var xScale = d3.scaleLinear()
                .domain([1920, 1997])
                .range([0, w - 3 * padding]);

var yScale = d3.scaleLinear()
                .domain([0, 100])
                .range([h - 3 * padding +8, 0]);

//Define X axis
var xAxis = d3.axisBottom()
              .scale(xScale).tickFormat(d3.format("d"));

//Define Y axis
var yAxis = d3.axisLeft()
              .scale(yScale).tickFormat(x => x + "%");

// Draw the data
function draw(dataset_) {
    svg.append("g")
        .attr("class", "dataset")
        .selectAll("circle")
        .data(dataset_)
        .enter()
        .append("circle")
        .attr("r", 3)
        .attr("fill", circleColour)
        .attr("cx", (d) => x(d.year) )
        .attr("cy", (d) => y(d.popularity) )
        .on("mouseover", function(d) {
            return tooltip.style("visibility", "visible").html('' + d.title + '<br/>'  + d.subject);})
        .on("mousemove", function(){return tooltip.style("top",
                (d3.event.pageY+10)+"px").style("left",(d3.event.pageX-50)+"px");})

        .on("mouseout", function(d) {
          return tooltip.style("visibility", "hidden")});

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(45, 505)")
        //.call(d3.axisBottom(x)) ;
        .call(xAxis) ;
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(45, 45)")
        //.call(d3.axisLeft(y)) ;
        .call(yAxis) ;
}


var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .attr("font-family", "sans-serif")
    .attr("font-size", "5px");


// Create Event Handlers for mouse
function handleMouseOver(d) {  // Add interactivity

  // Use D3 to select element, change color and size
  d3.select(this).attr({
    fill: "magenta",
  //  r: radius * 2
  });

  // Specify where to put label of text
  svg.append("text").attr({
     //id: "t" + d.title,  // Create an id for text so we can select it later for removing on mouseout
      year: function() { return xScale(d.year) - 30; },
      popularity: function() { return yScale(d.popularity) - 15; }
  })
  .text(function() {
    return [d.title];  // Value of the text
  });
}

/*function handleMouseOut(d, i) {
      // Use D3 to select element, change color back to normal
      d3.select(this).attr({
        fill: "black",
        r: radius
      });

      // Select text by id and then remove
      d3.select("#t" + d.x + "-" + d.y + "-" + i).remove();  // Remove text location
    }
*/

let clickX;
let clickY;
let firstclick = false;

svg.append("rect").attr("id", "rect_sel").attr("style", "stroke: #000000; stroke-width: 3; fill: none;");

canvas.on("mousedown", function() {
  clickX = d3.mouse(this)[0];
  clickY = d3.mouse(this)[1];
  firstclick = true;
});

canvas.on("mouseup", function() {
  if(firstclick)
  {
    firstclick = false;

    var a = Math.min(d3.mouse(this)[0], clickX);
    var b = Math.max(d3.mouse(this)[0], clickX);
    var c = Math.min(d3.mouse(this)[1], clickY);
    var d = Math.max(d3.mouse(this)[1], clickY);

    drawGraph(popularityFilter(yearFilter(dataset, xScale.invert(a-45), xScale.invert(b-45)), -0.2174*d+110, -0.2174*c+110), xScale.invert(a-45), xScale.invert(b-45));

    if(a == b && c == d)
    {
      d3.select("#rect_sel").attr("visibility", "hidden");
      return;
    }
  }
});

canvas.on("mousemove", function() {
  if(firstclick)
  {
    d3.select("#rect_sel").attr("visibility", "visible");
    d3.select("#rect_sel").attr("width", Math.abs(d3.mouse(this)[0] - clickX)).attr("height", Math.abs(d3.mouse(this)[1] - clickY))
    .attr("x", Math.min(clickX, d3.mouse(this)[0])).attr("y", Math.min(clickY, d3.mouse(this)[1]));
  }
});
