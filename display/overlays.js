function drawOverlays(map, centre, listings) {

	// set up values that dictate the resolution of the grid
	// total coverage is (2*blocks+1)*res both NS and EW
	// we want the number to be odd so that we can centre it
	// on the centre given to us
	var res = 400;
	var blocks = 4;

	// Create the centres by adjusting from the centre
	// using a heading
	// The bounds are the rectangle bounds
	var centres = new Array();
	var bounds  = new Array();
	var i, j;
	for( i = -blocks; i <= blocks; i++) {
		
		centres[i + blocks] = new Array();
		bounds [i + blocks] = new Array();
		
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
			
			// Temporarily show markers as debug tool
			// new google.maps.Marker({
				// position : centres[i + blocks][j + blocks],
				// map : map,
				// title : "" + j
			// });

			// Draw rectangles
			new google.maps.Rectangle({
				strokeWeight: 0.1,
				map: map,
				bounds: bounds[i + blocks][j + blocks]
			})

		}
	}
}