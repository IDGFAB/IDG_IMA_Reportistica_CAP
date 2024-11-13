sap.ui.define([], function() {
	"use strict";

	return {
		calcolaPasqua: function(year) {
			year = parseInt(year, 10);
			if (isNaN(year))
				year = 0;

			var wDay;
			var oDay;

			wDay = parseInt(wDay, 10);
			if (isNaN(wDay))
				wDay = 0;

			oDay = parseInt(oDay, 10);
			if (isNaN(oDay))
				oDay = 0;

			var g;
			var i;
			var j;
			var p;

			g = year % 19;
			i = (19 * g + 15) % 30;
			j = (year + Math.floor(year / 4) + i) % 7;
			p = i - j + 28;

			var a;
			var c;
			var h;
			var b;
			var d;
			var q;

			a = year % 19;
			c = Math.floor(year / 100);
			h = (c - Math.floor(c / 4) - Math.floor((8 * c + 13) / 25) + 19 * a + 15) % 30;
			b = h - Math.floor(h / 28) * (1 - Math.floor(29 / (h + 1)) * Math.floor((21 - a) / 11));
			d = (year + Math.floor(year / 4) + b + 2 - c + Math.floor(c / 4)) % 7;
			q = b - d + 28;

			var extra;

			var tmp;

			if (year > 1600) {
				tmp = Math.floor(year / 100) - 16;
				extra = 10 + tmp - Math.floor(tmp / 4);
			};

			oDay = p + extra;

			if (q <= 31) {
				wDay = q;
				var FPasqua = [wDay, "03"];
			};
			if (q > 31) {
				wDay = q - 31;
				var FPasqua = [wDay, "04"];
			};

			return FPasqua;
		}
	};

});