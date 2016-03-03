// Map
var map = null;
var center = {lat: 40.036577, lng: -75.342661};
var regionArray = []; 
var markers = [];
var selectedMarker = null;
var selectedMarkers = [];
var sensorArray = [];

// Info window
var infowindow = null;
var sensorJSONRaw = {};
var dummyCoords = [{x: 40.036602, y: -75.345526},
	{x: 40.036266, y: -75.340768},
	{x: 40.036568, y: -75.342916},
	{x: 40.036210, y: -75.338388},
	{x: 40.035802, y: -75.342565}];
var Sensors = [];
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;

// Dygraph options
var gWidthRatioWhenMaximized = 0.7;
var gWidthRatioWhenMinimized = 1;
var gHeightRatioWhenMaximized = 0.3;
var gHeightRatioWhenMinimized = 0.9;
var dygraphParams = {
    //"animatedZooms": true,
	"connectSeparatedPoints": true,
	"rollPeriod": 54,
	"strokeWidth": 1.2,
	"showLabelsOnHighlight": true,
	"highlightCircleSize": 2,
	"highlightSeriesOpts": {
		"strokeWidth": 1.4,
		"highlightCircleSize": 5
	},
	"labelsDivStyles": {
		'text-align': 'right',
		'background': 'none'
	},
	"labels": "",
	"drawPoints": true,
	"title": "",
	"showRoller": false,
	"showRangeSelector": true
}

var pages = 0;
var totalCount = 0;

/*Quadrants*/
var localFetchMode = true;

//var quad-1_probe-1 = {name: "quad-1_probe-1", probe: "Probe 1", labels: ["Date", "Cubic Meters"], data: ""};
//var quad-1_probe-2 = {name: "quad-1_probe-2", probe: "Probe 2", labels: ["Date", "Cubic Meters"], data: ""};
//var quad-1_temperature-1 = {name: "quad-1_temperature-1", labels: ["Date", "Temperature C"], data: ""};
//
//var quad-2_probe-1 = {name: "quad-2_probe-1", probe: "Probe 1", labels: ["Date", "Cubic Meters"], data: ""};
//var quad-2_probe-2 = {name: "quad-2_probe-2", probe: "Probe 2", labels: ["Date", "Cubic Meters"], data: ""};
//var quad-2_temperature-1 = {name: "quad-2_temperature-1", labels: ["Date", "Temperature C"], data: ""};
//
//var quad-3_probe-1 = {name: "quad-3_probe-1", probe: "Probe 1", labels: ["Date", "Cubic Meters"], data: ""};
//var quad-3_probe-2 = {name: "quad-3_probe-2", probe: "Probe 2", labels: ["Date", "Cubic Meters"], data: ""};
//var quad-3_temperature-1 = {name: "quad-3_temperature-1", labels: ["Date", "Temperature C"], data: ""};
//
//var quad-4_probe-1 = {name: "quad-4_probe-1", probe: "Probe 1", labels: ["Date", "Cubic Meters"], data: ""};
//var quad-4_probe-2 = {name: "quad-4_probe-2", probe: "Probe 2", labels: ["Date", "Cubic Meters"], data: ""};
//var quad-4_temperature-1 = {name: "quad-4_temperature-1", labels: ["Date", "Temperature C"], data: ""};

var streams = [
	{streamId: 18704, name: "quad-1_probe-1", quad: "1", probe: "1", labels: ["Date", "Cubic Meters"], data: ""},
	{streamId: 18711, name: "quad-1_probe-2", quad: "1", probe: "2", labels: ["Date", "Cubic Meters"], data: ""},
	{streamId: 18762, name: "quad-1_temperature-1", quad: "1", labels: ["Date", "Temperature C"], data: ""},

	{streamId: 18718, name: "quad-2_probe-1", quad: "2", probe: "1", labels: ["Date", "Cubic Meters"], data: ""},
	{streamId: 18725, name: "quad-2_probe-2", quad: "2", labels: ["Date", "Cubic Meters"], data: ""},
	{streamId: 18767, name: "quad-2_temperature-1", quad: "2", labels: ["Date", "Temperature C"], data: ""},

	{streamId: 18732, name: "quad-3_probe-1", quad: "3", probe: "1", labels: ["Date", "Cubic Meters"], data: ""},
	{streamId: 18739, name: "quad-3_probe-2", quad: "3", probe: "2", labels: ["Date", "Cubic Meters"], data: ""},
	{streamId: 18772, name: "quad-3_temperature-1", quad: "3", labels: ["Date", "Temperature C"], data: ""},

	{streamId: 18746, name: "quad-4_probe-1", quad: "4", probe: "1", labels: ["Date", "Cubic Meters"], data: ""},
	{streamId: 18753, name: "quad-4_probe-2", quad: "4", probe: "2", labels: ["Date", "Cubic Meters"], data: ""},
	{streamId: 18777, name: "quad-4_temperature-1", quad: "4", labels: ["Date", "Temperature C"], data: ""}
];


