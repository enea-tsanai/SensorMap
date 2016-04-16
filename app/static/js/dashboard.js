var sidebarState="closed";


function minToMax() {
    $('#my-divider').addClass('invisible');
    $("#left-component").removeClass('closed').removeClass('minimized-l').addClass('maximized-l');
    $("#right-component").removeClass('minimized-r').removeClass('maximized-r').addClass('closed');
    $('div.split-pane').splitPane('lastComponentSize', 0);
    $("#maximize").find($("span")).replaceWith('<span class="glyphicon glyphicon-resize-small"></span>');
    sidebarState = "maximized";
}

function maxToMin() {
    $('#my-divider').removeClass('invisible');
    var width =  parseInt($("#left-component").removeClass('closed').removeClass('maximized-l').addClass('minimized-l')
        .css("min-width"));
    $("#right-component").removeClass('closed').removeClass('maximized-r').addClass('minimized-r');
    $('div.split-pane').splitPane('firstComponentSize', width);
    $("#maximize").find($("span")).replaceWith('<span class="glyphicon glyphicon-resize-full"></span>');
    sidebarState = "minimized";
}

function maximizeToolbar() {
    addFastDrag();
    if (sidebarState === "minimized") {
        minToMax();
    } else {
        maxToMin();
    }
    removeFastDrag();
}

function openToolbar() {
    sidebarState="minimized";
    addFastDrag();
    if ($(document).width() < 845) { // TODO: Handle this better - Mobile
        minToMax();
    } else {
        $('#my-divider').removeClass('invisible');
        var width = parseInt($("#left-component").removeClass('closed').removeClass('maximized-l')
            .addClass('minimized-l').css("min-width"));
        $("#right-component").removeClass('closed').removeClass('maximized-r').addClass('minimized-r');
        $('div.split-pane').splitPane('firstComponentSize', width);
    }
    removeFastDrag();
	// Shift center of map to the right by half width of the sidebar
	// offsetCenter(map.getCenter(), -($(window).width() * 0.15), 0);
}

function closeToolbar() {
    sidebarState = "closed";
    addFastDrag();
    $('#my-divider').addClass('invisible');
    $("#left-component").removeClass('minimized-l').removeClass('maximized-l').addClass('closed');
    $("#right-component").removeClass('closed').removeClass('minimized-r').addClass('maximized-r');
	$('div.split-pane').splitPane('firstComponentSize', 0);
    removeFastDrag();
}

function clearDashboardSelectedSensors() {
	$("#sensors-charts").empty().replaceWith('<div id="sensors-charts"></div>');
}

var sliderListener = function() {
    $('div.split-pane').splitPane();

    addFastDrag = function() {
        $("div .split-pane-divider").addClass("fast-drag");
        $("div .split-pane-component").addClass("fast-drag");
    };

    removeFastDrag = function () {
        $("div .split-pane-divider").removeClass("fast-drag");
        $("div .split-pane-component").removeClass("fast-drag");
    };

    // TODO: Check mouseup alternative
    $("#my-divider").on("mousedown", addFastDrag);
};

$(document).ready(function() {
    sliderListener();
    closeToolbar(); //This ensures the proper initial state

    //Init Switch
    $("[name='average-checkbox']").bootstrapSwitch();

    //Init datepicker
    $('#datepicker').datepicker({endDate: "today", todayBtn: "linked"});

    //TODO: Check handheld threshhold from css
    $(window).resize(function() {
        if ($(window).width() < 845) {
            if (sidebarState != "closed") {
                closeToolbar();
            }
        }
    });

	$(".nav-tabs a").click(function() {
		$(this).tab('show');
	});

    $('button[id="maximize"]').on('click', function (e) {
        removeFastDrag();
        maximizeToolbar();
    });

    $('button[id="close"]').on('click', function (e) {
        removeFastDrag();
        closeToolbar();
    });
});