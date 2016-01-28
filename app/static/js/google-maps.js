var map = null;
var regionArray = []; 
var markers = [];
var selectedMarker = null;
var selectedMarkers = [];
var sensorArray = [];
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

var dummySensors = {"Items":[{"id":"2519574419502746487","timeValue":"2015-10-14T21:40:49.7253512","value":[{"resourceId":9958,"value":5258.46}]},{"id":"2519574420267038073","timeValue":"2015-10-14T21:39:33.2961926","value":[{"resourceId":9958,"value":5258.46}]},{"id":"2519574421371622994","timeValue":"2015-10-14T21:37:42.8377005","value":[{"resourceId":9958,"value":5258.46}]},{"id":"2519574421937179308","timeValue":"2015-10-14T21:36:46.2820691","value":[{"resourceId":9958,"value":5258.46}]},{"id":"2519574422537011978","timeValue":"2015-10-14T21:35:46.2988021","value":[{"resourceId":9958,"value":5258.46}]}],"Count":5};
var sidebarState="closed";

function initialize() {
	var mapOptions = {
	center: { lat: 40.036137, lng: -75.340919},
	zoom: 17,
	scrollwheel: false
	};

	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	google.maps.event.addListener(map, 'click', function(event) {
	// addMarker(event.latLng);
	// this.setIcon({url: 'http://maps.google.com/mapfiles/ms/micons/purple.png'});
	});

	/* initialise the infowindows */
	infowindow = new google.maps.InfoWindow({
		content: "Waiting for content..."
	});
}

function showSites() {
	clearMap();

	console.log('showSites');
	//cannot make global due to asynchronous Ajax Calls
	var callResult = {};

	// $.ajax({url:"https://public.optirtc.com/api/datapoint/?key=z5ywCWZ4rLh3lu*3i234StqF&dataStreamId=4626&top=5",success:function(result) { //change url
	var result = dummySensors;

	var indx = 0;
	console.log('Ajax success');
		$.each(result.Items, function (i, sensor) {
			Sensors.push(sensor);

			// var coordinate = new google.maps.LatLng(callResult[x].location.latitude, callResult[x].location.longitude);
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

// }}); 
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
				selectedMarkers.push(selectedMarker);
				selectedSensors.push(sensor);
				marker.setIcon({url: 'http://maps.google.com/mapfiles/ms/micons/purple.png'});
				// marker.set('labelContent', labels[labelIndex++ % labels.length]);
			}
			infowindow.open(map, this);

			// InfoWindow
			var windowContent = '<div id="content"><div id="siteNotice"></div><p>Sensor: #' + sensor.id +
							  '</p><div id="bodyContent"><img src="static/img/villanova-1.jpg" style="max-width: 300px;"></img></div></div>';

			infowindow.setContent(windowContent);
			// infowindow.open(map, marker);

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
							'<p>Sensor: #' + selectedSensors[0].id + '</p><p><u><b>Latest Captured Value</b></u></p>' +
							'Timestamp: ' + selectedSensors[0].timeValue + '<br>' +
							'Value: ' + selectedSensors[0].value + '<br></div>';
		showGraphof();
		$("#sensor-info").replaceWith(updatedSensorInfo);

	} else {
		for (sensor in selectedSensors) {
			var updatedSensorInfo = '<div id="sensor-info"><h2>Showing data for multiple sensors</h2></div>';
			console.log('updating info of sensor');
			showGraphof();
			$("#sensor-info").replaceWith(updatedSensorInfo);
		}
	}
}

function showGraphof() {
	var data = [];
	var t = new Date();

	console.log(selectedMarkers);
	console.log(selectedSensors);


	for (var i = 10; i >= 0; i--) {
		var x = new Date(t.getTime() - i * 1000);
		var dataCols = [];
		dataCols.push(x);
		for (sensor in selectedSensors)
		  dataCols.push(Math.random())
		data.push(dataCols);
	}

	var lab = [];
	lab.push('Time');
	for (sensor in selectedSensors) {
		lab.push(selectedSensors[sensor].id);
	}

	$("#sensors-charts").replaceWith('<div id="sensors-charts"><div id="selectedSensorInfo">' +
									'<div id="sensor-info"></div><div id="sensor-data-viz"></div>' +
									'<div id="sensor-data-viz-2"></div></div><div id="master-view"></div></div>');

	$("sensor-data-viz").empty();
	var g = new Dygraph(document.getElementById("sensor-data-viz"), data,
					{
						drawPoints: true,
						title: 'A vs B',
						// showRoller: true,
						valueRange: [0.0, 1.2],
						labels: lab,
						ylabel: 'A (a)',
						xlabel: 'B (b)'
					});

	var g2 = new Dygraph(document.getElementById("sensor-data-viz-2"), data, {
		drawPoints: true,
		title: 'A vs B',
		// showRoller: true,
		valueRange: [0.0, 1.2],
		labels: lab,
		ylabel: 'A (a)',
		xlabel: 'B (b)'
		});
	// It sucks that these things aren't objects, and we need to store state in window.
	// window.intervalId = setInterval(function() {
	//   var dataCols = [];
	//   var x = new Date();  // current time
	//   dataCols.push(x);
	//   for (sensor in selectedSensors)
	//     dataCols.push(Math.random())

	//   data.push(dataCols);
	//   g.updateOptions( { 'file': data } );
	// }, 1000);
}

google.maps.event.addDomListener(window, 'load', initialize);

function maximizeToolbar() {
	if (sidebarState.localeCompare("minimized") == 0) {
		sidebarState="maximized";
		$("#wrapper").toggleClass("maximized");
		$("#sidebar-header").toggleClass("maximized");
		$("#maximize").replaceWith('<a href="#" id="maximize" class="btn btn-link btn-sm" onclick="minimizeToolbar()" data-toggle="tooltip" data-placement="right" title="Minimize Toolbar"><span class="glyphicon glyphicon-resize-small"></span></a>');
	}
}

function minimizeToolbar() {
	if (sidebarState.localeCompare("maximized") == 0) {
		sidebarState="minimized";
		$("#wrapper").toggleClass("maximized");
		$("#sidebar-header").toggleClass("maximized");
		$("#maximize").replaceWith('<a href="#" id="maximize" class="btn btn-link btn-sm" onclick="maximizeToolbar()"' +
		 'data-toggle="tooltip" data-placement="right" title="Maximize Toolbar">' +
		 '<span class="glyphicon glyphicon-resize-full"></span></a>');
	}
}

function openToolbar() {
	if (sidebarState.localeCompare("closed") == 0) {
		sidebarState="minimized";
		$("#wrapper").toggleClass("toggled");
		$("#sidebar-header").toggleClass("toggled");
	} else {
		closeToolbar();
	}
}

function closeToolbar() {
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

function refreshMapOnSidebarClose() {
	$(window).resize(function () {
		var h = $(window).height(),
			offsetTop = 52; // Calculate the top offset
		$('#map-canvas').css('height', (h - offsetTop));
	}).resize();
}




