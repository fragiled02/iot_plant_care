<?php


if ($_SERVER["REQUEST_METHOD"] == "POST") {

    include "functions.php";

    $name = SQL_FIREWALL($_POST["name"], 's');
    $email = SQL_FIREWALL($_POST["email"], 's');
    $pass = SQL_FIREWALL($_POST["password"], 's');
    $pass_conf = SQL_FIREWALL($_POST["password_conf"], 's');
    $utype = SQL_FIREWALL($_POST["utype"], 's');

    //db variables
    $nutri_sql = null; $pass_hashed = null; $signup_sql = null; $stmt = null;

    if(empty($name)){
        die(messageH1("Empty or Invalid Name"));
    }else if(empty($email)){
        die(messageH1("Email Illegal"));
    }else if(!filter_var($email, FILTER_VALIDATE_EMAIL)  || empty($email)){
        die(messageH1("Email Invalid"));
    }else if(strlen($pass) < 8){
        die(messageH1("Password must be at least 8 characters"));
    }else if(!preg_match("/[a-z]/i", $pass)){
        die(messageH1("Password must contain atleast 1 letter"));
    }else if(!preg_match("/[0-9]/", $pass)){
        die(messageH1("Password must contain atleast 1 number"));
    }else if($pass !== $pass_conf){
        die(messageH1("Password must match"));
    }else if
    (!empty($name) && !empty($email) && !empty($pass) && !empty($pass_conf) && filter_var($email, FILTER_VALIDATE_EMAIL) && !empty($utype)){

        try{
            //connect server
            include "main_db.php";
            $nutri_sql = $sql_nutri;

            //encrypt the password
            $pass_hashed = password_hash($pass, PASSWORD_DEFAULT);

            //sql querry
            $signup_sql = "INSERT INTO users (name, email, pass_hash, utype) VALUES (?, ?, ?, ?)";

            //new prepare statement obj
            $stmt = $nutri_sql->stmt_init();

        }catch(Exception $e) {
            die(messageH1($e->getMessage()));
        };


        //prepare sql for execution and check
        try{
            $stmt->prepare($signup_sql);
        }catch(Exception $e) {
            die(messageH1($e->getMessage()));
        };

        //attach variables
        try{
            $esc_name = $nutri_sql->real_escape_string($name);
            $esc_email = $nutri_sql->real_escape_string($email);
            $esc_pass = $nutri_sql->real_escape_string($pass_hashed);
            $esc_utype = $nutri_sql->real_escape_string($utype);

            $stmt->bind_param("ssss", $esc_name, $esc_email, $esc_pass, $esc_utype);
        }catch(Exception $e) {
            die(messageH1($e->getMessage()));
        };

        //execute sql
        try{
            $stmt->execute();
            echo(messageH1shome("Register Success! Please Log In"));
            $stmt->close();
            exit;
        }catch(Exception $e) {
            if($nutri_sql->errno === 1062){
                die(messageH1("Email Already Taken LOL"));
            }else{
                die(messageH1($e->getMessage()));
            };
            
        };     
        

    }else{
        echo(messageH1("gatau error nya apa"));
    };

}else{
    echo("harus pake POST cuy");
};

?>