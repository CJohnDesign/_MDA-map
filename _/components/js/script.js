

$(document).ready(function() {


	var margin = { top: 50, left: 50, right: 50, bottom: 50},
		h = 300 - margin.top - margin.bottom,
		w = 400 - margin.left - margin.right;

	// Define Zoom Function Event Listener
	function zoomFunction() { 

	var transform = d3.zoomTransform(this);
	d3.select("#map_g")
		.attr("transform", "translate(" + transform.x + "," + transform.y + ") scale(" + transform.k + ")")
	}

	// Define Zoom Behavior
	var zoom = d3.zoom()
		.scaleExtent([1, 8])
		.on("zoom", zoomFunction)
	
	//Create SVG element
	var svg = d3.select("#main")
		.append("svg")
		.attr("width", w + margin.left + margin.right)
		.attr("height", h + margin.top + margin.bottom)
		.attr("id", "map_svg")
		.style("border", "2px solid #9ba725")
		.append("g")
		.attr("id", "map_g")
		.call(zoom)

	d3.queue()
		.defer(d3.json, "/json/us.topojson")
		.defer(d3.csv, "/csv/licensure.csv")
		.await(ready)

	// Projection
	var projection = d3.geoAlbersUsa()
		.translate([ w / 2, h / 2 ])
		.scale([500])

	//Define default path generator
	var path = d3.geoPath()
		.projection(projection)


	function ready (error, data, licensure) {

	

		var state_i = 0

		var states = topojson.feature(data, data.objects.states).features

//		var state_ids = topojson.feature(data, data.objects.states.object[1]).features

		function name_the_fuck(d){ 
				var name = d.properties.name
				return name
					}


//		console.log(states)

		svg.selectAll(".state")
			.data(states)
			.enter()
			.append("path")
			.attr("class", "state")
			.attr("id", name_the_fuck)
			.attr("d", path)
			.on("mouseover", function(d) {
				d3.select(this).classed("state--hover", true)

			})	
			.on("mouseout", function(d) {
				d3.select(this).classed("state--hover", false)
			})	
			.on("click", function(d) {
			
				if 	(d3.select(this).classed("state--selected")) 
					{
						d3.select(this).classed("state--selected", false),
						state_i--, 
						console.log(state_i)
					}
				else {
						d3.select(this).classed("state--selected", true), 
						state_i++, 
						console.log(state_i)
					}
				if (state_i <= 1)
					{
						
					}
				else {console.log("fail")}

			})



		var info = d3.select("#info")
			.append("table")
			.attr("id", "info_table")
			.style("border", "2px solid #9ba725")
			var thead = info.append("thead")
			var tbody = info.append("tbody")
			thead.append("tr")
				.selectAll("th")
				.data(d3.keys(licensure[0]))
				.enter()
				.append("th")
				.text(function(d) {return d})




//		var info = d3.select("#info")
//			.append("table")
//			.attr("width", w + margin.left + margin.right)
//			.attr("id", "info_table")
//			.style("border", "2px solid #9ba725")
//			.append("tr")
//			.append("th")
//			.text("Application Type")
//			.append("th")
//			.text("State Control")
			

	}
























// End J Soma








////Load in GeoJSON data
//d3.json("json/us-states.json", function(json) {
//	
//	//Bind data and create one path per GeoJSON feature
//	svg.selectAll("path")
//	   .data(json.features)
//	   .enter()
//	   .append("path")
//	   .attr("d", path)
//	   .attr("class", "map_path")
//
//});








});