var CEERTEXT = "Construction of Villanova's Green Roof took place in 3 days in the summer of 2006. The design was a " +
"retrofit of a small portion of Villanova's Center for Engineering Education Research (CEER) roof. The green roof is " +
"located on a second storey terrace above the \"Holy Grounds\" coffee shop. It is highly visible because it is located"+
"outside of the main stairwell and serves multiple purposes." +
"\n\n\n " +
"Underlying the green roof is a traditional roof which was refinished in order to ensure maximum life of the green" +
"roof. The next layer is an additional waterproofing layer which is also resistant to root penetration. On top of this layer is an insulation layer which is a thick mat designed to keep the potential for a large temperature gradient between the surface of the green roof and the original roof layer. The insulation is overlain with a geosynthetic layer that serves several purposes including drainage pathways, water storage areas, and aeration. This layer which looks much like an egg crate has holes at the high points to allow excessive amounts of water to drain. A filter fabric lies on top of it and allows water to pass through but keeps the fine sediments from the growth media from occupying the voids in the drainage layer. The media is a mixture of baked minerals which look like gravel and make it hard for weeds or anything aside from the highly specialized Sedum species to grow.";

var dummySites = {"Items":[
{"ID":"0","Name":"CEER Green Roof","Description":CEERTEXT},
{"ID":"1","Name":"name","Description":"description"},
{"ID":"2","Name":"name","Description":"description"},
{"ID":"3","Name":"name","Description":"description"},
{"ID":"4","Name":"name","Description":"description"}],
"Count":5};

var sidebarState="closed";


/*
 * Initialize Map
*/
function initialize() {

	var mapOptions = {
		center: center,
		zoom: 17,
		scrollwheel: false
	};

	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	/* initialise the infowindows */
	infowindow = new google.maps.InfoWindow({
		content: "Waiting for content..."
	});
}

/*
 * Populate sites on map
*/
function showSites() {
	clearMap();

	var result = dummySites;
	var indx = 0;

	$.each(result.Items, function (i, sensor) {
		Sensors.push(sensor);

		var coordinate = new google.maps.LatLng(dummyCoords[indx].x, dummyCoords[indx].y);
		sensorArray.push(coordinate);

		var marker = new google.maps.Marker({
			position: coordinate,
			map: map,
			// label: 'A',
			icon: {url: 'http://maps.google.com/mapfiles/ms/micons/red.png'},
			//animation: google.maps.Animation.DROP,
			title: "SensorID:"
		});

		markers.push(marker);
		marker.setMap(map);

		bindInfoWindow(marker, map, infowindow, sensor);
		indx++;
	});
		/*******TODO
		  -Make this more robust and create markers based on Database and names... might need another AJAX call.
		  -Also allow for marker array to be checked first for cached markers to be added before performing AJAX call.
		********/
}

/*
 * Make ajax call and store result to siteData
*/
function getStreamData(siteData, url, requestParams) {
	//startLoading();
//	setTimeout(function(){ stopLoading(); }, 1000);

	if (localFetchMode === true) {
		var url_ = concatenateUrlAndParams("/getDataStream/", requestParams)
		$.ajax({
			url: url_,
			dataType: "json",
		}).done(function (data) {
			$.each(data.Items, function (i, item) {
				siteData.data += item.timeValue + ',' + item.value + '\n';
			});
		});
	} else {
		var url_ = concatenateUrlAndParams(url, requestParams)
		$.ajax({
			url: url_,
			dataType: "json",
		}).done(function (data) {
			pages += 1;

			$.each(data.Items, function (i, item) {
				siteData.data += item.timeValue + ',' + item.value[0].value + '\n';
			});

			totalCount = totalCount + data.Count;

			if (typeof (data.NextPageLink) != 'undefined') {
				getStreamData(siteData, data.NextPageLink, {});
			} else {
				console.log("pages: " + pages);
				console.log(siteData.data);
				//setTimeout(function(){ stopLoading(); }, 1000);
			}
		});
	}
}

var graphs = {};


