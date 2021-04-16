var map = L.map('map').setView([41.8781, -87.6298], 9);
mapLink =
  '<a href="http://openstreetmap.org">OpenStreetMap</a>';
L.tileLayer(
  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 18,
  }).addTo(map);

var layerGroup;
var constructionData;
var dict1={}
function createUri() {
  var dates = getCurrentSelectedDate();
  var startDate = dates[0];
  var endDate = dates[1];
  uri = "https://data.cityofchicago.org/resource/ydr8-5enu.json?$where=permit_type='PERMIT - NEW CONSTRUCTION' AND ISSUE_DATE >= '" + startDate + "' and ISSUE_DATE <='" + endDate + "'";
  console.log("uri:", uri);
  return uri;

}

function addWardsLayerToMap() {
  console.log("density map checked:", showDensity)
  if (!showDensity) {
    console.log("density is turned off, returning ")
    return
  }
  drawDensityMap()
}


function removeWardsLayerFromMap() {
  console.log("removing wards from map")
  map.removeLayer(layerGroup)
}


/* Initialize the SVG layer */
map._initPathRoot()

function removeMarkersFromMap() {
  var svg = d3.select("#map").select("svg");
  svg.selectAll("#marker").remove();

}

function addMarkersOnMap() {
  drawMarkersOnMap(createUri());
}

function removeHeatMap() {
  var svg = d3.select("#map").select("svg");
  svg.selectAll("#marker").remove();
}


function drawMarkersOnMap(url) {
  console.log("markers not checked", showConstructionMarkers)
  if (!showConstructionMarkers) {
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
      }
      console.log("adding d to dict",d.value.ward)
       if (dict1[d.value.ward])
            dict1[d.value.ward]=dict1[d.value.ward]+1
            else dict1[d.value.ward]=1
    })
    //Adding density to geojson file

    var feature = g.selectAll("circle")
      .data(d3.entries(data))
      .enter().append("circle")
      .style("stroke", "black")
      .style("opacity", .6)
      .style("fill", "red")
      .attr("id", "marker")
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

function drawDensityMap() {
  d3.json("chicago_2015_wards.geojson", function (d) {
    //changing color of polygons
    function style(feature) {
      console.log("density:",dict1[feature.properties.ward])
      console.log("current ward:",feature)
      console.log("dict",dict1)
      return {
        fillColor: getColor(dict1[feature.properties.ward]),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
      };
    }

    function highlightFeature(e) {
      var layer = e.target;

      layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
      });

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }
      info.update(layer.feature.properties);
    }

    function resetHighlight(e) {
      densityLayer.resetStyle(e.target);
      info.update();
    }

    function zoomToFeature(e) {
      map.fitBounds(e.target.getBounds());
    }

    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
      });
    }

    var densityLayer = L.geoJson(d, {style: style, onEachFeature: onEachFeature});
    layerGroup = new L.LayerGroup();
    layerGroup.addTo(map)
    layerGroup.addLayer(densityLayer)
    console.log("tooltip d out", d)
    //create tooltip
  });
}

var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
  this.update();
  return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
  this._div.innerHTML = '<h6>Chicago Construction Density</h6>' + (props ?
    '<b> Ward No.' + props.ward + '</b><br />' + dict1[props.ward] + ' new construction permits'
    : 'Hover over a state');
};

info.addTo(map);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 5, 10, 20, 50,100],
    labels = [];

  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};

legend.addTo(map);


function getColor(d) {
  return d > 100 ? '#800026' :
    d > 50 ? '#BD0026' :
      d > 20 ? '#E31A1C' :
        d > 10 ? '#FC4E2A' :
          d > 5 ? '#FD8D3C' :
          '#FEB24C';
}

$.getJSON('new_permits_by_ward_month.json', function (data) {
  console.log("ward data", data)
  constructionData = data;
});

function getWardInfo(){
  let selectedDate = getCurrentSelectedDate()
  console.log("selected date: ",selectedDate[0])
  filteredData=constructionData.data.filter(data=>data.WARD == 1 && data.month == selectedDate[0])
  console.log("filtered data:",filteredData);
  return filteredData;

}


