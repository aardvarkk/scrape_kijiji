function drawOverlays(map, centre, listings) {

	// set up values that dictate the resolution of the grid
	// total coverage is (2*blocks+1)*res both NS and EW
	// we want the number to be odd so that we can centre it
	// on the centre given to us
	// Catchment is the radius wherein a circle will include
	// properties within it for price averaging
	var res = 400;
	var blocks = 4;
	var catchment = Math.sqrt(res * res + res * res) / 2;

	// Create the centres by adjusting from the centre
	// using a heading
	var centres = new Array();
	var i, j;
	for( i = -blocks; i <= blocks; i++) {
		
		centres[i + blocks] = new Array();
		
		for( j = -blocks; j <= blocks; j++) {
			
			var offlat = google.maps.geometry.spherical.computeOffset(centre, res * i, 180);
			var offlng = google.maps.geometry.spherical.computeOffset(centre, res * j, 90);
			
			centres[i + blocks][j + blocks] = new google.maps.LatLng(offlat.lat(), offlng.lng());

			// Temporarily show markers as debug tool
			// new google.maps.Marker({
				// position : centres[i + blocks][j + blocks],
				// map : map,
				// title : "" + j
			// });
			
			// Draw the catchment circles
			new google.maps.Circle({
				strokeWeight: 0,
				map: map,
				center : centres[i + blocks][j + blocks],
				radius : catchment
			});


		}
	}
}