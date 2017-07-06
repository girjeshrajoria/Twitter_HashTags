/**
 * Created by girjesh on 7/2/2017.
 */

$(document).ready(function () {
    var embed_url = "https://publish.twitter.com/oembed?url=https://twitter.com/Interior/status/";

    var $button_search = $('#buttonSearchTag');

    var savedTag = localStorage.getItem("htag");
    if (savedTag !== null){
        $('#txtHashTag').val(savedTag);
        $('#txtHashTag').attr('disabled', 'disabled');
        $button_search.prop('value', 'Remove');
    }
    

    $button_search.click(function () {
        var return_interval = "";
        if ($button_search.val() === "Add"){
            var tag = $('#txtHashTag').val();
            localStorage.setItem("htag", tag);
            $.post(
                "php/tweet_fetcher.php",
                {update_tweet_hashtag:tag}
            );
           
 $('#txtHashTag').attr('disabled', 'disabled');
            $button_search.prop('value', 'Remove');
            return_interval = window.setInterval(update_database(tag), 60000);
        }
        else{
            $('#txtHashTag').removeAttr('disabled');
            localStorage.clear();
            $button_search.prop('value', 'Add');
            clearInterval(return_interval);
            $('table tr').remove();
            $.post(
                "php/tweet_fetcher.php",
                {remove_tweets:$('#txtHashTag').val()},
                function(){
                    $('#txtHashTag').val("");
                }
            );
        }

    });

    var update_database = function (tag) {
        $.post(
            "php/tweet_fetcher.php",
            {update_tweet_hashtag:tag}
        );
    };

    var visible = [];
    var first = true;

    var update_ui = function () {
        if ($('#txtHashTag').val().length == 0) return;
        $.post("php/tweet_fetcher.php",
            {get_tweets:$('#txtHashTag').val()},
            function (res) {
                var resp = $.parseJSON(res);
                for(var i = 0; i < resp.length; i++){
                    if (first){
                        visible.push(resp[i].tweet_id);
                        $.getJSON(
                            embed_url + resp[i].tweet_id,
                            function(data){
                                var content = data.html;
                                var row = $("<tr><td></td></tr>").html(content);
                                //$("<tr>"+row+"</tr>").prependTo("table > tbody");
                                row.prependTo("table > tbody");
                            }
                        );
                    }
                    else{
                        if ($.inArray(resp[i].tweet_id, visible) == -1){
                            visible.push(resp[i].tweet_id);
                            $.getJSON(
                                embed_url + resp[i].tweet_id,
                                function(data){
                                    var content = data.html;
                                    var row = $("<tr><td></td></tr>").html(content);
                                    //$("<tr>"+row+"</tr>").prependTo("table > tbody");
                                    row.prependTo("table > tbody");
                                }
                            );
                        }
                    }
                }
                first = false;
            }
        );
    };

    update_ui();
    window.setInterval(update_ui, 10000);

});

