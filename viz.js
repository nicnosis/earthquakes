var baseUrl = 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmFndWlycmUiLCJhIjoiY2l6bmJrMmgwMDJjYTMxcGN3ZHViNnd2YyJ9.RwENG4rnNh44w6ktZEYFRQ';
var map = L.map('map').setView([-0, 0], 2);
var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
L.tileLayer(
    baseUrl, {
        attribution: '&copy; ' + mapLink + ' Contributors',
        maxZoom: 18,
    }).addTo(map);

/* Initialize the SVG layer */
map._initPathRoot()

/* We simply pick up the SVG from the map object */
var svg = d3.select("#map").select("svg");
var g = svg.append("g");

//	var rScale = d3.scale.sqrt().range([1, 10]);
var rScale = d3.scale.sqrt().range([2, 20]);

d3.json("eq.json", function(collection) {
    /* Add a LatLng object to each item in the dataset */
    collection.forEach(function(d) {
        d.LatLng = new L.LatLng(d.latitude, d.longitude);
        d.mag = +d.mag;
        d.mag = Math.sqrt(Math.pow(d.mag, 10));
        console.log(d.mag);
    });

//        rScale.domain(d3.extent(collection, function(d) { return d.mag; }));
    rScale.domain(d3.extent(collection, d => d.mag));

    var feature = g.selectAll("circle")
            .data(collection)
            .enter().append("circle")
            .style("stroke", "rgba(255,255,255,.5)")
            .style("opacity", .4)
            .style("fill", "crimson")
            .attr("r", d => rScale(d.mag));

    map.on("viewreset", update);
    update();

    function update() {
        feature.attr("transform",
            function(d) {
                return "translate("+
                    map.latLngToLayerPoint(d.LatLng).x +","+
                    map.latLngToLayerPoint(d.LatLng).y +")";
            }
        )
    }
})