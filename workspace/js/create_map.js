var map = L.map('map').setView([41.8781, -87.6298], 12);
mapLink =
  '<a href="http://openstreetmap.org">OpenStreetMap</a>';
L.tileLayer(
  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 18,
  }).addTo(map);

var layerGroup;
var constructionData;

function createUri() {
  var dates = getCurrentSelectedDate();
  var startDate = dates[0];
  var endDate = dates[1];
  uri = "https://data.cityofchicago.org/resource/ydr8-5enu.json?$where=permit_type='PERMIT - NEW CONSTRUCTION' AND ISSUE_DATE >= '" + startDate + "' and ISSUE_DATE <='" + endDate + "'";
  //console.log("uri:", uri);
  return uri;

}

function addWardsLayerToMap() {
  //console.log("density map checked:", showDensity)
  if (!showDensity) {
    //console.log("density is turned off, returning ")
    return
  }
  drawDensityMap()
}


function removeWardsLayerFromMap() {
  //console.log("removing wards from map")
  try {
    map.removeLayer(layerGroup)
  }catch (err){

  }
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
  //console.log("markers not checked", showConstructionMarkers)
  if (!showConstructionMarkers) {
    return
  }
  /* We simply pick up the SVG from the map object */

  var svg = d3.select("#map").select("svg");
  svg.selectAll("#marker").remove();
   svg.selectAll("#marker-lat-lang").remove();
  var g = svg.append("g");
  // //console.log("in the drawpoints");
  d3.json(url, function (data) {
    /* Add a LatLng object to each item in the dataset */

    var updatedLatLang = d3.entries(data).forEach(function (d) {
      // //console.log("in the draw function", d)
      if (d.value.latitude && d.value.longitude) {
        // //console.log("latitude:", d.value.latitude)
        d.LatLng = new L.LatLng(d.value.latitude,
          d.value.longitude)
      }
    })
    //Adding density to geojson file

    var feature = g.selectAll("#marker")
      .data(d3.entries(data))
      .enter().append("svg:path")
      .attr("class", "marker")
      .attr("d", "M0,0l-8.8-17.7C-12.1-24.3-7.4-32,0-32h0c7.4,0,12.1,7.7,8.8,14.3L0,0z")
      .attr("id", "marker")
      .on('mouseover', function(d) {
            d3.select(this).raise();
        });


    map.on("viewreset", update);
    update();

    function update() {
      feature.attr("transform",
        function (d) {
          // //console.log("in the transform function d", d)
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
  code for Brian
             // ..
            */
  d3.json("monthly_coordinates.json",function(data){

    //data = full data

    //filter data for selected month

    selectedDate=getCurrentSelectedDate()[0];
    //2013-12-01
    // console.log("data for lat and long:",data , selectedDate)
    filteredData = data.data.filter(data_lat_lang => data_lat_lang.month === selectedDate)[0]
    // console.log("filtereddata:",filteredData)
    avgLatitude = filteredData.avg_latitude
    avgLongitude = filteredData.avg_longitude
    // console.log("mean lat lang:",avgLatitude, avgLongitude)
    latLang = new L.LatLng(avgLatitude,
          avgLongitude)
    data_array=[latLang]


    var feature = g.selectAll("#marker-lat-lang")
      .data(data_array)
      .enter().append("svg:path")
      .attr("class", "marker-lat-long")
      .attr("d", "M0,0l-8.8-17.7C-12.1-24.3-7.4-32,0-32h0c7.4,0,12.1,7.7,8.8,14.3L0,0z")
      .attr("id", "marker-lat-lang")
      .on('mouseover', function(d) {
            d3.select(this).raise();
        });


    map.on("viewreset", update);
    update();

    function update() {
      feature.attr("transform",
        function (d) {
            // console.log("in update function for lat lang:",d)
            return "translate(" +
              map.latLngToLayerPoint(d).x + "," +
              map.latLngToLayerPoint(d).y + ")";
        }
      )
    }
  })

  d3.json("monthly_coordinates.json",function(data){

    //data = full data

    //filter data for selected month

    selectedDate=getCurrentSelectedDate()[0];
    //2013-12-01
    // console.log("data for lat and long:",data , selectedDate)
    filteredData = data.data.filter(data_lat_lang => data_lat_lang.month === selectedDate)[0]
    console.log("filtereddata:",filteredData)
    avgLatitude = filteredData.avg_latitude
    avgLongitude = filteredData.avg_longitude
    // console.log("mean lat lang:",avgLatitude, avgLongitude)
    latLang = new L.LatLng(avgLatitude,
          avgLongitude)
    data_array=[latLang]


    var feature = g.selectAll("#marker-lat-lang")
      .data(data_array)
      .enter().append("svg:path")
      .attr("class", "marker-lat-long")
      .attr("d", "M0,0l-8.8-17.7C-12.1-24.3-7.4-32,0-32h0c7.4,0,12.1,7.7,8.8,14.3L0,0z")
      .attr("id", "marker-lat-lang")
      .on('mouseover', function(d) {
            d3.select(this).raise();
        });


    map.on("viewreset", update);
    update();

    function update() {
      feature.attr("transform",
        function (d) {
            // console.log("in update function for lat lang:",d)
            return "translate(" +
              map.latLngToLayerPoint(d).x + "," +
              map.latLngToLayerPoint(d).y + ")";
        }
      )
    }
  })
}

function drawProjection(){
  var svg = d3.select("#map").select("svg");
  var g = svg.append("g");
  console.log("drawing projection for 2022")
  var avgLatitude,avgLongitude,classname;


if(!($('#projection_1').is(":checked") || $('#projection_2').is(":checked"))){
  console.log("both are unchecked, returning")
   svg.selectAll("#marker-lat-lang-p1").remove();
   svg.selectAll("#marker-lat-lang-p2").remove();
  return;

}

  if($('#projection_1').is(":checked")){
    console.log("2022 is checked.")
     avgLatitude = 41.8688904885
     avgLongitude =-87.670050483
     classname="marker-lat-lang-p1"
    drawProjections();
  } else{
    svg.selectAll("#marker-lat-lang-p1").remove();
  }

  if($('#projection_2').is(":checked")){
    console.log("2023 is checked.")
     avgLatitude = 41.8695888881
     avgLongitude =-87.6708447174
    classname ="marker-lat-lang-p2"
    drawProjections();
  }else{
    svg.selectAll("#marker-lat-lang-p2").remove();
  }


  function drawProjections() {
    // console.log("mean lat lang:", avgLatitude, avgLongitude)
    latLang = new L.LatLng(avgLatitude,
      avgLongitude)
    data_array = [latLang]

    var plus = d3.symbol().type(d3.symbolCross).size(256)
    var feature = g.selectAll(classname)
      .data(data_array)
      .enter().append("svg:path")
      .attr("class", classname)
      .attr("d", plus)
      .attr("id", classname)
      .on('mouseover', function (d) {
        d3.select(this).raise();
      });


    map.on("viewreset", update);
    update();

    function update() {
      feature.attr("transform",
        function (d) {
          // console.log("in update function for lat lang:", d)
          return "translate(" +
            map.latLngToLayerPoint(d).x + "," +
            map.latLngToLayerPoint(d).y + ")";
        }
      )
    }
  }


};

$(".projections").on("change",drawProjection)
drawProjection()

function drawDensityMap() {
  //console.log("density map checked:", showDensity)
  if (!showDensity) {
    //console.log("density is turned off, returning ")
    return
  }
  removeWardsLayerFromMap();
  d3.json("chicago_2015_wards.geojson", function (d) {
    //changing color of polygons
    function getColor(feature) {
      //console.log("feature", feature, feature.properties.ward)
      let permits = +getWardInfo(feature.properties.ward)
      // //console.log("color for permits:", permits)
      return permits > 70 ? '#800026' :
        permits > 30 ? '#BD0026' :
          permits > 15 ? '#E31A1C' :
            permits > 8 ? '#FC4E2A' :
              permits > 3 ? '#FD8D3C' :
                '#FEB24C';
    }

    function getWardInfo(selectedWardNumber) {
      let selectedDate = getCurrentSelectedDate()
      // console.log("selected date: ", selectedDate[0] )
      filteredData = constructionData.data.filter(data => data.WARD == selectedWardNumber && data.month == selectedDate[0])

      if (filteredData.length === 0) {
        //console.log("no data found, returning 0, for", selectedDate[0], selectedWardNumber)
        return 0;
      }
      //console.log("filtered data:", filteredData[0].permits);
      return filteredData[0].permits;
    }

    //console.log("drawing density map for d:", d)

    function style(feature) {
      return {
        fillColor: getColor(feature),
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
    //console.log("tooltip d out", d)
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
    '<b> Ward No.' + props.ward + '</b><br />' + getWardInfoForLegend(props.ward) + ' new construction permits'
    : 'Select ward-wise density and Hover over ward');
};

function getColorForLegend(d) {
  return d > 70 ? '#800026' :
    d > 30 ? '#BD0026' :
      d > 15 ? '#E31A1C' :
        d > 8 ? '#FC4E2A' :
          d > 3 ? '#FD8D3C' :
            '#FEB24C';
}

function getWardInfoForLegend(selectedWardNumber) {
  let selectedDate = getCurrentSelectedDate()
  //console.log("selected date: ", selectedDate[0], selectedWardNumber)
  filteredData = constructionData.data.filter(data => data.WARD == selectedWardNumber && data.month == selectedDate[0])

  if (filteredData.length === 0) {
    //console.log("no data found, returning 0, for", selectedDate[0], selectedWardNumber)
    return 0;
  }
  //console.log("filtered data:", filteredData[0].permits);
  return filteredData[0].permits;
}

info.addTo(map);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 3, 8, 15, 30, 70],
    labels = [];

  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getColorForLegend(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};

legend.addTo(map);

var legend2 = L.control({position: 'bottomright'});

legend2.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 3, 8, 15, 30, 70],
    labels = [];

  // loop through our density intervals and generate a label with a colored square for each interval


  div.innerHTML +=
      '<img src="https://dva-wasp.s3.amazonaws.com/workspace/img/Legend-blue-marker.png"> <span>Co-ordinates of construction permits</span><br/>'
  div.innerHTML +=
      '<img src="https://dva-wasp.s3.amazonaws.com/workspace/img/Legend-red-marker.png"> <span>Center of all construction permits for the month</span><br/>'
  div.innerHTML +=
      '<img src="https://dva-wasp.s3.amazonaws.com/workspace/img/Legend-2022.png"> <span>Projected Center for 2022</span><br/>'
  div.innerHTML +=
      '<img src="https://dva-wasp.s3.amazonaws.com/workspace/img/Legend-2023.png"> <span>Projected Center for 2023</span><br/>'


  return div;
};

legend2.addTo(map);


$.getJSON('new_permits_by_ward_yyyy_mm_dd.json', function (data) {
  //console.log("ward data", data)
  constructionData = data;
});




