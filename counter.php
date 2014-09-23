<?php


if($_REQUEST['m'] == 'increment'){
	// Open the file for reading 
	$fp = fopen("cnt.dat", "r"); 

	// Get the existing count 
	$count = fread($fp, 1024); 

	// Close the file 
	fclose($fp); 

	// Add 1 to the existing count 
	$count = $count + 1;

	// Reopen the file and erase the contents 
	$fp = fopen("cnt.dat", "w"); 

	// Write the new count to the file 
	fwrite($fp, $count); 

	// Close the file 
	fclose($fp); 
	echo $count;
	
}elseif ($_REQUEST['m'] == 'check'){

	$fp = fopen("cnt.dat", "r"); 

	// Get the existing count 
	$count = fread($fp, 1024); 

	// Close the file 
	fclose($fp); 

	echo $count;

}

?>