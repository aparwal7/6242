document.addEventListener("DOMContentLoaded", function(event) {
  var map = L.map('map').setView([41.8781, -87.6298], 13);
        mapLink =
            '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors',
            maxZoom: 18,
            }).addTo(map);

	/* Initialize the SVG layer */
	map._initPathRoot()

	/* We simply pick up the SVG from the map object */
	var svg = d3.select("#map").select("svg"),
	g = svg.append("g");

	d3.json("stations_chicago.json", function(data) {
		/* Add a LatLng object to each item in the dataset */
		var updatedLatLang=d3.entries(data).forEach(function(d) {
		  // console.log(d)
			d.LatLng = new L.LatLng(d.value[0],
									d.value[1])
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
			function(d) {
			  // console.log("in the function d",d)
        var temp=new L.LatLng(d.value[0],
									d.value[1])
				return "translate("+
					map.latLngToLayerPoint(temp).x +","+
					map.latLngToLayerPoint(temp).y +")";
				}
			)
		}
	})
});
