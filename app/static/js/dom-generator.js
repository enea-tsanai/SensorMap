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

$(document).ready(function() {
	initializeQuadrantsDomElements();
});