function showGraphof(site, divElement) {
	if (divElement === undefined) {
		divElement = site.name;
	}
		//$(divElement).empty();

	if (graphs[divElement] === undefined) {

		if (site.probe === undefined)
			graphTitle = site.labels[1] + " vs " + site.labels[0];
		else
			graphTitle = site.probe + ": " + site.labels[1] + " vs " + site.labels[0];

		var x = (sidebarState.localeCompare("minimized") == 0) ?
		$("#"+divElement).parent().width() * gWidthRatioWhenMinimized:
		$("#"+divElement).parent().width() * gWidthRatioWhenMaximized;

		var y = (sidebarState.localeCompare("minimized") == 0) ?
		$("#"+divElement).parent().width() * gHeightRatioWhenMinimized:
		$("#"+divElement).parent().width() * gHeightRatioWhenMaximized

		graphs[divElement] = new Dygraph(document.getElementById(divElement), site.data, {
//		"animatedZooms": true,
			"connectSeparatedPoints": true,
			"rollPeriod": 54,
//			"width": x,
//			"height": y,
			"strokeWidth": 1.2,
			"showLabelsOnHighlight": true,
			"highlightCircleSize": 2,
			"highlightSeriesOpts": {
				"strokeWidth": 1.4,
				"highlightCircleSize": 5
			},
			"labelsDivStyles": {
					'text-align': 'right',
					'background': 'none'
			},
			"labels": site.labels,
			"drawPoints": true,
			"title": graphTitle,
			"showRoller": false,
			"showRangeSelector": true
		});
	} else {
		if (sidebarState.localeCompare("minimized") == 0) {
			resizeGraphs(gWidthRatioWhenMinimized, gHeightRatioWhenMinimized);
//			graphs[divElement].width_ = 100;
//			graphs[divElement].height_ = 100;
		}
		else if (sidebarState.localeCompare("maximized") == 0)  {
			resizeGraphs(gWidthRatioWhenMaximized, gHeightRatioWhenMaximized);
//			graphs[divElement].width = 500;
//			graphs[divElement].height = 500;
		}
	}
}

function startLoading() {
	$("#LMetrics").append('<div id="loader" data-toggle="tab" class="loader-container">' +
		'<div class="loader-content">' +
		'<div class="circle"></div>' +
		'<div class="circle1"></div>' +
		'</div>'+
	'</div>');
}

function stopLoading() {
	$("#loader").remove();
}



function initializeQuadrantsDomElements() {
	for(var i=0; i<streams.length; i++) {
		$("#quad-" + streams[i].quad).append('<div class="row dygraph-plot-row-wrapper">' +
						'<div class="col-sm-2 text-center"></div>' +
						'<div class="col-sm-8 text-center graph-container">' +
							'<div id=' + streams[i].name + ' style="width:100%"></div>' +
						'</div>' +
						'<div class="col-sm-2 text-center"></div>' +
					'</div>');
	}
}

function resetCounters() {
	pages = 0;
    totalCount = 0;
}

function populateQuads() {
	var url = "https://public.optirtc.com/api/datapoint/";
	var requestParams = {
		"key": "z5ywCWZ4rLh3lu*3i234StqF",
		"dataStreamId": 18704,
	};

	for(var stream in streams) {
		requestParams.dataStreamId = streams[stream].streamId;
		getStreamData(streams[stream], url, requestParams);
		resetCounters();
	}
//	getStreamData(quad-1_probe-1, url, requestParams);
//	resetCounters();
//
//	requestParams.dataStreamId = 18711;
//	getStreamData(quad-1_probe-2, url, requestParams);
//	resetCounters();
//
//	requestParams.dataStreamId = 18762;
//	getStreamData(quad-1_temperature-1, url, requestParams);
//	resetCounters();
//
//	requestParams.dataStreamId = 18718;
//	getStreamData(quad-2_probe-1, url, requestParams);
//	resetCounters();
//
//	requestParams.dataStreamId = 18725;
//	getStreamData(quad-2_probe-2, url, requestParams);
//	resetCounters();
//
//	requestParams.dataStreamId = 18767;
//	getStreamData(quad-2_temperature-1, url, requestParams);
//	resetCounters();
//
//	requestParams.dataStreamId = 18732;
//	getStreamData(quad-3_probe-1, url, requestParams);
//	resetCounters();
//
//	requestParams.dataStreamId = 18739;
//	getStreamData(quad-3_probe-2, url, requestParams);
//	resetCounters();
//
//	requestParams.dataStreamId = 18772;
//	getStreamData(quad-3_temperature-1, url, requestParams);
//	resetCounters();
//
//	requestParams.dataStreamId = 18746;
//	getStreamData(quad-4_probe-1, url, requestParams);
//	resetCounters();
//
//	requestParams.dataStreamId = 18753;
//	getStreamData(quad-4_probe-2, url, requestParams);
//	resetCounters();
//
//	requestParams.dataStreamId = 18777;
//	getStreamData(quad-4_temperature-1, url, requestParams);
}

var ctrlPressed = false;

window.onkeydown = function(e) {
	console.log(e.which);
	ctrlPressed = ((e.keyIdentifier == 'Control') || (e.ctrlKey == true) || (e.which == 91));
}

