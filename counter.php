<?php


if($_REQUEST['m'] == 'increment'){
	// Open the file for reading 
	$fp = fopen("cnt.dat", "w"); 

	// Lock the file, to prevent a race condition
	flock($fp, LOCK_EX);

	// Get the existing count
	$count = (int) fread($fp, 1024);

	// Add 1 to the existing count
	$count++;

	// Write the new count to the file
	ftruncate($fp, 0);
	fseek($fp, 0);
	fwrite($fp, $count); 

	// Unlock and close the file
	fflush($fp);
	flock($fp, LOCK_UN);
	fclose($fp); 
	echo $count;
	
}elseif ($_REQUEST['m'] == 'check'){

	// No lock needed here, writing a single page is an atomic op
	$fp = fopen("cnt.dat", "r"); 

	// Get the existing count
	$count = (int) fread($fp, 1024);

	// Close the file
	fclose($fp);

	echo $count;

}

?>
