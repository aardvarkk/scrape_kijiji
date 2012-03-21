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
	var res = 400;
	var blocks = 4;

	// Centres are the rectangle centres
	// The bounds are the rectangle bounds
	// Windows are the info windows to pop up when you click on areas
	var centres = new Array();
	var bounds  = new Array();
	var windows = new Array();
	
	var i, j;
	for( i = -blocks; i <= blocks; i++) {
		
		centres[i + blocks] = new Array();
		bounds [i + blocks] = new Array();
		windows[i + blocks] = new Array();
		
		for( j = -blocks; j <= blocks; j++) {
			
			var offlat;
			var offlng;
			
			offlat = google.maps.geometry.spherical.computeOffset(centre, res * i, 180);
			offlng = google.maps.geometry.spherical.computeOffset(centre, res * j, 90);
			centres[i + blocks][j + blocks] = new google.maps.LatLng(offlat.lat(), offlng.lng());
			
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
			bounds[i + blocks][j + blocks] = new google.maps.LatLngBounds(sw, ne);

			// calculate the rent average for this block
			// while we're at it, find the min and max
			var sum = 0;
			var num = 0;
			var min = 0;
			var max = 0;
			for (var k = 0; k < listings.length; k++) {
				
				if (bounds[i+blocks][j+blocks].contains(listings[k].pos)) {
				
					// ignore listings with null prices
					if (listings[k].price == null) continue;
						
					// find min and max
					if (min == 0 || listings[k].price < min) {
						min = listings[k].price;
					}
					if (max == 0 || listings[k].price > max) {
						max = listings[k].price;
					}						 
					
					sum += listings[k].price;
					num++;
				}
			} 
			
			// Draw rectangles based on the rent colour
			// A colour of null means we shouldn't draw it at all
			var rect = new google.maps.Rectangle({
				strokeWeight : 0.1,
				fillColor: "#FF0000",
				fillOpacity: num > 0 ? 0.25 : 0.0,
				map : map,
				bounds : bounds[i + blocks][j + blocks]
			})

			if (num > 0) {
				// Attach a window to each rectangle
				attachWindow(map, rect, centres[i+blocks][j + blocks], sum / num, min, max);
			}
		}
	}
}