window.onkeyup = function(e) {
	ctrlPressed = false;
}

function clearSelectedMarkers() {
	for (var i = 0; i < selectedMarkers.length; i++) {
		var m = selectedMarkers[i];
		m.setIcon({url: 'http://maps.google.com/mapfiles/ms/micons/red.png'});
	}
	selectedMarkers.length = 0;
}

function clearSelectedSensors () {
	selectedSensors.length = 0;
}

var selectedSensors = [];

function bindInfoWindow(marker, map, infowindow, sensor) {
	google.maps.event.addListener(marker, 'click', function () {
		if (ctrlPressed) {
			if (selectedMarkers.indexOf(marker) == -1) {
				selectedMarkers.push(marker);
				marker.setIcon({url: 'http://maps.google.com/mapfiles/ms/micons/purple.png'});
				// marker.set(labelContent', 'labels[labelIndex++ % labels.length]);
				selectedSensors.push(sensor);
				updateWindowPane();
			}
		}
		else {
			clearSelectedMarkers();
			clearSelectedSensors();
			labelIndex = 0;
			selectedMarker = marker;
			if (selectedMarkers.indexOf(marker) == -1) {

				if (sidebarState.localeCompare("minimized") == 0)
					offsetCenter(marker.getPosition(), -($(window).width() * 0.15), 0);
				else
					map.panTo(marker.getPosition());

				selectedMarkers.push(selectedMarker);
				selectedSensors.push(sensor);
				marker.setIcon({url: 'http://maps.google.com/mapfiles/ms/micons/purple.png'});
				// marker.set('labelContent', labels[labelIndex++ % labels.length]);
			}
			//infowindow.open(map, this);

			// InfoWindow
			var windowContent = '<div id="balloon">' +
									'<div id="site-overview-header">' +
										'<h4>' + sensor.Name + '</h4>' +
										'<ul class="nav nav-tabs nav-justified">' +
										'<li class="active"><a href="#LMetrics" data-toggle="tab">Latest Metrics</a></li>' +
										'<li><a href="#AboutSite" data-toggle="tab">About this site</a></li></ul>' +
									'</div>' +
									'<div id="SiteOverview" class="tab-content">' +
										'<div id="LMetrics" class="tab-pane fade in active">' +
										'</div>' +
										'<div id="AboutSite" class="tab-pane fade">' +
											'<p>' + sensor.Description + '</p>'+
										'</div>' +
									'</div>' +
								'</div>';
			infowindow.setContent(windowContent);
			infowindow.open(map, marker);
			updateWindowPane();
		}
		// infoWindow Pane
		// infowindow.setContent("SensorID: " + sensor.id + "\n TimeValue: " + sensor.timeValue + "\nValue: " + sensor.value);
		// updateWindowPane("SensorID: " + sensor.id + "/n TimeValue: " + sensor.timeValue + "/nValue: " + "+ sensor.value");
	});
}

function createMarkers(type) {
	//modify the views to handle different types of points
}

function getInfoContent(id) {
	var content;
	$.ajax({async: false, url: "http://127.0.0.1:5000/getInfoPane/" + id, success:function(result) { //change url
		content = result;
	}});
  return content;
}

function hideMarkers() {
	for(x in markers) {
		markers[x].setMap(null);
		//markers[x].remove();
	}
}

function clearDashboardSelectedSensors() {
	$("#sensors-charts").empty();
	$("#sensors-charts").replaceWith('<div id="sensors-charts"></div>');
}

function clearMap() {
	hideMarkers();
	clearDashboardSelectedSensors();
}

function toggleBounce() {
	if (marker.getAnimation() != null) {
		marker.setAnimation(null);
	} else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
	}
}

function updateWindowPane() {
	var sensorsData = [];
	if (selectedSensors.length == 1) {
		var updatedSensorInfo = '<div id="sensor-info">' +
							'<p>Sensor: #' + selectedSensors[0].id + '</p><p><u><b>Latest Captured Value</b></u></p>';
//							'Timestamp: ' + selectedSensors[0].timeValue + '<br>' +
//							'Value: ' + selectedSensors[0].value + '<br></div>';



		showGraphof(getStreamByID(18704), "LMetrics");
		populateGraphs(1);
		populateGraphs(2);
		populateGraphs(3);
		populateGraphs(4);

		$("#sensor-info").replaceWith(updatedSensorInfo);

	} else {
		for (sensor in selectedSensors) {
			var updatedSensorInfo = '<div id="sensor-info"><h2>Showing data for multiple sensors</h2></div>';
			console.log('updating info of sensor');
//			showGraphof(quad-1_probe-1, "LMetrics");
//			showGraphof(quad-1_probe-1);
//			showGraphof(quad-1_temperature-1);
//
//			showGraphof(quad-2_probe-1);
//			showGraphof(quad-2_probe-2);
//			showGraphof(quad-2_temperature-1);
//
//			showGraphof(quad-3_probe-1);
//			showGraphof(quad-3_probe-2);
//			showGraphof(quad-3_temperature-1);
//
//			showGraphof(quad-4_probe-1);
//			showGraphof(quad-4_probe-2);
//			showGraphof(quad-4_temperature-1);

//			$("#sensor-info").replaceWith(updatedSensorInfo);
		}
	}
}

