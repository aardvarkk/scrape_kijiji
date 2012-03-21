function hexify(number) {
	var digits = '0123456789ABCDEF';
	var lsd = number % 16;
	var msd = (number - lsd) / 16;
	var hexified = digits.charAt(msd) + digits.charAt(lsd);
	return hexified;
}

function rgbToHex(rgb) {
	return "#" + hexify(rgb.r) + hexify(rgb.g) + hexify(rgb.b);
}

function hsvToRgb(hsv, rgb) 
{
	var h = hsv.h / 360; 
	var s = hsv.s / 100; 
	var v = hsv.v / 100;

	if (s == 0) {
		rgb.r = v * 255;
		rgb.g = v * 255;
		rgb.b = v * 255;
	} else {
		var_h = h * 6;
		var_i = Math.floor(var_h);
		var_1 = v * (1 - s);
		var_2 = v * (1 - s * (var_h - var_i));
		var_3 = v * (1 - s * (1 - (var_h - var_i)));

		if (var_i == 0) {var_r = v; var_g = var_3; var_b = var_1}
		else if (var_i == 1) {var_r = var_2; var_g = v; var_b = var_1}
		else if (var_i == 2) {var_r = var_1; var_g = v; var_b = var_3}
		else if (var_i == 3) {var_r = var_1; var_g = var_2; var_b = v}
		else if (var_i == 4) {var_r = var_3; var_g = var_1; var_b = v}
		else {var_r = v; var_g = var_1; var_b = var_2};

		rgb.r = var_r * 255;
		rgb.g = var_g * 255;
		rgb.b = var_b * 255;
	}
}
