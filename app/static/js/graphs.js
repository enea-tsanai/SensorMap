//Global vars
var sites = [];
var dygraphs = {};

// Sensor Class
function Sensor() {
    this.id = "";
    this.name = "";
    this.description = "";
    this.labels = [];
    this.data = {};
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

// Site Class
function Site() {
    this.id = "";
    this.name = "";
    this.description = "";
    this.sensors = [];
}

Site.prototype.addSensor = function (sensorID) {
    this.sensors.push(parseInt(sensorID));
};

// DygraphPlotter Class
function DygraphPlotter() {
    this.wrapperElement = "";
    this.dygraphWrapper = "";
    this.divElement = "";
    this.plotHTML = "";
    this.toolbar = "<div class=\"row\">\n    <div class=\"dygraph-toolbar col-xs-10 text-center\">\n        <h4>Data Level:</h4>\n        <div class=\"btn-group\" role=\"group\" aria-label=\"...\">\n            <button name=\"hour\" type=\"button\" class=\"btn btn-default btn-responsive\">Hour</button>\n            <button name=\"day\" type=\"button\" class=\"btn btn-default btn-responsive\">Day</button>\n            <button name=\"week\" type=\"button\" class=\"btn btn-default btn-responsive\">Week</button>\n            <button name=\"month\" type=\"button\" class=\"btn btn-default btn-responsive\">Month</button>\n            <button name=\"full\" type=\"button\" class=\"btn btn-default btn-responsive\">Reset</button>\n        </div>\n        <h4>Move:</h4>\n        <div class=\"btn-group\" role=\"group\" aria-label=\"...\">\n            <button name=\"left\" type=\"button\" class=\"btn btn-default btn-responsive\">\n                <span class=\"glyphicon glyphicon-circle-arrow-left\" aria-hidden=\"true\"></span></button>\n            <button name=\"right\" type=\"button\" class=\"btn btn-default btn-responsive\">\n                <span class=\"glyphicon glyphicon-circle-arrow-right\" aria-hidden=\"true\"></span>\n            </button>\n        </div>\n    </div>\n</div>";
    this.hasVisibletoolbar = true;
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

DygraphPlotter.prototype.plot = function () {
    $(this.dygraphWrapper).remove();
    $('#' + this.wrapperElm).append(this.plotHTML);
    adjustDygraphsPlotAreaHTMLonResize();

    //TODO: Check the following: may be undifined
    params.labelsDiv = document.getElementById('legend-' + this.divElement);
    dygraphs[divElement] = new Dygraph(document.getElementById(this.divElement), this.data, this.plotParams);
    dygraphs[divElement].resize();
};

// DygraphDataHelper object
function call(fn) {
    fn();
}

var DygraphDataHelper = {
    fetchData: function (url, requestParams) {
        var _url = concatenateUrlAndParams("/getDataStream/", requestParams);
        return $.ajax({
            url: _url,
            dataType: "json"
        });
    },
    onDoneFetchingData: function (fetchingFunctions, dataHandlingFunctions) {
        $.when(fetchingFunctions.forEach(call)).done(function(dataHandlingFunctions) {
            // Parse results
            // the code here will be executed when all four ajax requests resolve.
            // a1, a2, a3 and a4 are lists of length 3 containing the response text,
            // status, and jqXHR object for each of the four ajax calls respectively.
        });
    },
    toDygraphPlotData: function () {

    },
    toDygraphPlotAvergeData: function () {

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
	{streamId: 18725, name: "quad-2_probe-2", quad: "2", probe: "2", labels: ["Date", "Cubic Meters"], data: ""},
	{streamId: 18767, name: "quad-2_temperature-1", quad: "2", labels: ["Date", "Temperature C"], data: ""},

	{streamId: 18732, name: "quad-3_probe-1", quad: "3", probe: "1", labels: ["Date", "Cubic Meters"], data: ""},
	{streamId: 18739, name: "quad-3_probe-2", quad: "3", probe: "2", labels: ["Date", "Cubic Meters"], data: ""},
	{streamId: 18772, name: "quad-3_temperature-1", quad: "3", labels: ["Date", "Temperature C"], data: ""},

	{streamId: 18746, name: "quad-4_probe-1", quad: "4", probe: "1", labels: ["Date", "Cubic Meters"], data: ""},
	{streamId: 18753, name: "quad-4_probe-2", quad: "4", probe: "2", labels: ["Date", "Cubic Meters"], data: ""},
	{streamId: 18777, name: "quad-4_temperature-1", quad: "4", labels: ["Date", "Temperature C"], data: ""}
];


var CEERTEXT = '<div class="row text-center">\n    <div class="col-sm-10 col-sm-offset-1">\n        <iframe src="https://3dwarehouse.sketchup.com/embed.html?mid=ua7d24fd4-10c8-4ba4-8202-83a5b0de4135" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" allowfullscreen></iframe>\n        <p><br>Construction of Villanova\'s Green Roof took place in 3 days in the summer of 2006. The design was a retrofit of a small portion of Villanova\'s Center for Engineering Education Research (CEER) roof. The green roof is\n        located on a second storey terrace above the \\"Holy Grounds\\" coffee shop. It is highly visible because it is located outside of the main stairwell and serves multiple purposes.<br><br>\n        Underlying the green roof is a traditional roof which was refinished in order to ensure maximum life of the green\n        roof. The next layer is an additional waterproofing layer which is also resistant to root penetration. On top of this layer is an insulation layer which is a thick mat designed to keep the potential for a large temperature gradient between the surface of the green roof and the original roof layer. The insulation is overlain with a geosynthetic layer that serves several purposes including drainage pathways, water storage areas, and aeration. This layer which looks much like an egg crate has holes at the high points to allow excessive amounts of water to drain. A filter fabric lies on top of it and allows water to pass through but keeps the fine sediments from the growth media from occupying the voids in the drainage layer. The media is a mixture of baked minerals which look like gravel and make it hard for weeds or anything aside from the highly specialized Sedum species to grow.</p>\n    </div>\n</div>';
var dummySites = {"Items":[
{"ID":"0","Name":"CEER Green Roof","Description":CEERTEXT},
{"ID":"1","Name":"name","Description":"description"},
{"ID":"2","Name":"name","Description":"description"},
{"ID":"3","Name":"name","Description":"description"},
{"ID":"4","Name":"name","Description":"description"}],
"Count":5};


/*
 * Make ajax call and store result to siteData
*/
function getStreamData(siteData, url, requestParams) {
	//startLoading();
//	setTimeout(function(){ stopLoading(); }, 1000);

	if (localFetchMode === true) {
		var url_ = concatenateUrlAndParams("/getDataStream/", requestParams);
		$.ajax({
			url: url_,
			dataType: "json"
		}).done(function (data) {
			$.each(data.items, function (i, item) {
				siteData.data += item.timeValue + ',' + item.value + '\n';
			});
		});
	} else {
		var url_ = concatenateUrlAndParams(url, requestParams)
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

	var probesData = [];
	var probesLabels = ['Time'];

	var params = jQuery.extend({}, dygraphParams);
	params.title = "Soil Moisture Probes";

	var quadrants = ["quad-1", "quad-2", "quad-3", "quad-4"];
	var probes = ["probe-1", "probe-2"];

	for(var q in quadrants) {
		for (var p in probes) {
			console.log(quadrants[q] + "_" + probes[p]);
			probesData.push(getStreamByName(quadrants[q] + "_" + probes[p]).data);
			probesLabels.push(getStreamByName(quadrants[q] + "_" + probes[p]).name);
		}
	}

	var temperaturesData = [];
    var temperatureLabels = ['Time'];
    var temperatures = ["temperature-1"];

	for(q in quadrants) {
		for (var t in temperatures) {
			console.log(quadrants[q] + "_" + temperatures[t]);
			temperaturesData.push(getStreamByName(quadrants[q] + "_" + temperatures[t]).data);
			temperatureLabels.push(getStreamByName(quadrants[q] + "_" + temperatures[t]).name);
		}
	}

    params.title = "Combined";
    params.connectSeparatedPoints = true;
    params.labelsSeparateLines = true;
    params.series = {};
    params.ylabel = 'Moisture';
    params.y2label = 'Temperature';

	console.log(probesData);
    var d1 = getAverageData(probesData);
    var d2 = getAverageData(temperaturesData);
    var dataToPlot = aggregateDataMod([d1, d2]);
    params.labels = ['Time', 'Moisture', 'Temperature (C)'];
    params.series['Temperature (C)'] = {axis: 'y2'};
    params.customBars = true;
    params.highlightSeriesOpts = '';
    params.dateWindow = [Date.parse("2016/03/01"), Date.parse("2016-03-02")];

	// dataToPlot = reduceData(dataToPlot, 4000, true);

	dygraphPlotLM("LMetrics", 'l-metrics', dataToPlot, params);
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

var desired_range = null, animate;

// Functions for dygraphs toolbar
function approach_range(graph) {
    graph.updateOptions({dateWindow: desired_range});
}

var zoom = function(graph, res) {
    var w = graph.xAxisRange();
    desired_range = [ w[0], w[0] + res * 1000 ];
    approach_range(graph);
};

var reset = function(graph) {
    graph.resetZoom();
};

var pan = function(graph, dir) {
    var w = graph.xAxisRange();
    var scale = w[1] - w[0];
    var amount = scale * 1 * dir; // 1 is the percentage to shift
    desired_range = [ w[0] + amount, w[1] + amount ];
    approach_range(graph);
};

// dgs = [];
// for (g in dygraphs) {
//     dgs.push(dygraphs[g]);
// }
// Dygraph.synchronize(dgs);

function addDygraphsToolbarListener() {
    $('body').on('click', 'button[name="hour"]', function () {
        zoom(dygraphs[$(this).closest("form").find("div.dygraph-plot").attr('id')],
            3600);
    });

    $('body').on('click', 'button[name="day"]', function () {
        zoom(dygraphs[$(this).closest("form").find("div.dygraph-plot").attr('id')],
            86400);
    });

    $('body').on('click', 'button[name="week"]', function () {
        zoom(dygraphs[$(this).closest("form").find("div.dygraph-plot").attr('id')],
            604800);
    });

    $('body').on('click', 'button[name="month"]', function () {
        zoom(dygraphs[$(this).closest("form").find("div.dygraph-plot").attr('id')],
            604830 * 8640000);
    });

    $('body').on('click', 'button[name="full"]', function () {
        reset(dygraphs[$(this).closest("form").find("div.dygraph-plot").attr('id')]);
    });

    $('body').on('click', 'button[name="left"]', function () {
        pan(dygraphs[$(this).closest("form").find("div.dygraph-plot").attr('id')],
            -1);
    });

    $('body').on('click', 'button[name="right"]', function () {
        pan(dygraphs[$(this).closest("form").find("div.dygraph-plot").attr('id')], 1);
    });
}


$(document).ready(function() {
	// loadSiteData();
    addDygraphsToolbarListener();

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