function resizeGraphs(x, y) {
	setTimeout(function() {
		for (var gKey in graphs) {
			graphs[gKey].resize();
//			graphs[gKey].resize($("#"+gKey).parent().width() * x, $("#"+gKey).parent().width() * y);
		}}, 200);
}

google.maps.event.addDomListener(window, 'load', initialize);

function maximizeToolbar() {
	if (sidebarState.localeCompare("minimized") == 0) {
		sidebarState="maximized";
		resizeGraphs(gWidthRatioWhenMaximized, gHeightRatioWhenMaximized);
		$("#wrapper").toggleClass("maximized");
		$("#sidebar-header").toggleClass("maximized");
		$("#maximize").replaceWith('<a href="#" id="maximize" class="btn btn-link btn-sm" onclick="minimizeToolbar()" data-toggle="tooltip" data-placement="right" title="Minimize Toolbar"><span class="glyphicon glyphicon-resize-small"></span></a>');
	}
}

function minimizeToolbar() {
	if (sidebarState.localeCompare("maximized") == 0) {
		sidebarState="minimized";
		resizeGraphs(gWidthRatioWhenMinimized, gHeightRatioWhenMinimized);
		$("#wrapper").toggleClass("maximized");
		$("#sidebar-header").toggleClass("maximized");
		$("#maximize").replaceWith('<a href="#" id="maximize" class="btn btn-link btn-sm" onclick="maximizeToolbar()"' +
		 'data-toggle="tooltip" data-placement="right" title="Maximize Toolbar">' +
		 '<span class="glyphicon glyphicon-resize-full"></span></a>');
	}
}

function openToolbar() {
	// Shift center of map to the right by half width of the sidebar
	offsetCenter(map.getCenter(), -($(window).width() * 0.15), 0);
	if (sidebarState.localeCompare("closed") == 0) {
		sidebarState="minimized";
		$("#wrapper").toggleClass("toggled");
		$("#sidebar-header").toggleClass("toggled");
		setTimeout(function(){ populateGraphs(1); }, 500);
	} else {
		closeToolbar();
	}
}

function closeToolbar() {
	// Shift center of map to the left by half width of the sidebar
	offsetCenter(map.getCenter(), $(window).width() * 0.15 , 0);
	if (sidebarState.localeCompare("minimized") == 0) {
		sidebarState="closed";
		$("#wrapper").toggleClass("toggled");
		$("#sidebar-header").toggleClass("toggled");
		$("#maximize").replaceWith('<a href="#" id="maximize" class="btn btn-link btn-sm" onclick="maximizeToolbar()"' +
		 'data-toggle="tooltip" data-placement="right" title="Maximize Toolbar">' +
		 '<span class="glyphicon glyphicon-resize-full"></span></a>');
	} else if (sidebarState.localeCompare("maximized") == 0) {
		minimizeToolbar();
		sidebarState="closed";
		$("#wrapper").toggleClass("toggled");
		$("#sidebar-header").toggleClass("toggled");
		$("#maximize").replaceWith('<a href="#" id="maximize" class="btn btn-link btn-sm" onclick="maximizeToolbar()"' +
		 'data-toggle="tooltip" data-placement="right" title="Maximize Toolbar">' +
		 '<span class="glyphicon glyphicon-resize-full"></span></a>');
	}
}

/*
	Moves the camera to latlng with an offset
	latlng is the apparent centre-point
	offsetx is the distance you want that point to move to the right, in pixels
	offsety is the distance you want that point to move upwards, in pixels
	offset can be negative
	offsetx and offsety are both optional
*/
function offsetCenter(latlng, offsetx, offsety) {
	var scale = Math.pow(2, map.getZoom());
	var nw = new google.maps.LatLng(
		map.getBounds().getNorthEast().lat(),
		map.getBounds().getSouthWest().lng()
	);
	var worldCoordinateCenter = map.getProjection().fromLatLngToPoint(latlng);
	var pixelOffset = new google.maps.Point((offsetx/scale) || 0,(offsety/scale) ||0)
	var worldCoordinateNewCenter = new google.maps.Point(
		worldCoordinateCenter.x - pixelOffset.x,
		worldCoordinateCenter.y + pixelOffset.y
	);

	var newCenter = map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);
	// Set a tiny delay to avoid glitches while opening sidebar and shifting the map simultaneously
	setTimeout(function(){ map.panTo(newCenter); }, 30);
}

