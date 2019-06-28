function drawFicheActeur(films, yearMin, yearMax, person, category) {
   d3.select("#fiche").html('<div id="chart"></div>   <div id="chart2">     <div id="competences">       <div id = "haut"></div>       <div id = "actor"></div>       <div id = "bas"></div>     </div>   </div>   <div id = "coupe"></div>   <div id = "fetiche1"></div>   <div id = "fetiche2"></div>');

   var filmPerSubject = getSixSubjects(films,person);
   var dataset = filmPerSubject.slice(0,3);

   var dataset2 = filmPerSubject.slice(3,6);

   var nbAwards = getNbOfAwards(films,person);
   if(category == "actor"){
     var type1 = "Réalisateur fétiche";
     var favorite1 = favoriteDirector(films, person);
     var type2 = "Actrice fétiche";
     var favorite2 = favoriteActress(films, person);
    
     
   }
   else if (category == "actress") {
     var type1 = "Réalisateur fétiche";
     var favorite1 = favoriteDirector(films, person);
     var type2 = "Acteur fétiche";
     var favorite2 = favoriteActor(films, person);
   }
   else{
     var type1 = "Actrice fétiche";
     var favorite1 = favoriteActress(films, person);
     var type2 = "Acteur fétiche";
     var favorite2 = favoriteActor(films, person);
   }

   //var data = [{x: 1920, y: 20}, {x: 1950, y: 50}, {x: 1970, y: 87}, {x: 1980, y: 70}, {x: 1990, y: 10}];
   var data = getPopularityPerYear(films, Math.floor(yearMin), Math.floor(yearMax), person);

   var nb = []
   for (i = 0; i < dataset.length; i++) {
   nb.push(dataset[i][1]);
   }
   var nb2 = []
   for (i = 0; i < dataset2.length; i++) {
   nb2.push(dataset2[i][1]);
   }

   const sum = nb.reduce(function(a, b) {return a + b;});
   const sum2 = nb2.reduce(function(a, b) {return a + b;});


   // Largeur et hauteur
   var w2 = 50*dataset.length;
   var h2 = 100;
   var margin = { top: 10, right: 0, bottom: 10, left: 0};
   var step = (w2-40*dataset.length)/dataset.length;
   var colors = {"Comedy":"pink","Horror":"black","Action":"red","Drama":"lightblue","Science Fiction":"green","Mystery":"yellow",
"Music":"blue","War":"orange","Westerns" : "grey", "Western":"grey","Short":"purple","Adventure": "cyan","Fantasy":"rainbow","Romance":"magenta"}
   var svg1 = d3.select("#haut")
            .append("svg")
            .attr("width", w2)
            .attr("height", h2)

   var svg2 = d3.select("#bas")
            .append("svg")
            .attr("width", w2)
            .attr("height", h2)
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

   var svg3 = d3.select("#actor")
            .append("svg")
            .attr("width", w2-step)
            .attr("height", 20+margin.top+margin.bottom);
            /*.append("rect")
            .attr("width", w-step)
            .attr("height", 20+margin.top+margin.bottom)
            .style("fill", "red")
            .attr('transform', `translate(${margin.left}, ${margin.top})`);*/

   svg3.append("rect")
   .attr("width", w2-step)
   .attr("height", 20+margin.top+margin.bottom)
   .style("fill", "black")
   .attr('transform', `translate(${margin.left}, ${margin.top})`);

   svg3.append("text")
   .text(person)
   .attr("x", (w2-step)/2)
   .attr("y", (20+margin.top+margin.bottom)/2+10)
   .attr("font-family", "sans-serif")
   .attr("font-size", "13px")
   .attr("fill", "white")
   .attr("text-anchor", "middle");

   for (i = 0; i < nbAwards; i++) {
   var cups = d3.select("#coupe")
   .append("object")
   .attr("data", "coupe.svg")
   .attr("y", 400)
   .attr("width", 50)
   .attr("height", 50+margin.top+margin.bottom)
   .attr('transform', `translate(${margin.top})`)
   .attr("type", "image/svg+xml");
   }

   var svgFetiche = d3.select("#fetiche1")
            .append("svg");

   svgFetiche.append("text")
   .attr("y", 20)
   .attr("x", 0.4*w2)
   .text(type1)
   .attr("font-family", "sans-serif")
   .attr("font-size", "13px")
   .attr("text-anchor", "middle");

   svgFetiche.append("rect")
   .attr("y", 15)
   .attr("width", 0.8*w2)
   .attr("height", h2/5)
   .style("fill", "black")
   .attr('transform', `translate(${margin.left}, ${margin.top})`);

   svgFetiche.append("text")
   .attr("y", 20+0.19*h2)
   .attr("x", 0.4*w2)
   .text(favorite1)
   .attr("font-family", "sans-serif")
   .attr("font-size", "13px")
   .attr("fill","white")
   .attr("text-anchor", "middle");

   svgFetiche.append("text")
   .attr("y", 20)
   .attr("x", 1.3*w2)
   .text(type2)
   .attr("font-family", "sans-serif")
   .attr("font-size", "13px")
   .attr("text-anchor", "middle");

   svgFetiche.append("rect")
   .attr("y", 15)
   .attr("x", 0.9*w2)
   .attr("width", 0.8*w2)
   .attr("height", h2/5)
   .style("fill", "black")
   .attr('transform', `translate(${margin.left}, ${margin.top})`);

   svgFetiche.append("text")
   .attr("y", 20+0.19*h2)
   .attr("x", 1.3*w2)
   .text(favorite2)
   .attr("font-family", "sans-serif")
   .attr("font-size", "13px")
   .attr("fill","white")
   .attr("text-anchor", "middle");

   var div = d3.select("body").append("div")
      .attr("class", "tooltip_fiche")
      .style("opacity", 0)

   svg1.selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", function(d, i) {return i * w2/dataset.length;})
      .attr("y", function(d) {return h2-d[1]*100/sum;})
      .attr("width", 40)
      .attr("height", function(d) {return d[1]*100/sum;})
      .attr('fill', function(d) { return colors[d[0]];})
      .on('mouseover', function (d, i) {
            div.transition()
               .duration(50)
               .style("opacity", .9);
            div.html(d[0]+"<br/>"+d[1]+" films");
            d3.select(this).transition()
               .duration('50')
               .attr('opacity', '.40')})
      .on('mousemove', function (d,i) {
          div.style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 28) + "px")})
      .on('mouseout', function (d, i) {
         div.transition()
               .duration(50)
               .style("opacity", 0);
            d3.select(this).transition()
               .duration('50')
               .attr('opacity', '1')});

   svg2.selectAll("rect")
      .data(dataset2)
      .enter()
      .append("rect")
      .attr("x", function(d, j) {return j * w2/dataset2.length;})
      .attr("y", 0)
      .attr("width", 40)
      .attr("height", function(d) {return d[1]*100/sum;})
      .attr('fill', function(d) { return colors[d[0]];})
      .on('mouseover', function (d, i) {
            div.transition()
               .duration(50)
               .style("opacity", .9);
            div.html(d[0]+"<br/>"+d[1]+" films");
            d3.select(this).transition()
               .duration('50')
               .attr('opacity', '.40')})
     .on('mousemove', function (d,i) {
         div.style("left", (d3.event.pageX) + "px")
             .style("top", (d3.event.pageY - 28) + "px")})
      .on('mouseout', function (d, i) {
         div.transition()
               .duration(50)
               .style("opacity", 0);
          d3.select(this).transition()
               .duration('50')
               .attr('opacity', '1')});

   //Partie chart
   var margin = {top: 50, right: 50, bottom: 50, left: 50}
   , width = 500 - margin.left - margin.right
   , height = 300 - margin.top - margin.bottom;

   var xScale = d3.scaleLinear()
   .domain([yearMin, yearMax]) // input
   .range([0, width]); // output

   var yScale = d3.scaleLinear()
   .domain([0, 200])
   .range([height, 0]);

   //var data = [{x: 1920, y: 20}, {x: 1950, y: 50}, {x: 1970, y: 87}, {x: 1980, y: 70}, {x: 1990, y: 10}]

   var svg4 = d3.select("#chart").append("svg").attr("width", width + margin.left + margin.right)
                                             .attr("height", height + margin.top + margin.bottom)
                                             .append("g")
                                             .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   svg4.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

   svg4.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(yScale));

   var linef = d3.line().curve(d3.curveBasis).x(function(d) { return xScale(d.x) }).y(function(d) { return yScale(d.y) })

   svg4.append('path')
      .attr('d', linef(data))
      .attr('stroke', 'black')
      .attr('fill', 'none');

   svg4.append("text")
         .attr("x", (width / 2))
         .attr("y", 0 - (margin.top / 2))
         .attr("text-anchor", "middle")
         .style("font-size", "16px")
         .text("Evolution de sa popularité");

   }
