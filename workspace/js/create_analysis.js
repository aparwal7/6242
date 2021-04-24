  $(document).ready(function () {
    console.log("drawing analysis")
    var parseDate = d3.timeParse("%m/%d/%Y");

    var margin = {left: 50, right: 20, top: 20, bottom: 50};

    var width = 600 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;


    var max = 0;

    var xNudge = 50;
    var yNudge = 20;

    var minDate = new Date();
    var maxDate = new Date();
    var bisectDate = d3.bisector(function (d) {
        return d.date;
      }).left,
      // parseTime = d3.timeParse("%d-%b-%y");
      formatValue = d3.format(".1f"),
      dateFormatter = d3.timeFormat("%m/%d/%y");


    d3.csv("future_permits_grouped.csv")
      .row(function (d) {
        return {date: parseDate(d.date), actual: Number(d.actual), fitted: Number(d.fitted)};
      })
      .get(function (error, rows) {
        max = 400;
        minDate = d3.min(rows, function (d) {
          return d.date;
        });
        maxDate = d3.max(rows, function (d) {
          return d.date;
        });
        actual_rows = rows.slice(0, 183);
        console.log("actual rows:", actual_rows);
        var legendRectSize = 18;                                  // NEW
        var legendSpacing = 4;

        var y = d3.scaleLinear()
          .domain([0, max])
          .range([height, 0]);

        var x = d3.scaleTime()
          .domain([minDate, maxDate])
          .range([0, width]);

        var yAxis = d3.axisLeft(y);

        var xAxis = d3.axisBottom(x);

        var line = d3.line()
          .x(function (d) {
            return x(d.date);
          })
          .y(function (d) {
            return y(d.actual);
          })
          .curve(d3.curveCardinal);

        var line2 = d3.line()
          .x(function (d) {
            return x(d.date);
          })
          .y(function (d) {
            return y(d.fitted);
          })
          .curve(d3.curveCardinal);


        var svg = d3.select("#construction-permits-analysis")
          .append("svg")
          .attr("id", "svg")
          .attr("height", "100%")
          .attr("width", "100%");

        var chartGroup = svg
          .append("g")
          .attr("class", "chartGroup")
          .attr("transform", "translate(" + xNudge + "," + yNudge + ")");

        chartGroup.append("path")
          .attr("class", "line-analytics")
          .attr("d", function (d) {
            return line(actual_rows);
          })

        chartGroup.append("path")
          .attr("class", "line-analytics-predicted")
          .attr("d", function (d) {
            return line2(rows);
          })

        var focus = svg.append("g")
          .attr("class", "focus")
          .style("display", "none");
        // .attr("transform", "translate(" + xNudge + "," + yNudge + ")");

        focus.append("circle")
          .attr("r", 3)
          .attr("cx", xNudge)
          .attr("cy", yNudge)
          .attr("class", "tool-tip-cir");

        focus.append("rect")
          .attr("class", "tooltip-box")
          .attr("width", 100)
          .attr("height", 65)
          .attr("x", 10 + xNudge)
          .attr("y", -22)
          .attr("rx", 4)
          .attr("ry", 4);

        focus.append("text")
          .attr("class", "tooltip-date")
          .attr("x", 18 + xNudge)
          .attr("y", -2);

        focus.append("text")
          .attr("class", "tooltip-date")
          .attr("x", 18 + xNudge)
          .attr("y", 18)
          .text("Actual:");

        focus.append("text")
          .attr("class", "tooltip-likes")
          .attr("x", 60 + xNudge)
          .attr("y", 18);

        focus.append("text")
          .attr("class", "tooltip-date")
          .attr("x", 18 + xNudge)
          .attr("y", 38)
          .text("Fitted:");

        focus.append("text")
          .attr("class", "tooltip-fitted")
          .attr("x", 60 + xNudge)
          .attr("y", 38);

        svg.append("rect")
          .attr("class", "overlay")
          .attr("width", width)
          .attr("height", height)
          .on("mouseover", function () {
            focus.style("display", null);
          })
          .on("mouseout", function () {
            focus.style("display", "none");
          })
          .on("mousemove", mousemove);

        function mousemove() {
          var x0 = x.invert(d3.mouse(this)[0] - xNudge),
            i = bisectDate(rows, x0, 1),
            d0 = actual_rows[i - 1],
            d1 = actual_rows[i]
          d = x0 - d0.date > d1.date - x0 ? d1 : d0;

          d00 = rows[i - 1],
            d01 = rows[i],
            d2 = x0 - d00.date > d01.date - x0 ? d01 : d00;
          console.log("d2:", d2)
          focus.attr("transform", "translate(" + (x(d2.date)) + "," + ((y(d2.fitted))) + ")");
          focus.select(".tooltip-date").text(dateFormatter(d.date));
          focus.select(".tooltip-likes").text(d.actual);
          focus.select(".tooltip-fitted").text(formatValue(d2.fitted));


        }

        chartGroup.append("g")
          .attr("class", "axis x")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .append("text")
          // .attr("transform", "rotate(-90)")
          .attr("y", margin.top * 2)
          .attr("x", width / 2)
          .style("text-anchor", "end")
          .style("fill", "dimgrey")
          .style("font-size", "14px")
          .text("Date");

        chartGroup.append("g")
          .attr("class", "axis y")
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(90)")
          .attr("y", margin.top * 2.5)
          .attr("x", width / 2)
          .style("text-anchor", "end")
          .style("fill", "dimgrey")
          .style("font-size", "14px")
          .text("# of Permits");

        svg.append("circle")
          .attr("r", 15)
          .attr("cx", width)
          .attr("cy", (height + margin.top * 3))
          .style("fill", "lightcoral");
        svg.append("circle")
          .attr("r", 15)
          .attr("cx", (width))
          .attr("cy", (height + margin.top * 5))
          .style("fill", "cadetblue");
        svg.append("text")
          .attr("x", width)
          .attr("y", height + margin.top * 3)
          .attr("text-anchor", "middle")
          .attr("id", "title")
          .attr("class", "serie_label")
          .style("font-size", "10px")
          .style("fill", "black")
          .text("Actual");
        svg.append("text")
          .attr("x", width)
          .attr("y", height + margin.top * 5)
          .attr("text-anchor", "middle")
          .attr("id", "title")
          .attr("class", "serie_label")
          .style("font-size", "10px")
          .style("fill", "black")
          .text("Predicted");
        svg.append("text")
          .attr("x", width)
          .attr("y", height + margin.top * 6.5)
          .attr("text-anchor", "middle")
          .attr("id", "title")
          .attr("class", "serie_label")
          .style("font-size", "12px")
          .text("Legend");
        svg.append("text")
          .attr("x", width - margin.top*2)
          .attr("y", height + margin.top * 7)
          .attr("text-anchor", "middle")
          .attr("id", "title")
          .attr("class", "serie_label")
          .style("font-size", "8px")
          .text("* Predictions calculated by using Auto ARIMA model");
        svg.append("text")
          .attr("x", (width / 2))
          .attr("y", 20)
          .attr("text-anchor", "middle")
          .attr("id", "title")
          .attr("class", "serie_label")
          .style("font-size", "20px")
          .text("Number of Constructions per month");
      });
  });
