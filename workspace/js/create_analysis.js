$(document).ready(function () {
  console.log("drawing analysis")
  // 2. Use the margin convention practice
  const width = 600;
  const height = 500;
  const margin = 40;
  const padding = 40;
  const adj = 25;

// we are appending SVG first
  const svg = d3.select("div#construction-permits-analysis").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "-"
      + 0 + " -"
      +0 + " "
      + (width + adj *2) + " "
      + (height + adj * 2))
    .style("padding", padding)
    .style("margin", margin)
    .attr("width", width)
    .attr("height", height)
    .classed("svg-content", true);

//-----------------------------DATA------------------------------//
  const timeConv = d3.timeParse("%Y-%m-%d");
  d3.csv("analysis_data.csv", function (data) {
    console.log("reading data: ", data)
    const slices = data.columns.slice(1).map(function (id) {
      return {
        id: id,
        values: data.map(function (d) {
          return {
            date: timeConv(d.date),
            measurement: +d[id]
          };
        })
      };
    });
    console.log("slices:",slices)

//----------------------------SCALES-----------------------------//
    const xScale = d3.scaleTime().range([0, width]);
    const yScale = d3.scaleLinear().rangeRound([height, 0]);

    xScale.domain(d3.extent(data, function (d) {
      return timeConv(d.date)
    }));
    yScale.domain([(0), d3.max(slices, function (c) {
      return d3.max(c.values, function (d) {
        return d.measurement + 4;
      });
    })
    ]);
//-----------------------------AXES------------------------------//
    const yaxis = d3.axisLeft()
      .ticks(10)
      .scale(yScale);

    const xaxis = d3.axisBottom()
      .ticks(10)
      .tickFormat(d3.timeFormat('%b %y'))
      .scale(xScale);
//----------------------------LINES------------------------------//

    const line = d3.line()
      .x(function (d) {
        return xScale(d.date);
      })
      .y(function (d) {
        return yScale(d.measurement);
      });

    let id = 0;
    const ids = function () {
      return "line-" + id++;
    }
//-------------------------2. DRAWING----------------------------//

//-----------------------------AXES------------------------------//
    svg.append("g")
      .attr("classed", "axis")
      .style("font", "14px")
      .attr("transform", "translate(" + margin + "," + height + ")")
      .call(xaxis)
      .append("text")
      // .attr("transform", "rotate(-90)")
      .attr("y", margin)
      .attr("x", width / 2)
      .style("text-anchor", "end")
      .style("fill", "#000")
      .style("font-size", "14px")
      .text("Month");
    ;

    svg.append("g")
      .attr("classed", "axis")
      .attr("transform", "translate(" + margin + ",0)")
      .call(yaxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -(margin + 20))
      .attr("x", -(height / 2 - 20))
      .style("text-anchor", "end")
      .style("fill", "#000")
      .style("font-size", "14px")
      .text("Num of Ratings");
//----------------------------LINES------------------------------//
    var i = -1;
    const lines = svg.selectAll("lines")
      .data(slices)
      .enter()
      .append("g")
      .attr("transform", "translate(" + margin + ",0)");

    lines.append("path")
      .style("stroke", function (d) {
        i++;
        return d3.schemeCategory10[i];

      })
      .style("fill", "none")
      .attr("d", function (d) {
        // console.log("values in path",d)
        return line(d.values);
      });

    lines.append("text")
      .attr("class", "serie_label")
      .datum(function (d) {
        return {
          id: d.id,
          value: d.values[d.values.length - 1]
        };
      })
      .attr("transform", function (d) {
        return "translate(" + (xScale(d.value.date) + 10)
          + "," + (yScale(d.value.measurement) + 5) + ")";
      })
      .text(function (d) {
        return d;
      });



    // Chart title
    svg.append("text")
      .attr("x", (width / 2))
      .attr("y",20)
      // .attr("y",10)
      .attr("text-anchor", "middle")
      .attr("id", "title")
      .attr("class", "serie_label")
      .style("font-size", "20px")

      .text("Number of Construction Permits");

  });
});
