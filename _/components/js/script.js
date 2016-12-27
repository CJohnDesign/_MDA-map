

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
	var toggleRow = function(header, stateName, licensure) {
		var kebabCaseStateName = stateName.replace(" ", "-") // North Dakota becomes North-Dakota for proper CSS selector names
		var stateRowId = kebabCaseStateName + "-row"
		var stateRow = document.getElementById(stateRowId)

		if (stateRow) { // does this row exist?
			d3.select('#' + stateRowId).remove() // remove it
			return // and cease this function
		} // otherwise continue
		var headerList = d3.keys(header)
		var stateData = findLicensureData(stateName, licensure)
		var row = d3.select("tbody")
									.append("tr")
									.attr("id", kebabCaseStateName + "-row")
									.attr("class", "state-row") // may help with styling all rows
		for (var i in headerList) {
			var dataKey = headerList[i] // column name
			var data = stateData[dataKey]
			row.append("td")
					.attr("class", dataKey + "-cell") // this may help with styling cells eg .State-cell
					.text(data)
		}
	}

	var findLicensureData = function(state, licensureData) {
		for (var i in licensureData) {
			var dState = licensureData[i]['State']
			if (state === dState) {
				return licensureData[i]
			}
		}
		return null // The state does not exist in the licensure data!
	}

	var drawHeader = function(header) {
		var info = d3.select("#info")
			.append("table")
			.attr("id", "info_table")
			.style("border", "2px solid #9ba725")
			var thead = info.append("thead")
			var tbody = info.append("tbody").attr("id", "tbody")
			thead.append("tr")
				.selectAll("th")
				.data(d3.keys(header))
				.enter()
				.append("th")
				.text(function(d) {return d})
	}

	function ready (error, data, licensure) {
		var state_i = 0
		var states = topojson.feature(data, data.objects.states).features
		var header = licensure[0]
		drawHeader(header)

		function name_the_state(d){
				var name = d.properties.name
				return name
					}

		function name_the_lic(d){
				var lic = d.id
				return lic
					}


//		console.log(states)

		svg.selectAll(".state")
			.data(states)
			.enter()
			.append("path")
			.attr("class", "state")
			.attr("id", name_the_state)
			.attr("d", path)
			.on("mouseover", function(d) {
				d3.select(this).classed("state--hover", true)
			})
			.on("mouseout", function(d) {
				d3.select(this).classed("state--hover", false)
			})
			.on("click", function(d) {
				var stateName = name_the_state(d)
				toggleRow(header, stateName, licensure)
				if 	(d3.select(this).classed("state--selected"))
					{
						d3.select(this).classed("state--selected", false);
						// state_i--,
						// console.log(state_i)
					}
				else {
						d3.select(this).classed("state--selected", true);
						// state_i++,
						// console.log(state_i)
					}
				// if (state_i <= 10) {
				// 		for (var i = 0; i < licensure.length; i++) {
				// 			var this_elem = d3.select(this).attr('id')
				// 			var dataState = licensure[i].State;
				// 			if (this_elem == dataState) {
				// 				d3.select("#tbody")
				// 				.append("tr")
				// 				// console.log(licensure[i].length)
				// 				.append("td")
				// 				.text(licensure[i].id)
				// 				.parent.append("td")
				// 				.text(licensure[i].state)
				// 				.append("td")
				// 				.text(licensure[i]["Application Type"])
				// 			} else {
				// 				// console.log(dataState)
				// 				// console.log("fuck")
				// 			}
				// 		}
				// 	}
				// else {console.log("fail")}

			})
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
