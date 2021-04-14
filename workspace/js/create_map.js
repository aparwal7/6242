var map = L.map('map').setView([41.8781, -87.6298], 9);
  mapLink =
    '<a href="http://openstreetmap.org">OpenStreetMap</a>';
  L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; ' + mapLink + ' Contributors',
      maxZoom: 18,
    }).addTo(map);

  var layerGroup;

  function createUri(startDate="2021-01-01T00:00:00.000",endDate="2021-02-01T00:00:00.000"){
    return "https://data.cityofchicago.org/resource/ydr8-5enu.json?$where=permit_type='PERMIT - NEW CONSTRUCTION' AND ISSUE_DATE >= '"+startDate+"' and ISSUE_DATE <='"+ endDate+"'";
  }

function addWardsLayerToMap() {
  console.log("adding wards to map")
  var wardsJson = JSON.parse(data_wards);
  var wardLayer = L.geoJson(wardsJson);

  layerGroup = new L.LayerGroup();
  layerGroup.addTo(map)
  layerGroup.addLayer(wardLayer)
  drawDensityMap()
}

addWardsLayerToMap();

function removeWardsLayerFromMap() {
  console.log("removing wards from map")
  map.removeLayer(layerGroup)
}


/* Initialize the SVG layer */
map._initPathRoot()
document.addEventListener("DOMContentLoaded", function (event) {
  drawMarkersOnMap(createUri());
  drawDensityMap()
});

function removeMarkersFromMap(){
  var svg = d3.select("#map").select("svg");
  svg.selectAll("#marker").remove();
}

function addMarkersOnMap(){
    drawMarkersOnMap(createUri());
}

function removeHeatMap(){
  var svg = d3.select("#map").select("svg");
  svg.selectAll("#marker").remove();
}


function drawMarkersOnMap(url) {
  if (!($("#marker").is(":checked"))){

    console.log("markers not checked",$("#marker").is(":checked"))
    return
  }
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
                      // creating dict to count sites grouped by wards
            if (dict1[d.value.ward])
            dict1[d.value.ward]=dict1[d.value.ward]+1
            else dict1[d.value.ward]=1
        }
      })
      //Adding density to geojson file

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

  function drawDensityMap(){
  dict1={}
   d3.json("chicago_2015_wards.geojson",function(d){
        var wardsJson1 = d
        console.log("json",wardsJson1)

        //changing color of polygons
        var densityLayer=L.geoJson(wardsJson1, {
          style: function(features){
            var fillColor,
                density = features.properties.density;
            if ( density >= 15 ) fillColor = "#54278f";
            else if ( density >= 10 ) fillColor = "#756bb1";
            else if ( density >= 6 ) fillColor = "#9e9ac8";
            else if ( density >= 3 ) fillColor = "#bcbddc";
            else if ( density > 0 ) fillColor = "#dadaeb";
            else fillColor = "#f2f0f7";  // no data
            return { color: "#999", weight: 1, fillColor: fillColor, fillOpacity: 0.6 };
          },


        });
        layerGroup.addLayer(densityLayer)
        //cont.data(function())
        //console.log("d",d)

        console.log("tooltip d out",d)
        //create tooltip


        var tooltip = d3.tip()
        .attr('class', 'd3-tip')
        .attr("id", "mytooltip")
        //.offset([-10, 0])
                    .html(function(c){
                            //datarow = d.get(d.features.properties)
                            //console.log("dtip",datarow)
                            /*

                            if(counrty_game.length !=0 ){
                                var color_rating = counrty_game[0]["Average Rating"];
                                var num_users = counrty_game[0]["Number of Users"];
                                var display = "<strong>Country: </strong>"+ c.properties.name +"<br><strong>Game: </strong>"+ selectedGame +"<br><strong>Avg Rating: </strong>"+ color_rating +"<br><strong>Number of Users: </strong>"+ num_users

                            return display;
                            }*/
                            console.log(c);
                            return "<strong>Wards: </strong>"+ c.properties.ward +"<br><strong>density: </strong>"+ c.properties.density


                        });


              d3.select("#map").selectAll(".leaflet-overlay-pane").select("svg").call(tooltip);
              console.log("d.features",d.features)
              d3.select("#map").selectAll(".leaflet-overlay-pane").select("svg")
              .selectAll("g")
              .selectAll(".paths")
              .data(d.features)
              .enter()
              .select("path")

              //.append("path")
              //.attr("class","continent")
              //.attr("stroke","white")
              //.on("mouseover", tooltip.show)
              .on("mouseover", tooltip.show)

              //.on("mouseout",tooltip.hide)
              .on("mouseout", tooltip.hide)





      });
  }
