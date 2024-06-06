<?php

function runSQL($sql){

if(empty($_SESSION)){session_start();};

if(!empty($_SESSION["id"]) && $_SESSION["id"] != 'haha'){

        $nutri_sql = null; $pass_hashed = null; $final_sql = null; $stmt = null; $final = null;
        
        try{
            //connect server
            include "main_db.php";
            $nutri_sql = $sql_nutri;

            //sql querry processing
            $final_sql = strval($sql);

            //new prepare statement obj
            $stmt = $nutri_sql->stmt_init();

        }catch(Exception $e) {
            return(dummyJSON("Error1: " .$e->getMessage()));
        };

        //prepare sql for execution and check
        try{
            $stmt->prepare($final_sql);
        }catch(Exception $e) {
            return(dummyJSON("Error2: " .$e->getMessage()));
        };

        //execute sql
        try{
            $stmt->execute();
            $result = $stmt->get_result(); //get the mysqli_result object
         
            if(!empty($result)){
                while ($row = $result->fetch_assoc()) { //get results
                    $final[] = $row;
                }; 
                $stmt->close();
                return(json_encode($final));
            }else{
                $final = dummyJSON("success");
                $stmt->close();
                return($final);
            };
     
        }catch(Exception $e) {
            return(dummyJSON("Error4: " .$e->getMessage()));   
        };   
    }else{
        return(dummyJSON("You are logged out"));
    };
};


function runSQL_form($sql){

if(empty($_SESSION)){session_start();};

if(!empty($_SESSION["id"]) && $_SESSION["id"] != 'haha'){

        $nutri_sql = null; $pass_hashed = null; $final_sql = null; $stmt = null; $final = null;
        
        try{
            //connect server
            include "main_db.php";
            $nutri_sql = $sql_nutri;

            //sql querry processing
            $final_sql = strval($sql);

            //new prepare statement obj
            $stmt = $nutri_sql->stmt_init();

        }catch(Exception $e) {
            echo(messageH1($e->getMessage()));
            exit;
        };

        //prepare sql for execution and check
        try{
            $stmt->prepare($final_sql);
        }catch(Exception $e) {
            echo(messageH1($e->getMessage()));
            exit;
        };

        //execute sql
        try{
            $stmt->execute();
            $result = $stmt->get_result(); //get the mysqli_result object
         
        echo(messageH1s("Success"));
        exit;

        }catch(Exception $e) {
            echo(messageH1($e->getMessage()));   
            exit;
        };   
    }else{
        echo(messageH1("You are Logged Out!"));
        exit;
    };
};

function runSQL_raw($sql){

if(empty($_SESSION)){session_start();};

if(!empty($_SESSION["id"]) && $_SESSION["id"] != 'haha'){

        $nutri_sql = null; $pass_hashed = null; $final_sql = null; $stmt = null; $final = null;
        
        try{
            //connect server
            include "main_db.php";
            $nutri_sql = $sql_nutri;

            //sql querry processing
            $final_sql = strval($sql);

            //new prepare statement obj
            $stmt = $nutri_sql->stmt_init();

        }catch(Exception $e) {
            return(dummyJSON("Error1: " .$e->getMessage()));
        };

        //prepare sql for execution and check
        try{
            $stmt->prepare($final_sql);
        }catch(Exception $e) {
            return(dummyJSON("Error2: " .$e->getMessage()));
        };

        //execute sql
        try{
            $stmt->execute();
            $result = $stmt->get_result(); //get the mysqli_result object
         
            if(!empty($result)){
                return $result;
            }else{
                $final = dummyJSON("success");
                $stmt->close();
                return($final);
            };
     
        }catch(Exception $e) {
            return(dummyJSON("Error4: " .$e->getMessage()));   
        };   
    }else{
        return(dummyJSON("You are logged out"));
    };
};
function navigate($luink){
    $queryString =  $_SERVER['QUERY_STRING'];
    header("Location: ".$queryString."/".$luink);
    exit;
};

function dummyJSON($mess){
    $jsom = array("mess"=>$mess);
    return json_encode($jsom); 
};

function messageH1($message){

    $final = "Error: ".$message;

    return("
    <html><body>
    <div style='display: flex; align-items: center; flex-direction: column; background-color: #FFC9C9;'>
        <h1 style='color: red'>$final</h1><br><br>
        <h1><a style='color: green' href=\"javascript:history.go(-1)\">Go Back</a></h1>
    </div>
    </body></html>
    ");
};

function messageH1home($message){

    $final = "Error: ".$message;

    return("
    <html><body>
    <div style='display: flex; align-items: center; flex-direction: column; background-color: #FFC9C9;'>
        <h1 style='color: green'>$final</h1><br><br>
        <h1><a style='color: green' href='return.php'>Click to Return to Homepage</a></h1>
    </div>
    </body></html>
    ");
};


function messageH1s($message){

    $final = "Success: ".$message;

    return("
    <html><body>
    <div style='display: flex; align-items: center; flex-direction: column; background-color: #C1FFA0;'>
        <h1 style='color: green'>$final</h1><br><br>
        <h1><a style='color: green' href=\"javascript:history.go(-1)\">Go Back</a></h1>
    </div>
    </body></html>
    ");
};

function messageH1shome($message){

    $final = "Success: ".$message;

    return("
    <html><body>
    <div style='display: flex; align-items: center; flex-direction: column; background-color: #C1FFA0;'>
        <h1 style='color: green'>$final</h1><br><br>
        <h1><a style='color: green' href='return.php'>Click to Return to Homepage</a></h1>
    </div>
    </body></html>
    ");
};


function SQL_FIREWALL($raw, $dtypes){
    include "main_db.php";
    $nutri_sql = $sql_nutri;
    $raw1; $raw2; $raw3;

    if(empty($raw)){return false;}

    else if(!preg_match("/[a-z]/i", $raw) && ($dtypes == "n" || $dtypes == "N" )){
        $raw2 = $raw;
        return $raw2;
    }else{
        $raw1 = strval($raw);
        $raw2 = $nutri_sql->real_escape_string($raw1); 
        $raw3 = check_string($raw2);
        return $raw3;
    };
};

function isLogged(){
    if(!isset($_SESSION)){
        session_start();
    };
    
    if(!empty($_SESSION) && $_SESSION["id"] != 'haha'){
        return($_SESSION["id"]);
    }else{
        return false;
    };
    
};

function getUtype(){
    if(!isset($_SESSION)){
        session_start();
    };
    if(!empty($_SESSION)){
        return($_SESSION["utype"]);
    }else{
        return false;
    };
    
};

function check_string($str) {
    // lowercase the string
    $raw = $str;
    $str = strtolower($str);
    // check for forbidden words or symbols
    $forbidden = array("insert", "select", "update", "delete", "where", "$");
    // loop through the forbidden array
    foreach ($forbidden as $word) {
        // if the string contains any of the forbidden words or symbols, return false
        if (strpos($str, $word) !== false) {
        return false;
        };
    };
    // otherwise, return the string
    return $raw;
};
function reset_timer(){
    $_SESSION["login_attempts"] = 0;
    $_SESSION["timeout"] = 0;
}

function reset_client(){
    if(isset($_SESSION)){
        session_destroy();
    };
    if(!isset($_SESSION)){
        session_start();
    };

    $_SESSION["id"] = 'haha';
    $_SESSION["utype"] = 'haha';


    if(empty($_SESSION["login_attempts"])){
        reset_timer();
    };

    if(empty($_SESSION["timeout"])){
        reset_timer();
    };
};

?>