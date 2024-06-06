<?php

$hostn = "localhost";
$usern = "root";
$passw = "";
$db1 = "iot_sem_5";

$sql_nutri = mysqli_connect($hostn, $usern, $passw, $db1);

if (!$sql_nutri) {
	die("Connection failed: ".mysqli_connect_error());
}else if($sql_nutri->connect_errno){
    die("Connection failed: ".mysqli_connect_error());
};

?>