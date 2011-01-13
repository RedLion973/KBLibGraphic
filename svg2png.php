<?php
	$output = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="'.$_POST['width'].'" height="'.$_POST['height'].'" xml:space="preserve"><desc>Created with Raphael</desc><defs></defs>';
	$output .= $_POST['svg'];
    $output .= '</svg>';

	file_put_contents('generated/test.svg', $output);
	exec("java -jar batik/batik-rasterizer.jar generated/test.svg");
?>