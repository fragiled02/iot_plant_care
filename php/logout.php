<?php
try{
    include "functions.php";
    reset_client();
    $queryString =  $_SERVER['QUERY_STRING'];
    header("Location: ".$queryString."/index.html");
    exit;
}catch(Exception $e){
    include "functions.php";
    echo(messageH1($e));
};

?>