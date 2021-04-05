var map = L.map('map').setView([41.8781, -87.6298], 9);
  mapLink =
    '<a href="http://openstreetmap.org">OpenStreetMap</a>';
  L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; ' + mapLink + ' Contributors',
      maxZoom: 18,
    }).addTo(map);

  var zipJson = JSON.parse(zip_data);
  L.geoJson(zipJson).addTo(map);

  /* Initialize the SVG layer */
  map._initPathRoot()
document.addEventListener("DOMContentLoaded", function (event) {
  drawMarkersOnMap("https://data.cityofchicago.org/resource/ydr8-5enu.json?$where=permit_type='PERMIT - NEW CONSTRUCTION' AND application_start_date >= '2021-01-01T00:00:00.000' and application_start_date <= '2021-02-01T00:00:00.000'");
});

function drawMarkersOnMap(url) {
  /* We simply pick up the SVG from the map object */
  var svg = d3.select("#map").select("svg");
  svg.selectAll("#marker").remove();
  var g = svg.append("g");
    // console.log("in the drawpoints");
    d3.json(url, function (data) {
      /* Add a LatLng object to each item in the dataset */

      var updatedLatLang = d3.entries(data).forEach(function (d) {
        // console.log("in the draw function", d)
        if (d.value.latitude && d.value.longitude) {
          // console.log("latitude:", d.value.latitude)
          d.LatLng = new L.LatLng(d.value.latitude,
            d.value.longitude)
        }
      })

      var feature = g.selectAll("circle")
        .data(d3.entries(data))
        .enter().append("circle")
        .style("stroke", "black")
        .style("opacity", .6)
        .style("fill", "red")
        .attr("id","marker")
        .attr("r", 5);

      map.on("viewreset", update);
      update();

      function update() {
        feature.attr("transform",
          function (d) {
            // console.log("in the transform function d", d)
            if (d.value.latitude && d.value.longitude) {
              var temp = new L.LatLng(d.value.latitude,
                d.value.longitude)
              return "translate(" +
                map.latLngToLayerPoint(temp).x + "," +
                map.latLngToLayerPoint(temp).y + ")";
            }
          }
        )
      }
    });
  }
