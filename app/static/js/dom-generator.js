var MAP_TOOLBAR_HANDHELD = '<div id="map-toolbar" class="btn-group">\
        <button type="button" class="btn btn-default" onclick="openToolbar()">Dashboard\
        </button>\
        <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">\
        <span class="caret"></span>\
        </button>\
        <ul class="dropdown-menu" role="menu">\
        <li><a href="#"onclick="populateSitesOnMap()">Show Sites</a></li>\
        <li><a href="#"onclick="clearMap()">Clear Map</a></li>\
        </ul>\
        </div>'

var MAP_TOOLBAR_NORMAL = 
    '<div id="map-toolbar" class="btn-group">\
            <button type="button" class="btn btn-default" onclick="openToolbar()">Dashboard</button>\
            <button type="button" class="btn btn-default" onclick="populateSitesOnMap()">Show Sites</button>\
            <button type="button" class="btn btn-default" onclick="clearMap()">Clear Map</button>\
     </div>';


function initializeQuadrantsDomElements() {
	// for(var i=0; i<streams.length; i++) {
	// 	$("#quad-" + streams[i].quad).append('<div class="row dygraph-plot-row-wrapper">' +
	// 					'<div class="col-sm-2 text-center"></div>' +
	// 					'<div class="col-sm-8 text-center graph-container">' +
	// 						'<div id=' + streams[i].name + ' style="width:100%"></div>' +
	// 					'</div>' +
	// 					'<div class="col-sm-2 text-center"></div>' +
	// 				'</div>');
	// }
}

function showMapToolbar() {
    if ($(window).width() <= 500) {
        mapToolbar("Handheld");
    } else {
        mapToolbar("Normal");
    }
}

function mapToolbar(screenSize) {
    if (screenSize === "Handheld") {
        $("#map-toolbar").replaceWith(MAP_TOOLBAR_HANDHELD);
    } else {
        $("#map-toolbar").replaceWith(MAP_TOOLBAR_NORMAL);
    }

}

$(document).ready(function() {
	initializeQuadrantsDomElements();
    showMapToolbar();
    $(window).resize(function() {
        if ($(window).width() <= 500) {
            mapToolbar("Handheld");
        } else {
            mapToolbar("Normal");
        }
    });
});