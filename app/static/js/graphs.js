//Global vars
var indexSite;
var sites = [];
var dygraphs = {};

// Helper functions
var helperFunctions = {
    /*
     * Returns true of rangeA fully contains rangeB
     */
    datePeriodContains: function(rangeA, rangeB) {
        console.log("rangeA: " + rangeA + ", rangeB: " + rangeB);
        return rangeB[0] >= rangeA[0] && rangeB[1] <= rangeA[1];
    },
    /*
     * Returns the parts of rangeB not contained in rangeA
     */
    getExcludedDatePeriods: function (rangeA, rangeB) {
        var excludedDatePeriods = [];
        if (!helperFunctions.datePeriodContains(rangeA, rangeB)) {
            if (rangeA[0] > rangeB[0])
                excludedDatePeriods.push = [rangeB[0], rangeA[0]];
            if (rangeA[1] < rangeB[1])
                excludedDatePeriods.push = [rangeA[1], rangeB[1]];
        }
        return excludedDatePeriods;
    },
    toArrayOfArrays: function(arrayOfObjects) {
        return $.map(arrayOfObjects, function(value, index) {
            return [value];
        });
    },
    getIndexSite: function() {
        for (s in sites) {
            if (sites[s]._id === indexSite)
                return sites[s];
        }
        return null;
    },
    call: function(fn) {
        fn();
    },
    concatenateUrlAndParams: function(url, requestParams) {
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
};

// Sensor Class
function Sensor() {
    this._id = "";
    this.name = "";
    this.description = "";
    this.labels = [];
    this.data = [];
}

Sensor.prototype.getData = function () {
    return this.data;
};

Sensor.prototype.setData = function (data) {
    this.data = data;
};

Sensor.prototype.addData = function (newData) {
    jQuery.extend(this.data, newData);
};

//TODO: test if null causes problems in date filtering.. so far it works
Sensor.prototype.getDateRange = function () {
  return this.data.length ? [this.data[this.data.length - 1].timeValue, this.data[0].timeValue]: null;
};

// Site Class
function Site() {
    this._id = "";
    this.name = "";
    this.description = "";
    this.sensors = [];
}

Site.prototype.addSensor = function (sensorID) {
    this.sensors.push(parseInt(sensorID));
};

Site.prototype.getSensorById = function (sensorId) {
    return $.grep(this.sensors, function(e){ return e._id == sensorId; })[0];
};

// DygraphPlotter Class
function DygraphPlotter() {
    this.dataProvider = new DygraphDataProvider();
    this.wrapperElement = "";
    this.dygraphWrapper = "";
    this.divElement = "";
    this.plotHTML = "";
    this.toolbar = "<div class=\"row\">\n    <div class=\"dygraph-toolbar col-xs-10 text-center\">\n        <h4>Data Level:</h4>\n        <div class=\"btn-group\" role=\"group\" aria-label=\"...\">\n            <button name=\"hour\" type=\"button\" class=\"btn btn-default btn-responsive\">Hour</button>\n            <button name=\"day\" type=\"button\" class=\"btn btn-default btn-responsive\">Day</button>\n            <button name=\"week\" type=\"button\" class=\"btn btn-default btn-responsive\">Week</button>\n            <button name=\"month\" type=\"button\" class=\"btn btn-default btn-responsive\">Month</button>\n            <button name=\"full\" type=\"button\" class=\"btn btn-default btn-responsive\">Reset</button>\n        </div>\n        <h4>Move:</h4>\n        <div class=\"btn-group\" role=\"group\" aria-label=\"...\">\n            <button name=\"left\" type=\"button\" class=\"btn btn-default btn-responsive\">\n                <span class=\"glyphicon glyphicon-circle-arrow-left\" aria-hidden=\"true\"></span></button>\n            <button name=\"right\" type=\"button\" class=\"btn btn-default btn-responsive\">\n                <span class=\"glyphicon glyphicon-circle-arrow-right\" aria-hidden=\"true\"></span>\n            </button>\n        </div>\n    </div>\n</div>";
    this.hasVisibletoolbar = true;
    this.hasVisibleSpinner = true;
    this.plotParams = {
        // "labels" : ["Time","a","b","c","d","e","f","g","h","i","j","k","l"],
        // "connectSeparatedPoints": true,
        "rollPeriod": 15,
        "showLabelsOnHighlight": true,
        "highlightSeriesOpts": {
//		strokeBorderWidth: 1.2,
//		"strokeWidth": 1.4,
//		"highlightCircleSize": 5
        },
        "labelsDivStyles": {
            'text-align': 'right',
            'background': 'none'
        },
        axes: {
//		y2: {"valueRange": [0, 30]}
        },
        "drawPoints": false, //Making this true really affects the performance
        "title": "Test",
        "showRoller": false,
        "showRangeSelector": true,
        "fillGraph": false,
        "legend": 'always',
        "ylabel": '',
        "labelsDivWidth": 150,
        "labelsSeparateLines": true,
        "labelsUTC": true,
        labelsDiv: document.getElementById('status')
//	"valueRange": [],
    };
    this.dataToPlot = "";
}

DygraphPlotter.prototype.setWrapperElement = function (wrapperElement) {
  this.wrapperElement = wrapperElement;
};

DygraphPlotter.prototype.updatePlotHTML = function () {
    if (this.hasVisibletoolbar)
        this.plotHTML = "<form id=\"" + this.dygraphWrapper + "\" class=\"text-center dygraph-plot-and-toolbar-wrapper\">\n    <div class=\"row dygraph-plot-row-wrapper\">\n        <div class=\"col-xs-12 text-center\">\n            <div class=\"row\">\n                <div class=\"col-xs-10 text-center graph-container\">\n                    <div id=\"" + this.divElement + "\" class=\"dygraph-plot\" style=\"width:100%\"></div>\n                </div>\n                <div id=\"" + this.plotParams.labelsDiv + "\" class=\"dygraph-legend col-xs-2 text-left\"></div>\n            </div>\n            " + this.toolbar + "\n        </div>\n    </div>\n</form>";
    else
        this.plotHTML = "<form id=\"" + this.dygraphWrapper + "\" class=\"text-center dygraph-plot-and-toolbar-wrapper\">\n    <div class=\"row dygraph-plot-row-wrapper\">\n        <div class=\"col-xs-12 text-center\">\n            <div class=\"row\">\n                <div class=\"col-xs-10 text-center graph-container\">\n                    <div id=\"" + this.divElement + "\" class=\"dygraph-plot\" style=\"width:100%\"></div>\n                </div>\n                <div id=\"" + this.plotParams.labelsDiv + "\" class=\"dygraph-legend col-xs-2 text-left\"></div>\n            </div>\n        </div>\n    </div>\n</form>";
};

DygraphPlotter.prototype.setDivElement = function (divElement) {
    this.plotParams.labelsDiv = document.getElementById('legend-' + divElement);
    this.dygraphWrapper = "#dygraph-plot-and-toolbar-wrapper-" + divElement;
    this.divElement = divElement;
    this.updatePlotHTML();
};

DygraphPlotter.prototype.appendHTML = function() {
    $(this.dygraphWrapper).remove();
    $('#' + this.wrapperElement).append(this.plotHTML);
    adjustDygraphsPlotAreaHTMLonResize();
};

DygraphPlotter.prototype.plot = function () {
    //TODO: Check the following: may be undifined
    params.labelsDiv = document.getElementById('legend-' + this.divElement);
    dygraphs[divElement] = new Dygraph(document.getElementById(this.divElement), this.data, this.plotParams);
    dygraphs[divElement].resize();
};

DygraphPlotter.prototype._requestData = function () {
    this.showSpinner();
    // this.graphDataProvider.loadData("Series-A", null, null, this.detailStartDateTm, this.detailEndDateTm, this.$graphCont.width());
};

DygraphPlotter.prototype.showSpinner = function () {
    if (this.hasVisibleSpinner === true) {
        if (this.spinner == null) {
            var opts = {
                lines: 15 // The number of lines to draw
                , length: 6 // The length of each line
                , width: 14 // The line thickness
                , radius: 32 // The radius of the inner circle
                , scale: 0.75 // Scales overall size of the spinner
                , corners: 0.6 // Corner roundness (0..1)
                , color: '#000' // #rgb or #rrggbb or array of colors
                , opacity: 0.4 // Opacity of the lines
                , rotate: 0 // The rotation offset
                , direction: 1 // 1: clockwise, -1: counterclockwise
                , speed: 1 // Rounds per second
                , trail: 100 // Afterglow percentage
                , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
                , zIndex: 2e9 // The z-index (defaults to 2000000000)
                , className: 'spinner' // The CSS class to assign to the spinner
                , top: '50%' // Top position relative to parent
                , left: '50%' // Left position relative to parent
                , shadow: false // Whether to render a shadow
                , hwaccel: false // Whether to use hardware acceleration
                , position: 'absolute' // Element positioning
            };
            var target = document.getElementById(this.dygraphWrapper);
            this.spinner = new Spinner(opts);
            this.spinner.spin(target);
            this.spinnerIsSpinning = true;
        } else {
            if (this.spinnerIsSpinning === false) { //else already spinning
                this.spinner.spin(this.divElement);
                this.spinnerIsSpinning = true;
            }
        }
    } else if (this.spinner != null && this.hasVisibleSpinner === false) {
        this.spinner.stop();
        this.spinnerIsSpinning = false;
    }
};

DygraphPlotter.prototype.stopSpinner = function () {
    console.log('test spinner');
    if (this.spinner != undefined)
        this.spinner.stop();
};


// DygraphDataProvider class
function DygraphDataProvider() {
    this.dataCallbacks = $.Callbacks();
    this.lastRangeReqNum = null;
}

DygraphDataProvider.prototype.load = function (sensorIds, dateWindow) {
    var requestParams = {
        "key": "z5ywCWZ4rLh3lu*3i234StqF"
    };
    for (sId in sensorIds) {
        requestParams.dataStreamId = sensorIdsensorIds[sId];
        this.makeRequest("/getDataStream/", requestParams);
        // if (sites[indexSite].getSensor(sensorIds[sensorId]).
    }
};

DygraphDataProvider.prototype.makeRequest = function (url, params) {

    var indexSensor = helperFunctions.getIndexSite().getSensorById(params.dataStreamId);

    //Data is already there for the requested date period
    if (indexSensor.data.length && helperFunctions.datePeriodContains(indexSensor.getDateRange(),
            [params.periodFrom, params.periodTo])) {
        console.log("RESOLVED");
        return $.Deferred().resolve();
    }
    else {
        //There is already some data. Get the excluded dates
        if (indexSensor.data.length) {
            var excludedDatesToRequest = helperFunctions.getExcludedDatePeriods(indexSensor.getDateRange(),
                [params.periodFrom, params.periodTo]);

            if (excludedDatesToRequest.length) {
                params.PeriodFrom = excludedDatesToRequest[0][0];
                params.PeriodTo = excludedDatesToRequest[0][1];
                if (excludedDatesToRequest[1] != undefined) {
                    params.rPeriodFrom = excludedDatesToRequest[1][0];
                    params.rPeriodTo = excludedDatesToRequest[1][1];
                }
            }
        }
        return $.ajax({
            url: helperFunctions.concatenateUrlAndParams(url, params),
            dataType: "json",
            success: function (response) {

                helperFunctions.getIndexSite().getSensorById(params.dataStreamId).data = response.items;
                // console.log(helperFunctions.getIndexSite().getSensorById(params.dataStreamId));
            }
        });
    }
};

DygraphDataProvider.prototype.generateRequests = function (ids, dateWindow) {
    // var requests = [
    //     new this.makeRequest("/getDataStream?dataStreamId=18704"),
    //     new this.makeRequest("/getDataStream?dataStreamId=18711"),
    //     new this.makeRequest("/getDataStream?dataStreamId=18718")
    // ];
    var requests = [];
    for (var id in ids) {
        requests.push(new this.makeRequest("/getDataStream",
            {"dataStreamId": ids[id], "periodFrom": dateWindow.periodFrom, "periodTo": dateWindow.periodTo}));
    }
    return requests;
};

DygraphDataProvider.prototype.onDoneFetchingData = function (ids, dateWindow, dataHandlingFunctions) {
    $.when.apply($, this.generateRequests(ids, dateWindow)).done(function() {
        dataHandlingFunctions.forEach(helperFunctions.call);
    });
};

DygraphDataProvider.prototype.toDygraphPlotData = function () {};

DygraphDataProvider.prototype.toDygraphPlotAvergeData = function () {};

// Dygraph Plot Toolbar buttons handlers
var dygraphToolbar = {
    desired_range: null,
    approach_range: function (graph) {
        graph.updateOptions({dateWindow: desired_range});
    },
    zoom: function(graph, res) {
        var w = graph.xAxisRange();
        desired_range = [ w[0], w[0] + res * 1000 ];
        dygraphToolbar.approach_range(graph);
    },
    reset: function(graph) {
        graph.resetZoom();
    },
    pan: function(graph, dir) {
        var w = graph.xAxisRange();
        var scale = w[1] - w[0];
        var amount = scale * 1 * dir; // 1 is the percentage to shift
        desired_range = [ w[0] + amount, w[1] + amount ];
        dygraphToolbar.approach_range(graph);
    },
    addDygraphsToolbarListener: function() {
        $('body').on('click', 'button[name="hour"]', function () {
            dygraphToolbar.zoom(dygraphs[$(this).closest("form").find("div.dygraph-plot").attr('id')], 3600);
        }).on('click', 'button[name="day"]', function () {
            dygraphToolbar.zoom(dygraphs[$(this).closest("form").find("div.dygraph-plot").attr('id')], 86400);
        }).on('click', 'button[name="week"]', function () {
            dygraphToolbar.zoom(dygraphs[$(this).closest("form").find("div.dygraph-plot").attr('id')], 604800);
        }).on('click', 'button[name="month"]', function () {
            dygraphToolbar.zoom(dygraphs[$(this).closest("form").find("div.dygraph-plot").attr('id')], 604830 * 8640000);
        }).on('click', 'button[name="full"]', function () {
            dygraphToolbar.reset(dygraphs[$(this).closest("form").find("div.dygraph-plot").attr('id')]);
        }).on('click', 'button[name="left"]', function () {
            dygraphToolbar.pan(dygraphs[$(this).closest("form").find("div.dygraph-plot").attr('id')], -1);
        }).on('click', 'button[name="right"]', function () {
            dygraphToolbar.pan(dygraphs[$(this).closest("form").find("div.dygraph-plot").attr('id')], 1);
        });
    }
};



// Dygraph options
var gWidthRatioWhenMaximized = 0.7;
var gWidthRatioWhenMinimized = 1;
var gHeightRatioWhenMaximized = 0.3;
var gHeightRatioWhenMinimized = 0.9;

var dygraphParams = {
    // "labels" : ["Time","a","b","c","d","e","f","g","h","i","j","k","l"],
    // "connectSeparatedPoints": true,
    "rollPeriod": 15,
    "showLabelsOnHighlight": true,
    "highlightSeriesOpts": {
//		strokeBorderWidth: 1.2,
//		"strokeWidth": 1.4,
//		"highlightCircleSize": 5
    },
    "labelsDivStyles": {
        'text-align': 'right',
        'background': 'none'
    },
    axes: {
//		y2: {"valueRange": [0, 30]}
    },
    "drawPoints": false, //Making this true really affects the performance
    "title": "Test",
    "showRoller": false,
    "showRangeSelector": true,
    "fillGraph": false,
    "legend": 'always',
    "ylabel": '',
    "labelsDivWidth": 150,
    "labelsSeparateLines": true,
    "labelsUTC": true,
    labelsDiv: document.getElementById('status')
//	"valueRange": [],
};

var pages = 0;
var totalCount = 0;

/*Quadrants*/
var localFetchMode = true;

var streams = [
	{streamId: 18704, name: "quad-1_probe-1", quad: "1", probe: "1", labels: ["Date", "Cubic Meters"], data: ""},
	{streamId: 18711, name: "quad-1_probe-2", quad: "1", probe: "2", labels: ["Date", "Cubic Meters"], data: ""},
	{streamId: 18762, name: "quad-1_temperature-1", quad: "1", labels: ["Date", "Temperature C"], data: ""},

	{streamId: 18718, name: "quad-2_probe-1", quad: "2", probe: "1", labels: ["Date", "Cubic Meters"], data: ""},
	{streamId: 18725, name: "quad-2_probe-2", quad: "2", probe: "2", labels: ["Date", "Cubic Meters"], data: ""},
	{streamId: 18767, name: "quad-2_temperature-1", quad: "2", labels: ["Date", "Temperature C"], data: ""},

	{streamId: 18732, name: "quad-3_probe-1", quad: "3", probe: "1", labels: ["Date", "Cubic Meters"], data: ""},
	{streamId: 18739, name: "quad-3_probe-2", quad: "3", probe: "2", labels: ["Date", "Cubic Meters"], data: ""},
	{streamId: 18772, name: "quad-3_temperature-1", quad: "3", labels: ["Date", "Temperature C"], data: ""},

	{streamId: 18746, name: "quad-4_probe-1", quad: "4", probe: "1", labels: ["Date", "Cubic Meters"], data: ""},
	{streamId: 18753, name: "quad-4_probe-2", quad: "4", probe: "2", labels: ["Date", "Cubic Meters"], data: ""},
	{streamId: 18777, name: "quad-4_temperature-1", quad: "4", labels: ["Date", "Temperature C"], data: ""}
];


/*
 * Make ajax call and store result to siteData
*/
function getStreamData(siteData, url, requestParams) {
	//startLoading();
//	setTimeout(function(){ stopLoading(); }, 1000);

	if (localFetchMode === true) {
		var url_ = helperFunctions.concatenateUrlAndParams("/getDataStream/", requestParams);
		$.ajax({
			url: url_,
			dataType: "json"
		}).done(function (data) {
			$.each(data.items, function (i, item) {
				siteData.data += item.timeValue + ',' + item.value + '\n';
			});
		});
	} else {
		var url_ = helperFunctions.concatenateUrlAndParams(url, requestParams)
		$.ajax({
			url: url_,
			dataType: "json"
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

function showGraphof(site, divElement) {
	if (divElement === undefined) {
		divElement = site.name;
	}
		//$(divElement).empty();

	if (dygraphs[divElement] === undefined) {

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

		dygraphs[divElement] = new Dygraph(document.getElementById(divElement), site.data, {
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
//			dygraphs[divElement].width_ = 100;
//			dygraphs[divElement].height_ = 100;
		}
		else if (sidebarState.localeCompare("maximized") == 0)  {
			resizeGraphs(gWidthRatioWhenMaximized, gHeightRatioWhenMaximized);
//			dygraphs[divElement].width = 500;
//			dygraphs[divElement].height = 500;
		}
	}
}

function resizeGraphs(x, y) {
	setTimeout(function() {
		for (var gKey in dygraphs) {
			dygraphs[gKey].resize();
//			dygraphs[gKey].resize($("#"+gKey).parent().width() * x, $("#"+gKey).parent().width() * y);
		}}, 200);
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

function getStreamByID(id) {
	var results = $.grep(streams, function(e){ return e.streamId === id; });
	return (results.length === 0) ? null : results[0];
}

function getStreamByName(name) {
	var results = $.grep(streams, function(e){ return e.name === name; });
	return (results.length === 0) ? null : results[0];
}

function resetCounters() {
	pages = 0;
    totalCount = 0;
}

function reduceData(strData, numOfLines, rev) {
	lines = 0;
	if (rev) {
		downTo = 0;
		for (var i = strData.length; i > 0; i--) {
			if (lines == numOfLines) {
				downTo = i;
				break;
			}
			if (strData[i] === "\n")
				lines ++;
		}
		return strData.substring(downTo+2, strData.length);
	} else {
		upTo = strData.lenght;
		for (var i in strData) {
			if (lines == numOfLines) {
				upTo = i;
				break;
			}
			if (strData[i] === "\n")
				lines ++;
		}
		return strData.substring(0, upTo-1);
	}
}

function populateLastMetricsTab() {
    var g = new DygraphPlotter();
    g.plotParams.title = "Latest captured data for Soil Moisture Probes";
    g.plotParams.labels = ['Time', 'Moisture', 'Temperature (C)'];
    g.plotParams.ylabel = 'Moisture';
    g.plotParams.y2label = 'Temperature';
    g.plotParams.series = {};
    g.plotParams.series["Temperature (C)"] = {axis: 'y2'};
    g.plotParams.connectSeparatedPoints = true;
    g.plotParams.labelsSeparateLines = true;
    g.plotParams.customBars = true;
    g.plotParams.highlightSeriesOpts = '';
    g.plotParams.dateWindow = [Date.parse("2016/03/01"), Date.parse("2016-03-02")];
    g.hasVisibletoolbar = false;
    g.setWrapperElement("LMetrics");
    g.setDivElement("l-metrics");
    g.appendHTML();
    g.showSpinner();

    // var sensorsInGraph = [18704,
    //                     // 18711,
    //                     // 18718,
    //                     // 18725,
    //                     // 18732,
    //                     // 18739,
    //                     // 18746,
    //                     18753
    //                     ];

    var sensorsInGraph = [16293];

    var dateWindow = [];

    g.dataProvider.onDoneFetchingData(sensorsInGraph, {periodFrom: "2016-04-07T00:00:00", periodTo: "2016-04-08T00:00:00"},
        [function() {return test("callback1");},
        function() {return test("callback2");},
        function() {return g.stopSpinner();}
    ]);

    //
    //
    // var probesData = [];
    // var probesLabels = ['Time'];
    //
    // var quadrants = ["quad-1", "quad-2", "quad-3", "quad-4"];
    // var probes = ["probe-1", "probe-2"];
    //
    // for(var q in quadrants) {
		// for (var p in probes) {
		// 	console.log(quadrants[q] + "_" + probes[p]);
		// 	probesData.push(getStreamByName(quadrants[q] + "_" + probes[p]).data);
		// 	probesLabels.push(getStreamByName(quadrants[q] + "_" + probes[p]).name);
		// }
    // }
    //
    // var temperaturesData = [];
    // var temperatureLabels = ['Time'];
    // var temperatures = ["temperature-1"];
    //
    // for(q in quadrants) {
		// for (var t in temperatures) {
		// 	console.log(quadrants[q] + "_" + temperatures[t]);
		// 	temperaturesData.push(getStreamByName(quadrants[q] + "_" + temperatures[t]).data);
		// 	temperatureLabels.push(getStreamByName(quadrants[q] + "_" + temperatures[t]).name);
		// }
    // }
    //
    // console.log(probesData);
    // var d1 = getAverageData(probesData);
    // var d2 = getAverageData(temperaturesData);
    // var dataToPlot = aggregateDataMod([d1, d2]);


	// dataToPlot = reduceData(dataToPlot, 4000, true);

	// dygraphPlotLM("LMetrics", 'l-metrics', dataToPlot, g.plotParams);
}

function test(a) {
    console.log(a);
}

function generateMixedGraphs() {
    $("#plot-area").empty();

	var quadrants = [];
	var probes = [];
	var temperatures = [];
    var viewMode = $('input[name="view-mode"]:checked').val();
    var showAverages = $('input[name="average-checkbox"]').bootstrapSwitch('state');
    var startDate = $('#datepicker').find('input[name="start"]').datepicker("getDate");
    var endDate = $('#datepicker').find('input[name="end"]').datepicker("getDate");

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

	// // Test
	// var data1 = "2016-02-10T15:56:03.7783794,5\n" +
	// 			"2016-02-10T15:57:10.4915719,5\n" +
	// 			"2016-02-10T15:55:10.4915719,5\n" +
	// 			"2016-02-10T15:54:10.4915719,5\n" +
	// 			"2016-02-10T15:53:10.4915719,5\n" +
	// 			"2016-02-10T15:52:10.4915719,5\n" +
	// 			"2016-02-10T15:51:03.1974357,5";
    //
	// var data2 = "2016-02-10T15:56:03.7783794,10\n" +
	// 			"2016-02-10T15:57:10.4915719,10\n" +
	// 			"2016-02-10T15:50:10.4915719,10\n" +
	// 			"2016-02-10T15:52:10.4915719,10\n" +
	// 			"2016-02-10T15:59:10.4915719,10\n" +
	// 			"2016-02-10T15:49:10.4915719,10\n" +
	// 			"2016-02-10T15:51:03.1974357,10";
    //
	// var data3 = "2016-02-10T15:56:03.7783794,15\n" +
	// 			"2016-02-10T15:57:10.4915719,15\n" +
	// 			"2016-02-10T15:50:10.4915719,15\n" +
	// 			"2016-02-10T15:52:10.4915719,15\n" +
	// 			"2016-02-10T15:59:10.4915719,15\n" +
	// 			"2016-02-10T15:49:10.4915719,15\n" +
	// 			"2016-02-10T15:51:03.1974357,15";
    //
	// var data4 = "2016-02-10T15:56:03.7783794,20\n" +
	// 			"2016-02-10T15:57:10.4915719,20\n" +
	// 			"2016-02-10T15:50:10.4915719,20\n" +
	// 			"2016-02-10T15:52:10.4915719,20\n" +
	// 			"2016-02-10T15:59:10.4915719,20\n" +
	// 			"2016-02-10T15:49:10.4915719,20\n" +
	// 			"2016-02-10T15:51:03.1974357,20";

	var probesData = [];
	for(var q in quadrants) {
		for (var p in probes) {
			console.log(quadrants[q] + "_" + probes[p]);
			probesData.push(getStreamByName(quadrants[q] + "_" + probes[p]).data);
			probeLabels.push(getStreamByName(quadrants[q] + "_" + probes[p]).name);
		}
	}

	var temperaturesData = [];
	for(var q in quadrants) {
		for (var t in temperatures) {
			console.log(quadrants[q] + "_" + temperatures[t]);
			temperaturesData.push(getStreamByName(quadrants[q] + "_" + temperatures[t]).data);
			temperatureLabels.push(getStreamByName(quadrants[q] + "_" + temperatures[t]).name);
		}
	}

	var params = jQuery.extend({}, dygraphParams);

	if (viewMode === "combined") {

		if(probesData.length > 0 || temperaturesData.length > 0) {
            params.title = "Combined";
            params.connectSeparatedPoints = true;
            params.labelsSeparateLines = true;
            params.series = {};
            params.ylabel = 'Moisture';
            params.y2label = 'Temperature';

            if (showAverages === true) {
                var d1 = getAverageData(probesData);
                var d2 = getAverageData(temperaturesData);
                dataToPlot = aggregateDataMod([d1, d2]);
                params.labels = ['Time', 'Moisture', 'Temperature (C)'];
                params.series['Temperature (C)'] = {axis: 'y2'};
                params.customBars = true;
                params.highlightSeriesOpts = '';
            } else {
                var dataToPlot = aggregateDataMod(probesData.concat(temperaturesData)),
                    temperatureSeries = temperatureLabels.slice(1, temperatureLabels.length);
                params.labels = probeLabels.concat(temperatureSeries);
                for (var l in temperatureSeries) params.series[temperatureSeries[l]] = {axis: 'y2'};
            }
            dygraphPlot('plot-area', 'mixed-probes', dataToPlot, params);
		}
	} else {
		if(probesData.length > 0) {
	//		var testData = [];
	//		testData.push(data1);
	//		testData.push(data2);
	//		testData.push(data3);
	//		testData.push(data4);

            var dataToPlot;

			params.title = "Soil Moisture Probes";
            if (showAverages === true) {
                dataToPlot = getAverageData(probesData);
                params.labels = ['Time', 'Moisture'];
                params.customBars = true;
                params.highlightSeriesOpts = '';
            }
            else {
                start2 = performance.now();
                dataToPlot = aggregateDataMod(probesData);
                var end2 = performance.now();
                var duration2 = end2 - start2;
                console.log("New: " + duration2);
                params.labels = probeLabels;
            }
			// console.log("Rows: " + dataToPlot.split("\n").length + 1);
	//		dataToPlot = reduceData(dataToPlot, 10000, true);
			dygraphPlot('plot-area', 'mixed-probes', dataToPlot, params);
		}

		if(temperaturesData.length > 0) {
            params.title = "Temperature";
            var dataToPlot;
            if (showAverages === true) {
                dataToPlot = getAverageData(temperaturesData);
                params.labels = ['Time', 'Temperature (C)'];
                params.customBars = true;
                params.highlightSeriesOpts = '';
            } else {
                dataToPlot = aggregateDataMod(temperaturesData);
                params.labels = temperatureLabels;
            }
			dygraphPlot('plot-area', 'mixed-temperatures', dataToPlot, params);
		}

        if (viewMode === "synchronized") {
            var synchedDygraphs = [];
            if ('mixed-probes' in dygraphs) {
                synchedDygraphs.push(dygraphs['mixed-probes']);
            }
            if ('mixed-temperatures' in dygraphs) {
                synchedDygraphs.push(dygraphs['mixed-temperatures']);
            }
            console.log(synchedDygraphs);
            if (synchedDygraphs.length > 1) {
                Dygraph.synchronize(synchedDygraphs);
            }
        }
	}
}

function dygraphPlot(wrapperElm, divElement, data, params) {
    var dygraphToolbar = '<div class="dygraph-toolbar text-center">\n    <b>Data Level:</b>\n    <div class="btn-group" role="group" aria-label="...">\n        <button name="hour" type="button" class="btn btn-default btn-responsive">Hour</button>\n        <button name="day" type="button" class="btn btn-default btn-responsive">Day</button>\n        <button name="week" type="button" class="btn btn-default btn-responsive">Week</button>\n        <button name="month" type="button" class="btn btn-default btn-responsive">Month</button>\n        <button name="full" type="button" class="btn btn-default btn-responsive">Reset</button>\n    </div>\n    <b>Move:</b>\n    <div class="btn-group" role="group" aria-label="...">\n        <button name="left" type="button" class="btn btn-default btn-responsive">\n            <span class="glyphicon glyphicon-circle-arrow-left" aria-hidden="true"></span></button>\n        <button name="right" type="button" class="btn btn-default btn-responsive">\n            <span class="glyphicon glyphicon-circle-arrow-right" aria-hidden="true"></span>\n        </button>\n    </div>\n</div>';
    var htmlFragment = "<form id=\"dygraph-plot-and-toolbar-wrapper-" + divElement + "\" class=\"text-center dygraph-plot-and-toolbar-wrapper\">\n    <div class=\"row dygraph-plot-row-wrapper\">\n        <div class=\"col-xs-12 text-center\">\n            <div class=\"row\">\n                <div class=\"col-xs-10 text-center graph-container\">\n                    <div id=\"" + divElement + "\" class=\"dygraph-plot\" style=\"width:100%\"></div>\n                </div>\n                <div id=\"legend-" + divElement + "\" class=\"dygraph-legend col-xs-2 text-left\"></div>\n            </div>\n            <div class=\"row\">\n                <div class=\"dygraph-toolbar col-xs-10 text-center\">\n                <h4>Data Level:</h4>\n                <div class=\"btn-group\" role=\"group\" aria-label=\"...\">\n                    <button name=\"hour\" type=\"button\" class=\"btn btn-default btn-responsive\">Hour</button>\n                    <button name=\"day\" type=\"button\" class=\"btn btn-default btn-responsive\">Day</button>\n                    <button name=\"week\" type=\"button\" class=\"btn btn-default btn-responsive\">Week</button>\n                    <button name=\"month\" type=\"button\" class=\"btn btn-default btn-responsive\">Month</button>\n                    <button name=\"full\" type=\"button\" class=\"btn btn-default btn-responsive\">Reset</button>\n                </div>\n                <h4>Move:</h4>\n                <div class=\"btn-group\" role=\"group\" aria-label=\"...\">\n                    <button name=\"left\" type=\"button\" class=\"btn btn-default btn-responsive\">\n                        <span class=\"glyphicon glyphicon-circle-arrow-left\" aria-hidden=\"true\"></span></button>\n                    <button name=\"right\" type=\"button\" class=\"btn btn-default btn-responsive\">\n                        <span class=\"glyphicon glyphicon-circle-arrow-right\" aria-hidden=\"true\"></span>\n                    </button>\n                </div>\n            </div>\n            </div>\n        </div>\n    </div>\n</form>";
    $("#dygraph-plot-and-toolbar-wrapper-" + divElement).remove();
    $('#' + wrapperElm).append(htmlFragment);

    adjustDygraphsPlotAreaHTMLonResize();

    params.labelsDiv = document.getElementById('legend-' + divElement);
	dygraphs[divElement] = new Dygraph(document.getElementById(divElement), data, params);
	dygraphs[divElement].resize();
}

//TODO: remove this function and embed in dygraphPlot
function dygraphPlotLM(wrapperElm, divElement, data, params) {
    var htmlFragment = "<form id=\"dygraph-plot-and-toolbar-wrapper-" + divElement + "\" class=\"text-center dygraph-plot-and-toolbar-wrapper\">\n    <div class=\"row dygraph-plot-row-wrapper\">\n        <div class=\"col-xs-12 text-center\">\n            <div class=\"row\">\n                <div class=\"col-xs-9 text-center graph-container\">\n                    <div id=\"" + divElement + "\" class=\"dygraph-plot\" style=\"width:100%\"></div>\n                </div>\n                <div id=\"legend-" + divElement + "\" class=\"dygraph-legend col-xs-3 text-left\"></div>\n            </div>\n        </div>\n    </div>\n</form>";
    $("#dygraph-plot-and-toolbar-wrapper-" + divElement).remove();
    $('#' + wrapperElm).append(htmlFragment);

    params.labelsDiv = document.getElementById('legend-' + divElement);
    dygraphs[divElement] = new Dygraph(document.getElementById(divElement), data, params);
    dygraphs[divElement].resize();
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

function getAverageData(dataStreams) {
    var dataHashMap = {};
    var values = [];

    for (var i = 0; i < dataStreams.length; i++) {
        values.push("");
    }

    for (var i = 0; i < dataStreams.length; i++) {

        var dataArray = dataStreams[i].split("\n");

        // Check if the last element is empty
        if (dataArray[dataArray.length - 1].split(",").length === 1) {
            dataArray = dataArray.slice(0, dataArray.length - 1);
        }

        // Populate hashmap
        for (var d = 0; d < dataArray.length; d++) {

            var sp = dataArray[d].split(",");
            key = sp[0], val = sp[1];

            if (key !== "") {
                if (dataHashMap[key] != undefined) {
                    dataHashMap[key][i] = val;
                    // console.log("Updated at: " + key + " the val: " + val);
                } else {
                    dataHashMap[key] = [].concat(values);
                    dataHashMap[key][i] = val;
                    // console.log("inserted at: " + key + " the val: " + val);
                }
            }
            else
                console.log("Problem at : " + d + " elemnt: " + dataArray[d]);
        }
    }

    var dataToPlot = "";
    var sorted_keys = [];

    for (k in dataHashMap) {
        sorted_keys.push(k);
    }
    sorted_keys.sort();

    // Fill empty columns in merged hashmap
    for (var i = 0; i < dataStreams.length; i++) {
        var previous, next, nxtIndx ;
        for (var k = 0; k < sorted_keys.length; k++) {
            var key = sorted_keys[k];
            if (!isNaN(parseFloat(dataHashMap[key][i]))) {
                previous = parseFloat(dataHashMap[key][i]);
            } else {
                nxtIndx = (k < sorted_keys.length - 1) ? k + 1 : k;
                while ((nxtIndx < sorted_keys.length - 1) && isNaN(parseFloat(dataHashMap[sorted_keys[nxtIndx]][i]))) {
                    nxtIndx ++;
                }
                next = parseFloat(dataHashMap[sorted_keys[nxtIndx]][i]);
                if (!isNaN(parseFloat(previous)) && !isNaN(parseFloat(next)))
                    dataHashMap[key][i] = (previous + next) / 2;
                else if (!isNaN(parseFloat(previous)))
                    dataHashMap[key][i] = previous;
                else if (!isNaN(parseFloat(next)))
                    dataHashMap[key][i] = next;
            }
        }
    }

    var averages = {};

    // Averages
    for (var k in dataHashMap) {
        var average = NaN, sum = 0, numOfElements = 0, max = Number.NEGATIVE_INFINITY, min = Number.POSITIVE_INFINITY;

        for (var i = 0; i < dataStreams.length; i++) {
            var val = parseFloat(dataHashMap[k][i]);
            if (!isNaN(val)) {
                if (val > max) max = val;
                if (val < min) min = val;
                sum += val;
                numOfElements ++;
            }
        }
        if (numOfElements > 0)
            average = sum / numOfElements;
        averages[k] = [min, average, max];
    }

    for (k in sorted_keys) {
        var key = sorted_keys[k];
        dataToPlot += key + "," + averages[key].join(';') + "\n";
    }

    dataToPlot = dataToPlot.substr(0, dataToPlot.length - 1);
    return dataToPlot;
}

function mergeDataSeries(dataSeries) {

}

/*
    gets a list [] of of arrays [[k, v], [k, v], ... ]
 */
function aggregateDataMod(dataStreams) {

	var dataHashMap = {};
	var values = [];

    for (var i = 0; i < dataStreams.length; i++) {
        values.push("");
    }

	for (var i = 0; i < dataStreams.length; i++) {

		var dataArray = dataStreams[i].split("\n");

    	// Check if the last element is empty
    	if (dataArray[dataArray.length - 1].split(",").length === 1) {
    		dataArray = dataArray.slice(0, dataArray.length - 1);
    	}

    	// Populate hashmap
    	for (var d = 0; d < dataArray.length; d++) {

    		var sp = dataArray[d].split(",");
    		key = sp[0], val = sp[1];

    		if (key !== "") {
    			if (dataHashMap[key] != undefined) {
    				dataHashMap[key][i] = val;
    				// console.log("Updated at: " + key + " the val: " + val);
    			} else {
    				dataHashMap[key] = [].concat(values);
    				dataHashMap[key][i] = val;
    				// console.log("inserted at: " + key + " the val: " + val);
    			}
    		}
    		else
    			console.log("Problem at : " + d + " elemnt: " + dataArray[d]);
    	}
	}

	var dataToPlot = "";
	var sorted_keys = [];

	for (k in dataHashMap) {
		sorted_keys.push(k);
//		dataToPlot += k + "," + dataHashMap[k].join() + "\n";
	}

	sorted_keys.sort();

	for (k in sorted_keys) {
		var key = sorted_keys[k];
		dataToPlot += key + "," + dataHashMap[key].join() + "\n";
	}

	dataToPlot = dataToPlot.substr(0, dataToPlot.length - 1);
	return dataToPlot;
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

function loadSiteData() {
	var url = "https://public.optirtc.com/api/datapoint/";
	var requestParams = {
		"key": "z5ywCWZ4rLh3lu*3i234StqF",
		"dataStreamId": 18704
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
}


var adjustDygraphsPlotAreaHTMLonResize = function () {
    if( $('div.graph-container').width() > 400) {
        $('div.dygraph-toolbar').removeClass('dashboard-small');
        $('button.btn-responsive').removeClass('btn-responsive-small');
        $('div.dygraph-title').removeClass('dashboard-small');
        $('div.graph-container').addClass('graph-container-desk');
    } else {
        $('div.dygraph-toolbar').addClass('dashboard-small');
        $('button.btn-responsive').addClass('btn-responsive-small');
        $('div.dygraph-title').addClass('dashboard-small');
        $('div.graph-container').removeClass('graph-container-desk');
    }
}

var resizeDygraphs = function () {
    setTimeout(function () {
        adjustDygraphsPlotAreaHTMLonResize();
        if (dygraphs['mixed-probes'] != undefined) {
            dygraphs['mixed-probes'].resize();
        }
        if (dygraphs['mixed-temperatures'] != undefined) {
            dygraphs['mixed-temperatures'].resize();
        }
    }, 300); // Need to add a small delay in order to avoid breaking the internal split-pane listener
};

$(document).ready(function() {
	// loadSiteData();
    dygraphToolbar.addDygraphsToolbarListener();

    $('div.split-pane').on('splitpaneresize', resizeDygraphs);

    // $('div.graph-container').bind('resize', function(e) {
    //
    // });

	// $('a[href="#all-quads"]').on('shown.bs.tab', resizeDygraphs);

    // $('.nav-tabs a').on('shown.bs.tab', function(event) {
		// // populateGraphs($(event.target).text().split(" ")[1]);
    // });

    // if ($("#plot-area").width() <= 500) {
    //     $("button.btn-responsive").addClass("btn-responsive-small");
    //     // $( ".myclass.otherclass" ).css( "border", "13px solid red" );
    // } else {
    //     mapToolbar("Normal");
    // }
    
});