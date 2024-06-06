<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    include "functions.php";
    $nutri_sql = "null"; $pass_hashed = null; $login_sql = null; $stmt = null; 
    
    $is_valid = false;
    $email = SQL_FIREWALL($_POST["email"], 's');
    $pass = SQL_FIREWALL($_POST["password"], 's');
    $user_id = isLogged();

    $timeout = 120;

    if(empty($_SESSION["login_attempts"])){
        reset_timer();
    };

    if(empty($_SESSION["timeout"])){
        reset_timer();
    };

    if(empty($email)){
        die(messageH1("Wrong"));
    }else if(empty($pass)){
        die(messageH1("Wrong"));
    }else if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
        die(messageH1("Wrong"));
    }else if(!empty($email) && !empty($pass) && filter_var($email, FILTER_VALIDATE_EMAIL)){
        try{
            //connect server
            include "main_db.php";
            $nutri_sql = $sql_nutri;

            //sql querry
            $login_sql = "SELECT id, pass_hash, utype FROM users WHERE email = (?)";

            //new prepare statement obj
            $stmt = $nutri_sql->stmt_init();

        }catch(Exception $e) {
            die(messageH1($e->getMessage()));
        };

        //prepare sql for execution and check
        try{
            $stmt->prepare($login_sql);
        }catch(Exception $e) {
            die(messageH1($e->getMessage()));
        };

        //attach variables
        try{
            $esc_email = $nutri_sql->real_escape_string($email);
            $stmt->bind_param("s", $esc_email);
        }catch(Exception $e) {
            die(messageH1($e->getMessage()));
        };

        //execute sql
        try{
            $hashed; $id;
            $stmt->execute();
            $result = $stmt->get_result (); //get the mysqli_result object
            while ($row = $result->fetch_assoc ()) { //get results
                $hashed = $row["pass_hash"]; //get pass
                $id = $row["id"]; //get id
                $utype = $row["utype"];
            }; 

            if(!empty($hashed) && password_verify($pass, $hashed) && $_SESSION["login_attempts"] < 3){
                session_start();
                session_regenerate_id();
                $_SESSION["id"] = $id;
                $_SESSION["utype"] = $utype;
                reset_timer();
                navigate("index.html");
                $stmt->close();
                exit;
            }else if($_SESSION["login_attempts"] > 2){
                if(time() - $_SESSION["timeout"] > $timeout){
                    reset_timer();
                    echo(messageH1("Wrong"));
                    $_SESSION["login_attempts"] = $_SESSION["login_attempts"] + 1;
                    $_SESSION["timeout"] = time();
                }else{
                    $remaining = $timeout - (time() - $_SESSION["timeout"]);
                    echo(messageH1("You Failed Password 3 Times! Try Again in $remaining Seconds!"));
                }
                
            }else{
                echo(messageH1("Wrong"));
                $_SESSION["login_attempts"] = $_SESSION["login_attempts"] + 1;
                $_SESSION["timeout"] = time();
            };
            $stmt->close();
            exit;
        }catch(Exception $e) {
            if($nutri_sql->errno === 1062){
                die(messageH1("Email Already Taken"));
            }else{
                die(messageH1($e->getMessage()));
            };
            
        };   

    }else{
        echo(messageH1("gatau error nya apa"));
    };

}else{
    echo(messageH1("Mana POST nya"));
};

?>