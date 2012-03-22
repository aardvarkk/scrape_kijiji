function attachWindow(map, rect, centre, avg, min, max) {
	
	var infowindow = new google.maps.InfoWindow({
		content : "<table>" + 
		          "<tr><td>Minimum</td><td>$" + min + "</td></tr>" + 
		          "<tr><td>Average</td><td>$" + avg + "</td></tr>" +
		          "<tr><td>Maximum</td><td>$" + max + "</td></tr>" +
		          "</table>"
	});
	
	google.maps.event.addListener(rect, 'click', function() {
		infowindow.open(map, new google.maps.Marker({
			position: centre,
			map: map,
			visible: false
		}));
	});
	
}

function drawOverlays(map, centre, listings) {

	// set up values that dictate the resolution of the grid
	// total coverage is (2*blocks+1)*res both NS and EW
	// we want the number to be odd so that we can centre it
	// on the centre given to us
	var res = 200;
	var blocks = 8;

	// Centres are the rectangle centres
	// The bounds are the rectangle bounds
	// Windows are the info windows to pop up when you click on areas
	var squares = new Array();
	
	// Need these to determine what colours the rectangles should be
	// That also means we can't do the rectangles until we've gone through
	// the loop once calculating values
	var whole_lo = null;
	var whole_hi = null;
	
	for (var i = -blocks; i <= blocks; i++) {
		
		squares[i + blocks] = new Array();
		
		for (var j = -blocks; j <= blocks; j++) {
			
			var offlat;
			var offlng;
			
			// add an object so we can set properties on it
			squares[i + blocks][j + blocks] = new Object();
			
			offlat = google.maps.geometry.spherical.computeOffset(centre, res * i, 180);
			offlng = google.maps.geometry.spherical.computeOffset(centre, res * j, 90);
			squares[i + blocks][j + blocks].centre = new google.maps.LatLng(offlat.lat(), offlng.lng());
			
			// calculate the corner coordinates
			// these offsets are shifted a bit

			// southwest
			offlat = google.maps.geometry.spherical.computeOffset(centre, res * (i + 0.5), 180);
			offlng = google.maps.geometry.spherical.computeOffset(centre, res * (j - 0.5), 90);
			var sw = new google.maps.LatLng(offlat.lat(), offlng.lng());
			
			// northeast
			offlat = google.maps.geometry.spherical.computeOffset(centre, res * (i - 0.5), 180);
			offlng = google.maps.geometry.spherical.computeOffset(centre, res * (j + 0.5), 90);
			var ne = new google.maps.LatLng(offlat.lat(), offlng.lng());
			
			// set the bounds
			squares[i + blocks][j + blocks].bounds = new google.maps.LatLngBounds(sw, ne);

			// calculate the rent average for this block
			// while we're at it, find the min and max
			squares[i + blocks][j + blocks].sum = 0;
			squares[i + blocks][j + blocks].num = 0;
			squares[i + blocks][j + blocks].min = null;
			squares[i + blocks][j + blocks].max = null;
			
			for (var k = 0; k < listings.length; k++) {
				
				if (squares[i+blocks][j+blocks].bounds.contains(listings[k].pos)) {
				
					// ignore listings with null prices
					if (listings[k].price == null) continue;
						
					// find min and max
					if (squares[i + blocks][j + blocks].min == null || listings[k].price < squares[i + blocks][j + blocks].min) {
						squares[i + blocks][j + blocks].min = listings[k].price;
					}
					if (squares[i + blocks][j + blocks].max == null || listings[k].price > squares[i + blocks][j + blocks].max) {
						squares[i + blocks][j + blocks].max = listings[k].price;
					}						 
					
					squares[i + blocks][j + blocks].sum += listings[k].price;
					squares[i + blocks][j + blocks].num++;
				}
			}
			
			// Draw the rect based on the number of properties within it
			// We will adjust its fill colour after we know the whole min and max
			squares[i + blocks][j + blocks].rect = new google.maps.Rectangle({
				strokeWeight : 0.1,
				fillColor : "#FF0000",
				fillOpacity : squares[i + blocks][j + blocks].num > 0 ? 0.4 : 0.0,
				map : map,
				bounds : squares[i + blocks][j + blocks].bounds
			})

			// Attach a window to each rectangle if there are properties in it
			if(squares[i + blocks][j + blocks].num > 0) {
				
				// calculate an average value
				squares[i + blocks][j + blocks].avg = squares[i + blocks][j + blocks].sum / squares[i + blocks][j + blocks].num;
				
				attachWindow(
					map, 
					squares[i + blocks][j + blocks].rect, 
					squares[i + blocks][j + blocks].centre, 
					squares[i + blocks][j + blocks].avg, 
					squares[i + blocks][j + blocks].min, 
					squares[i + blocks][j + blocks].max
					);
			}

			// Adjust the whole max/min
			if(whole_lo == null || (squares[i + blocks][j + blocks].avg != null && squares[i + blocks][j + blocks].avg < whole_lo)) {
				whole_lo = squares[i + blocks][j + blocks].avg;
			}
			if(whole_hi == null || (squares[i + blocks][j + blocks].avg != null && squares[i + blocks][j + blocks].avg > whole_hi)) {
				whole_hi = squares[i + blocks][j + blocks].avg;
			}
	 	}
	}
	
	// Draw rectangles based on the rent colour
	// A colour of null means we shouldn't draw it at all
	for (var i = -blocks; i <= blocks; i++) {
		for (var j = -blocks; j <= blocks; j++) {
			
			// Only care about ones that have an average
			if (squares[i + blocks][j + blocks].avg == null) continue;
			
			// Compare our average to the whole lo and hi to get a linear value
			var pricey = (squares[i + blocks][j + blocks].avg - whole_lo) / (whole_hi - whole_lo); 
			
			// We may want to show increasing or decreasing hues...
			var chp_hue = 240;
			var exp_hue = 0;

			var hsv = new Object();
			hsv.h = (1 - pricey) * (chp_hue - exp_hue);
			hsv.s = 100;
			hsv.v = 85; 
						
			var rgb = new Object();
			hsvToRgb(hsv, rgb);
			
			squares[i + blocks][j + blocks].rect.setOptions({
				fillColor : rgbToHex(rgb)
			})
		}
	}
			

}