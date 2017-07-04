<?php
/**
 * Created by PhpStorm.
 * User: girjesh
 * Date: 7/2/2017
 * Time: 7:05 PM
 */

require ("database_credentials.php");

function db_connect(){
    $con = mysqli_connect(host, user, pass, db);
    if (!$con){
        return null;
    }
    else{
        return $con;
    }
}