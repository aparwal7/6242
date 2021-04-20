// dbader7 - common javascript utility functions
// svg = selected element
// x, y coordinates; r = radius, text to center
function legendMarker (svg, x, y, r, text) {
	svg.append("circle").attr("cx", x).attr("cy", y).attr("r", r) 
		.style("fill", "rgb(31, 119, 180)")
		.style("stroke", "red")
		.style("stroke-width", 1);
	svg.append("text")
	   .text(text)
	   .attr("x", x).attr("y", y)
	   .attr("font-size", "11px")
	   //.attr("font-weight", "bold")
	   .style('fill', 'white')
	   // .attr("class","tbd"
	   .attr("alignment-baseline", "middle")
	   .attr("text-anchor", "middle");
}

// svg = parent element
// x, y coordinates; r = radius; names = text array; color = color function
function build_legend (svg, x, y, r, names, colors) {
	svg.selectAll("legend_dots")
  		.data(names)
  		.enter()
  		.append("circle").attr("cx", x).attr("cy", function(d,i) {return (y + i*25)}).attr("r", r)
    	.style("fill", function(d, i) {return d3.schemeCategory10[i]});
    	//.style("fill", "red");

	svg.selectAll("legend_labels")
  		.data(names)
  		.enter()
  		.append("text").attr("x", (x + 10)).attr("y", function(d,i) {return (y + i*25)})
    	.style("fill", function(d, i) {return d3.schemeCategory10[i]})
    	.text( function(d) {return d})
    	.attr("text-anchor", "left")
    	.style("alignment-baseline", "middle");
}

function symbolMarker (svg, x, y, r, text) {
	symbol = d3.symbol('star', r);
 	svg.append(symbol).attr("x", x).attr("y", y);
}

// attr("x", 300).attr("y", margin + padding)
function addGtUserStamp(svg, x=5, y=5, gtUsername='dbader7') {
	svg.append("text")
		.attr("id", "gtuser")
   		.text(gtUsername)
   		.attr("x", x).attr("y", y)
   		.attr("font-size", "16px")
   	return svg;
}

// Experimenta or debug
function inspectSelection (selection) {
	for (const element of selection) {
	  console.log(element);
	};
}

function inspectCustomData (selection) {
	selection.datum (function() { 
		console.log(this.dataset);
		//return this.dataset; 
	})
}

function flattenSelection (selection) {
	const elements = [...selection];
	return elements;
}
