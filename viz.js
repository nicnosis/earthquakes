var baseUrl = 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmFndWlycmUiLCJhIjoiY2l6bmJrMmgwMDJjYTMxcGN3ZHViNnd2YyJ9.RwENG4rnNh44w6ktZEYFRQ';
// var baseUrl = 'https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmFndWlycmUiLCJhIjoiY2l6bmJrMmgwMDJjYTMxcGN3ZHViNnd2YyJ9.RwENG4rnNh44w6ktZEYFRQ';
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

var rScale = d3.scale.sqrt().range([4, 20]);

d3.json("eq.json", function(collection) {
    /* Add a LatLng object to each item in the dataset */
    collection.forEach(function(d) {
        d.LatLng = new L.LatLng(d.latitude, d.longitude);
        d.mag = +d.mag; // force numeric
        d.mag = Math.sqrt(Math.pow(d.mag, 10)); // adjust for log scale
    });
    collection.sort(function(a, b) {return b.mag - a.mag;}); // highest magnitude first to prevent occlusion

    rScale.domain(d3.extent(collection, d => d.mag));

    var feature = g.selectAll("circle")
        .data(collection)
        .enter().append("circle")
        // .attr("class", "dot")
        .attr("opacity", 0.5)
        .attr("fill", "#de2d26")
        .attr("stroke", "rgba(255,255,255,.5)")
        .attr("r", d => rScale(d.mag))
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);

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
});

function mouseover(d) {
    d3.select(this)
        .transition().duration(100)
        .attr("fill", "#3182bd")
        .attr("opacity", 1)
        .attr("stroke", "#000");
    // populate info
    d3.select("#place").text(d.place);
    d3.select("#time").text(d.time);
    var magnitude = (d.mag > 1) ? d.mag.toFixed(0) : d.mag.toFixed(2);
    d3.select("#mag span").text(magnitude);
}
function mouseout(d) {
    d3.select(this)
        .transition().duration(100)
        .attr("fill", "#de2d26")
        .attr("opacity", 0.5)
        .attr("stroke", "rgba(255,255,255,.5)");
}