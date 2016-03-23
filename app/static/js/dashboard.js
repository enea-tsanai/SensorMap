var sidebarState="minimized";

function maximizeToolbar() {
    if (sidebarState === "minimized") {
        $("#right-component").css("min-width", 0);
        $('div.split-pane').splitPane('lastComponentSize', 0);
        $("#maximize").find($("span")).replaceWith('<span class="glyphicon glyphicon-resize-small"></span>');
        sidebarState = "maximized";
    } else {
        $("#right-component").css("min-width", 395);
        $('div.split-pane').splitPane('firstComponentSize', 300);
        $("#maximize").find($("span")).replaceWith('<span class="glyphicon glyphicon-resize-full"></span>');
        sidebarState = "minimized";
    }
}

function openToolbar() {
    $('div.split-pane').splitPane('firstComponentSize', 300);
	// Shift center of map to the right by half width of the sidebar
	// offsetCenter(map.getCenter(), -($(window).width() * 0.15), 0);
}

function closeToolbar() {
	$('div.split-pane').splitPane('firstComponentSize', 0);
}

function clearDashboardSelectedSensors() {
	$("#sensors-charts").empty();
	$("#sensors-charts").replaceWith('<div id="sensors-charts"></div>');
}

$(document).ready(function() {
	$(".nav-tabs a").click(function() {
		$(this).tab('show');
	});

    $('button[id="maximize"]').on('click', function (e) {
        maximizeToolbar();
    });

    $('button[id="close"]').on('click', function (e) {
        closeToolbar();
    });
});