$(document).ready(function() {
	initializeQuadrantsDomElements();
	populateQuads();

	$(".nav-tabs a").click(function() {
		$(this).tab('show');
	});


	$('#selection-tabs a[href="#quad-1"]').on('shown.bs.tab', function(event) {
		if (graphs['quad-1_probe-1'] != undefined) {
			graphs['quad-1_probe-1'].resize();
		}
		if (graphs['quad-1_probe-2'] != undefined) {
			graphs['quad-1_probe-2'].resize();
		}
		if (graphs['quad-1_temperature-1'] != undefined) {
			graphs['quad-1_temperature-1'].resize();
		}
	});

	$('#selection-tabs a[href="#quad-2"]').on('shown.bs.tab', function(event) {
		if (graphs['quad-2_probe-1'] != undefined) {
			graphs['quad-2_probe-1'].resize();
		}
		if (graphs['quad-2_probe-2'] != undefined) {
			graphs['quad-2_probe-2'].resize();
		}
		if (graphs['quad-2_temperature-1'] != undefined) {
			graphs['quad-2_temperature-1'].resize();
		}
	});

	$('#selection-tabs a[href="#quad-3"]').on('shown.bs.tab', function(event) {
		if (graphs['quad-3_probe-1'] != undefined) {
			graphs['quad-3_probe-1'].resize();
		}
		if (graphs['quad-3_probe-2'] != undefined) {
			graphs['quad-3_probe-2'].resize();
		}
		if (graphs['quad-3_temperature-1'] != undefined) {
			graphs['quad-3_temperature-1'].resize();
		}
	});

	$('#selection-tabs a[href="#all-quads"]').on('shown.bs.tab', function(event) {
		if (graphs['mixed-probes'] != undefined) {
			graphs['mixed-probes'].resize();
		}
		if (graphs['mixed-temperatures'] != undefined) {
			graphs['mixed-temperatures'].resize();
		}
	});

	$('.nav-tabs a').on('shown.bs.tab', function(event) {
		populateGraphs($(event.target).text().split(" ")[1]);
    });
});

