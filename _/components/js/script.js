$(document).ready(function() {





//Width and height
var w = 400,
	h = 300;

// projection
var projection = d3.geoAlbersUsa()
	.translate([w / 2, h / 2])
	.scale([500]);

//Define default path generator
var path = d3.geoPath()
	.projection(projection);


// Define Zoom Function Event Listener
function zoomFunction() { 
	var transform = d3.zoomTransform(this);
	d3.select("#map_g")
		.attr("transform", "translate(" + transform.x + "," + transform.y + ") scale(" + transform.k + ")");
}

// Define Zoom Behavior
var zoom = d3.zoom()
	.scaleExtent([0.2, 10])
	.on("zoom", zoomFunction);


//Create SVG element
var svg = d3.select("#main")
	.append("svg")
	.attr("width", w)
	.attr("height", h)
	.attr("id", "map_svg")
	.style("border", "2px solid #9ba725")
	.append("g")
	.attr("id", "map_g")
	.call(zoom);

//Load in GeoJSON data
d3.json("json/us-states.json", function(json) {
	
	//Bind data and create one path per GeoJSON feature
	svg.selectAll("path")
	   .data(json.features)
	   .enter()
	   .append("path")
	   .attr("d", path)
	   .attr("class", "map_path")

});








});
