$(document).ready(function() {

	var margin = { top: 0, left: 0, right: 0, bottom: 0},
		w, 
		heightCalc, 
		h; 

    function sizeChange() {
    	w = $("#main").width() - margin.left - margin.right,
		heightCalc = [w * 0.8, $(window).height() * 0.75],
		h = d3.min(heightCalc)
		d3.select("#map_svg")
			.attr("width", w)
			.attr("height", h)
		console.log(h)
    }

    sizeChange();

	d3.select(window)
    		.on("resize", sizeChange);

	// Define Zoom Behavior
	var zoom = d3.zoom()
		.scaleExtent([.5, 50])
		.on("zoom", zoomFunction)

	// Define Zoom Function Event Listener
	function zoomFunction() {
		var transform = d3.event.transform;
		d3.select("#map_g")
		.attr("transform", "translate(" + transform.x + "," + transform.y + ") scale(" + transform.k + ")")
	}

	// Projection
	var projection = d3.geoAlbersUsa()
		.translate([ w / 2, h / 2 ])
		.scale([w])

	//Create SVG element
	var svg = d3.select("#main")
		.append("svg")
		.attr("width", w)
		.attr("height", h)
		.attr("id", "map_svg")
		.style("border", "5px solid #9ba725")
		.call(zoom)
		.append("g")
		.attr("id", "map_g")

	d3.queue()
		.defer(d3.json, "/cs/cch-mda/docs/us.topojson")
		.defer(d3.csv, "/cs/cch-mda/docs/licensure.csv")
		.await(ready)

	//Define default path generator
	var path = d3.geoPath()
		.projection(projection)

	var toggleRow = function(header, stateName, licensure) {
		var kebabCaseStateName = stateName.split(' ').join('-') // North Dakota becomes North-Dakota for proper CSS selector names
		var stateRowId = kebabCaseStateName + "-row"
		var stateRow = document.getElementById(stateRowId)
		console.log(kebabCaseStateName)
		console.log(stateRowId)
		console.log(stateRow)

		if (stateRow) { // does this row exist?
			d3.select('#' + stateRowId).remove() // remove it
			return // and cease this function
		} // otherwise continue
		var headerList = d3.keys(header)
		var stateData = findLicensureData(stateName, licensure)
		var row = d3.select("tbody")
									.insert("tr",":first-child")
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
//			.style("border", "2px solid #9ba725")
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

		function name_the_abbr(d){
				var abbr = d.properties.abbr.abbreviation
				console.log(abbr)
				return abbr
				
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
					}
				else {
						d3.select(this).classed("state--selected", true);
					}
			})
//			.append("svg:text") 
//			.text(name_the_state) 
//			.attr("x", function(d){return path.centroid(d)[0];})
//			.attr("y", function(d){return path.centroid(d)[1];})
//			.attr("dy", ".35em")
			svg.selectAll(".stateText")
		        .data(states)
		        .enter().append("text")
		        .attr("x", function(d) {
		            return path.centroid(d)[0];
		        })
		        .attr("y", function(d) {
		            return path.centroid(d)[1];
		        })
		        .attr("text-anchor", "middle")
		        .attr("font-size", "12px")
		        .text(name_the_abbr)
		}



});
