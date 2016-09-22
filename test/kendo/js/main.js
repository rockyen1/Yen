document.addEventListener("deviceready", onDeviceReady, false);

//Activate :active state
document.addEventListener("touchstart", function() {
}, false);

function onDeviceReady() {
	var app;
	navigator.splashscreen.hide();
	app = new Application();
	app.run();
}

function Application() {
}

Application.prototype = {

	run: function() {
		var that = this,
			openLocal = document.getElementById("openLocal"),
			openExternalInAppBrowser = document.getElementById("openExternalInAppBrowser"),
			openExternalPDF = document.getElementById("openExternalPDF"),
			openExternalInSystemBrowser = document.getElementById("openExternalInSystemBrowser");

			openLocal.addEventListener("click", that.openLocal);
			openExternalInAppBrowser.addEventListener("click", that.openExternalInAppBrowser);
			openExternalPDF.addEventListener("click", that.openExternalPDF);
			openExternalInSystemBrowser.addEventListener("click", that.openExternalInSystemBrowser);
	},

	openLocal: function() {
		window.open("img/ice.png", "_blank");
	},
 
	openExternalInAppBrowser:  function () {
		window.open("http://www.colorlightoutput.com/tw/CLO_Buyers_guide_TW.pdf", "_blank");
	},

	openExternalPDF:  function () {
		if (window.navigator.simulator === true) {
			alert("Not Supported in Simulator.");
		} else {
			window.open("http://www.colorlightoutput.com/tw/CLO_Buyers_guide_TW.pdf", "_blank");
		}
	},

	openExternalInSystemBrowser:function () {
		window.open("http://wiki.apache.org/cordova/InAppBrowser", "_system");
	}
}