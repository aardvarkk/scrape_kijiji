function attachWindow(map, rect, centre, content) {
	
	var infowindow = new google.maps.InfoWindow({
		content : content
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

			// Draw rectangles based on the rent colour
			// A colour of null means we shouldn't draw it at all
			var rect = new google.maps.Rectangle({
				strokeWeight: 0.1,
				map: map,
				bounds: bounds[i + blocks][j + blocks]
			})
			
			// Attach a window to each rectangle
			attachWindow(map, rect, centres[i+blocks][j+blocks], "Hi!");
		}
	}
}