function generateMixedGraphs() {
	$("#mixed-probes").empty();
	$("#mixed-temperatures").empty();
//	$("#mixed-probes").remove();
//	$("#mixed-temperatures").remove();
//	$("#all-quads").append("<div id=mixed-probes></div>");
//	$("#all-quads").append("<div id=mixed-temperatures></div>");

	var quadrants = [];
	var probes = [];
	var temperatures = [];
	$.each($("input[name='Quadrant']:checked"), function(){
		quadrants.push($(this).val());
	});
	$.each($("input[name='Probe']:checked"), function(){
		probes.push($(this).val());
	});
	$.each($("input[name='Temp']:checked"), function(){
		temperatures.push($(this).val());
	});

	var probeLabels = ['Time'];
	var temperatureLabels = ['Time'];

	// Test
	var data1 = "2016-02-10T15:56:03.7783794,5\n" +
				"2016-02-10T15:57:10.4915719,5\n" +
				"2016-02-10T15:55:10.4915719,5\n" +
				"2016-02-10T15:54:10.4915719,5\n" +
				"2016-02-10T15:53:10.4915719,5\n" +
				"2016-02-10T15:52:10.4915719,5\n" +
				"2016-02-10T15:51:03.1974357,5";

	var data2 = "2016-02-10T15:56:03.7783794,10\n" +
				"2016-02-10T15:57:10.4915719,10\n" +
				"2016-02-10T15:50:10.4915719,10\n" +
				"2016-02-10T15:52:10.4915719,10\n" +
				"2016-02-10T15:59:10.4915719,10\n" +
				"2016-02-10T15:49:10.4915719,10\n" +
				"2016-02-10T15:51:03.1974357,10";

	var data3 = "2016-02-10T15:56:03.7783794,15\n" +
				"2016-02-10T15:57:10.4915719,15\n" +
				"2016-02-10T15:50:10.4915719,15\n" +
				"2016-02-10T15:52:10.4915719,15\n" +
				"2016-02-10T15:59:10.4915719,15\n" +
				"2016-02-10T15:49:10.4915719,15\n" +
				"2016-02-10T15:51:03.1974357,15";

	var data4 = "2016-02-10T15:56:03.7783794,20\n" +
				"2016-02-10T15:57:10.4915719,20\n" +
				"2016-02-10T15:50:10.4915719,20\n" +
				"2016-02-10T15:52:10.4915719,20\n" +
				"2016-02-10T15:59:10.4915719,20\n" +
				"2016-02-10T15:49:10.4915719,20\n" +
				"2016-02-10T15:51:03.1974357,20";

//	getStreamByName("quad-1_probe-1").data = data1;
//	getStreamByName("quad-1_probe-2").data = data2;
//	getStreamByName("quad-2_probe-1").data = data3;
//	getStreamByName("quad-2_probe-2").data = data4;


	var probesData = [];
	for(q in quadrants) {
		for (p in probes) {
			console.log(quadrants[q] + "_" + probes[p]);
			probesData.push(getStreamByName(quadrants[q] + "_" + probes[p]).data);
			probeLabels.push(getStreamByName(quadrants[q] + "_" + probes[p]).name);
		}
	}
//	console.log(probesData);

	var temperaturesData = [];
	for(q in quadrants) {
		for (t in temperatures) {
			console.log(quadrants[q] + "_" + temperatures[t]);
			temperaturesData.push(getStreamByName(quadrants[q] + "_" + temperatures[t]).data);
			temperatureLabels.push(getStreamByName(quadrants[q] + "_" + temperatures[t]).name);
		}
	}
//	console.log(temperaturesData);

	var divElement = "mixed-probes";
	var params = jQuery.extend({}, dygraphParams);
//	params.x = (sidebarState.localeCompare("minimized") == 0) ?
//		("#"+divEleme$nt).parent().width() * gWidthRatioWhenMinimized:
//		$("#"+divElement).parent().width() * gWidthRatioWhenMaximized;
//	params.y = (sidebarState.localeCompare("minimized") == 0) ?
//		$("#"+divElement).parent().width() * gHeightRatioWhenMinimized:
//		$("#"+divElement).parent().width() * gHeightRatioWhenMaximized;

	if(probesData.length > 0) {
		var data = aggregateData(probesData);
		params.title = "Soil Moisture Probes";
		params.labels = probeLabels;
		console.log("Probes: " + data);
		console.log("Probes Labels: " + probeLabels);
		dygraphPlot("mixed-probes", data, params);
	}

	if(temperaturesData.length > 0) {
		var data = aggregateData(temperaturesData);
		params.title = "Temperature";
		params.labels = temperatureLabels;
		dygraphPlot("mixed-temperatures", data, params);
	}

//	if ($.inArray('q-1', quadrants) > -1) {
//
//		var data1 = "2016-02-10T15:56:03.7783794,5\n" +
//				"2016-02-10T15:57:10.4915719,5\n" +
//				"2016-02-10T15:55:10.4915719,5\n" +
//				"2016-02-10T15:54:10.4915719,5\n" +
//				"2016-02-10T15:53:10.4915719,5\n" +
//				"2016-02-10T15:52:10.4915719,5\n" +
//				"2016-02-10T15:51:03.1974357,5";
//
//		var data2 = "2016-02-10T15:56:03.7783794,10\n" +
//				"2016-02-10T15:57:10.4915719,10\n" +
//				"2016-02-10T15:50:10.4915719,10\n" +
//				"2016-02-10T15:52:10.4915719,10\n" +
//				"2016-02-10T15:59:10.4915719,10\n" +
//				"2016-02-10T15:49:10.4915719,10\n" +
//				"2016-02-10T15:51:03.1974357,10";
//		data = aggregateData(data1, data2);
//		labels = ["Date", "a", "b"];
//	} else {
//		var data1 = "2016-02-10T15:56:03.7783794,15\n" +
//				"2016-02-10T15:57:10.4915719,15\n" +
//				"2016-02-10T15:55:10.4915719,15\n" +
//				"2016-02-10T15:54:10.4915719,15\n" +
//				"2016-02-10T15:53:10.4915719,15\n" +
//				"2016-02-10T15:52:10.4915719,15\n" +
//				"2016-02-10T15:51:03.1974357,15";
//
//		var data2 = "2016-02-10T15:56:03.7783794,10\n" +
//				"2016-02-10T15:57:10.4915719,20\n" +
//				"2016-02-10T15:50:10.4915719,20\n" +
//				"2016-02-10T15:52:10.4915719,20\n" +
//				"2016-02-10T15:59:10.4915719,20\n" +
//				"2016-02-10T15:49:10.4915719,20\n" +
//				"2016-02-10T15:51:03.1974357,20";
//		data = aggregateData([data1, data2]);
//		labels = ["Date", "A", "B"];
//	}

//	console.log("Test for data format: " + quad-1_probe-1.data);
//	aggregateData(data1, data2);

}

function dygraphPlot(divElement, data, params) {
	graphs[divElement] = new Dygraph(document.getElementById(divElement), data, params);
	graphs[divElement].resize();
}



