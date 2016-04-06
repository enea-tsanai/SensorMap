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
var selectedSensors = [];
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;

window.onkeydown = function(e) {
	console.log(e.which);
	ctrlPressed = ((e.keyIdentifier == 'Control') || (e.ctrlKey == true) || (e.which == 91));
}

window.onkeyup = function(e) {
	ctrlPressed = false;
}

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

var ctrlPressed = false;

function clearSelectedMarkers() {
	for (var i = 0; i < selectedMarkers.length; i++) {
		var m = selectedMarkers[i];
		m.setIcon({url: 'http://maps.google.com/mapfiles/ms/micons/red.png'});
	}
	selectedMarkers.length = 0;
}

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
			//TODO: Id of ballon should be the site id
			//TODO: Include this in Dom elements
			var windowContent = '<div class="site-overview-balloon">\n    <div class="site-overview-balloon-header"><h4>' + sensor.Name + '</h4>\n        <ul class="nav nav-tabs nav-justified">\n            <li class="active"><a href="#LMetrics" data-toggle="tab">Latest Metrics</a></li>\n            <li><a href="#AboutSite" data-toggle="tab">About this site</a></li>\n        </ul>\n    </div>\n    <div class="site-overview-balloon-tab tab-content">\n        <div id = "LMetrics" class="l-metrics tab-pane fade in active"></div>\n        <div id = "AboutSite" class="about-site tab-pane fade">\n            <div class="row text-center">\n                <iframe src="https://3dwarehouse.sketchup.com/embed.html?mid=ua7d24fd4-10c8-4ba4-8202-83a5b0de4135" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" allowfullscreen></iframe>\n            </div>\n            <p>' + sensor.Description + '</p>\n        </div>\n    </div>\n</div>';
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

function clearSelectedSensors () {
	selectedSensors.length = 0;
}

function updateWindowPane() {
	var sensorsData = [];
	if (selectedSensors.length == 1) {
		var updatedSensorInfo = '<div id="sensor-info">' +
							'<p>Sensor: #' + selectedSensors[0].id + '</p><p><u><b>Latest Captured Value</b></u></p>';
//							'Timestamp: ' + selectedSensors[0].timeValue + '<br>' +
//							'Value: ' + selectedSensors[0].value + '<br></div>';


		populateLastMetricsTab();
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

google.maps.event.addDomListener(window, 'load', initialize);