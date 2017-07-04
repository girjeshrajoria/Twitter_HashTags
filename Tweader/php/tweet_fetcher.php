<?php
/**
 * Created by PhpStorm.
 * User: girjesh
 * Date: 7/2/2017
 * Time: 6:24 PM
 */

require_once ("../php/libs/twitter-api-php-master/TwitterAPIExchange.php");
require ("twitter_credentials.php");
require ("database.php");

function fetchTweetsByHashTag($tag){
    $url = 'https://api.twitter.com/1.1/search/tweets.json';
    $requestMethod = 'GET';
    $getfield = '?q=#'.$tag.'&result_type=recent&count=100';

    $twitter = new TwitterAPIExchange(getTwitterCredentials());
    $response =  $twitter->setGetfield($getfield)
        ->buildOauth($url, $requestMethod)
        ->performRequest();

    $result = json_decode($response, true);

    return $result;
}


$db = db_connect();
if (!$db){
    echo "Could not connect to database.";
    return;
}
else{
    if (isset($_POST['update_tweet_hashtag'])){
        $tag = $_POST['update_tweet_hashtag'];
        $result = fetchTweetsByHashTag($tag);

        for($i = 0; $i < count($result["statuses"]); $i++){
            $t_id = $result["statuses"][$i]["id_str"];
            $sql = "INSERT INTO tweet_store(tweet_id, hashtag) values ('$t_id', '$tag')";
            mysqli_query($db, $sql);
        }
    }
    else if (isset($_POST['get_tweets'])){
        $tag = $_POST['get_tweets'];
        $sql = "SELECT * FROM tweet_store where hashtag like '$tag' order by id desc";
        $res = mysqli_query($db, $sql);

        $response_pack = array();
        $i = 0;
        while ($row = mysqli_fetch_array($res)){
            $response["id"] = $row["id"];
            $response["tweet_id"] = $row["tweet_id"];
            $response["hashtag"] = $row["hashtag"];
            $response_pack[$i++] = $response;
        }
        echo json_encode($response_pack);
    }
    else if (isset($_POST['remove_tweets'])){
        $tag = $_POST['remove_tweets'];
        $sql1 = "Delete From tweet_store where hashtag like '$tag'";
        $sql2 = "ALTER TABLE tweet_store AUTO_INCREMENT = 1";
        mysqli_query($db, $sql1);
        mysqli_query($db, $sql2);
    }
}