Date.prototype.setISO8601 = function (string) {
    var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
    "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
    "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
    var d = string.match(new RegExp(regexp));

    var offset = 0;
    var date = new Date(d[1], 0, 1);

    if (d[3]) { date.setMonth(d[3] - 1); }
    if (d[5]) { date.setDate(d[5]); }
    if (d[7]) { date.setHours(d[7]); }
    if (d[8]) { date.setMinutes(d[8]); }
    if (d[10]) { date.setSeconds(d[10]); }
    if (d[12]) { date.setMilliseconds(Number("0." + d[12]) * 1000); }
    if (d[14]) {
        offset = (Number(d[16]) * 60) + Number(d[17]);
        offset *= ((d[15] == '-') ? 1 : -1);
    }

    offset -= date.getTimezoneOffset();
    time = (Number(date) + (offset * 60 * 1000));
    this.setTime(Number(time));
    return this;
}

function sortByDate( date1, date2 ) {
    var date1_ = (new Date()).setISO8601(date1);
    var date2_ = (new Date()).setISO8601(date2);
    return date2_ > date1_ ? 1 : -1;
}

function aggregateData(dataStreams) {

	var T = [];
	var D = [];
	var TimeCol = [];
	var aggregatedData = "";

	// Iterate Data args
	for (var i = 0; i < dataStreams.length; i++) {

		T[i] = [], D[i] = [];

		// Convert strings to arrays
		var dataArray = dataStreams[i].split("\n");
		// Check if the last element is empty
		if (dataArray[dataArray.length - 1].split(",").length === 1) {
			dataArray = dataArray.slice(0, dataArray.length - 1);
		}

		// Split to T and D
		for (var d = 0; d < dataArray.length; d++) {
			// First data column
			var t = dataArray[d].split(",")[0];
			if (t == "") {
				console.log("Problem at : " + d + " elemnt: " + dataArray[d]);
			}
			T[i].push(t);

			// Second data column
			D[i].push(dataArray[d].split(",")[1]);

			// If key not in array, then push it
			if ($.inArray(t, TimeCol) < 0) {
				TimeCol.push(t);
			}
		}
	}

	TimeCol.join();
	TimeCol.sort(sortByDate);

//	console.log("T: " + T + "\n");
//	console.log("D: " + D + "\n");
//	console.log("Time Col: " + TimeCol + "\n");

	for (var i = 0; i < TimeCol.length; i++) {
		datacol = "";
		for (var j = 0; j < T.length; j++) {

			var f = $.inArray(TimeCol[i], T[j]);
			if (f > -1) {
//				console.log("Data found at: " + T[j][f] + " f: " + f);
				if (j === T.length - 1) {
					datacol += D[j][f];
				} else {
					datacol += D[j][f] + ",";
				}
			} else {
				if (j === T.length - 1) {
					datacol += "";
				} else {
					datacol += ",";
				}
			}
		}
		aggregatedData += TimeCol[i] + "," + datacol + "\n";
	};
	return aggregatedData;
}

function populateGraphs(quad) {
	switch (parseInt(quad)) {
		case 1:
			showGraphof(getStreamByName("quad-1_probe-1"));
			showGraphof(getStreamByName("quad-1_probe-2"));
			showGraphof(getStreamByName("quad-1_temperature-1"));
			break;
		case 2:
			showGraphof(getStreamByName("quad-2_probe-1"));
			showGraphof(getStreamByName("quad-2_probe-2"));
			showGraphof(getStreamByName("quad-2_temperature-1"));
			break;
		case 3:
			showGraphof(getStreamByName("quad-3_probe-1"));
			showGraphof(getStreamByName("quad-3_probe-2"));
			showGraphof(getStreamByName("quad-3_temperature-1"));
			break;
		case 4:
			showGraphof(getStreamByName("quad-4_probe-1"));
			showGraphof(getStreamByName("quad-4_probe-2"));
			showGraphof(getStreamByName("quad-4_temperature-1"));
			break;
		default:
	}
}

function concatenateUrlAndParams(url, requestParams) {
	if (!jQuery.isEmptyObject(requestParams)) {
		var params = "";
		for(p in requestParams) {
			params += p + "=" + requestParams[p] + "&"
		}
		if (url.slice(-1) === "/") {
			url = url.slice(0, -1);
		}
		url += "?" + params.slice(0, -1);
	}
	return url;
}

function getStreamByID(id) {
	var results = $.grep(streams, function(e){ return e.streamId === id; });
	return (results.length === 0) ? null : results[0];
}

function getStreamByName(name) {
	var results = $.grep(streams, function(e){ return e.name === name; });
	return (results.length === 0) ? null : results[0];
}