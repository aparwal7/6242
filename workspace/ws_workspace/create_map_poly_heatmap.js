var map = L.map('map').setView([41.8781, -87.6298], 9);
  mapLink =
    '<a href="http://openstreetmap.org">OpenStreetMap</a>';
  L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; ' + mapLink + ' Contributors',
      maxZoom: 18,
    }).addTo(map);

  var wardsJson = JSON.parse(data_wards);
  L.geoJson(wardsJson).addTo(map);
  
  
  

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
    dict1={}
    
    d3.json(url, function (data) {
      /* Add a LatLng object to each item in the dataset */
      //console.log("data",data);
      //data.forEach(function (d))
      var updatedLatLang = d3.entries(data).forEach(function (d) {
        //console.log("in the draw function", d.value)

        if (d.value.latitude && d.value.longitude) {
          //console.log("latitude:", d.value.latitude)
          d.LatLng = new L.LatLng(d.value.latitude,
            d.value.longitude)

            // creating dict to count sites grouped by wards
            if (dict1[d.value.ward])
            dict1[d.value.ward]=dict1[d.value.ward]+1
            else dict1[d.value.ward]=1
            
        }
      })

      //Adding density to geojson file
      
       d3.json("chicago_2015_wards.geojson",function(d){
        
        d.features.forEach(function(z){
          //console.log(z.properties)
          if ( d3.set(d3.keys(dict1)).has(z.properties.ward)){
            z.properties.density = dict1[z.properties.ward]
            
          }
          else {z.properties.density = 0}
          console.log(z.properties)
        })
        var wardsJson1 = d
        console.log("json",wardsJson1)

        //changing color of polygons
        L.geoJson(wardsJson1, {
          style: function(features){
            var fillColor,
                density = features.properties.density;
            if ( density >= 15 ) fillColor = "#54278f";
            else if ( density >= 10 ) fillColor = "#756bb1";
            else if ( density >= 6 ) fillColor = "#9e9ac8";
            else if ( density >= 3 ) fillColor = "#bcbddc";
            else if ( density > 0 ) fillColor = "#dadaeb";
            else fillColor = "#f2f0f7";  // no data
            return { color: "#999", weight: 1, fillColor: fillColor, fillOpacity: .5 };
          },
          
          
        }  ).addTo(map);
      });

      
      

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

/*
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

    })*/

    
  
   
  }
  



