CREATE TABLE TWEET_STORE
(
    id INTEGER AUTO_INCREMENT,
    tweet_id varchar(30) UNIQUE,
    hashtag varchar(60),
    constraint tweet_pk PRIMARY key (id)
);