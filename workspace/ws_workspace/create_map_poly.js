var map = L.map('map').setView([41.8781, -87.6298], 9);
  mapLink =
    '<a href="http://openstreetmap.org">OpenStreetMap</a>';
  L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; ' + mapLink + ' Contributors',
      maxZoom: 18,
    }).addTo(map);

  var data = JSON.parse(data);

  L.geoJson(data).addTo(map);

  /* Initialize the SVG layer */
  map._initPathRoot()
document.addEventListener("DOMContentLoaded", function (event) {
  drawMarkersOnMap("https://data.cityofchicago.org/resource/ydr8-5enu.json?$where=permit_type='PERMIT - NEW CONSTRUCTION' AND application_start_date >= '2021-01-01T00:00:00.000' and application_start_date <= '2021-02-01T00:00:00.000'");
});

function drawMarkersOnMap(url) {
  /* We simply pick up the SVG from the map object */
  var svg = d3.select("#map").select("svg");
  svg.selectAll("g").remove();
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


    //Load in GeoJSON data
    var GeoJSONdata
    d3.json("zipcodes1.geojson",function(d){
      //Width and height
      var width = 1050;
      var height = 630;

      // create a first guess for the projection
      var center = d3.geoCentroid(d)
      var scale = 150;
      var projection = d3.geoMercator().scale(scale).center(center);
      //Define path generator
      var path = d3.geoPath().projection(projection);

      //var projection = d3.geoMercator().fitSize([width, height], d);
      //var path = d3.geoPath().projection(projection);
      GeoJSONdata = d;
      //console.log("Geo",center)
      // using the path determine the bounds of the current map and use
      // these to determine better values for the scale and translation
      var bounds = path.bounds(d);
      console.log("bounds",bounds);
      var hscale = scale * width / (bounds[1][0] - bounds[0][0]);
      var vscale = scale * height / (bounds[1][1] - bounds[0][1]);
      var scale = (hscale < vscale) ? hscale : vscale;
      var offset = [width - (bounds[0][0] + bounds[1][0]) / 2,
                      height - (bounds[0][1] + bounds[1][1]) / 2];

      // new projection
      // new projection
      projection = d3.geoMercator().center(center).scale(scale * 0.35).translate(offset);
      path = path.projection(projection);

      //path = d3.geoPath().projection(projection);
      d3.select("#map").select("svg").select("g")
      .select(".chart")
               .attr("width", width)
               .attr("height", height);
      //Bind data and create one path per GeoJSON feature
      console.log("features",d.features)
      g.selectAll("path")
      .data(d.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", "zipcode");

    })


  }




