const router = require("express").Router();
const Twitter = require("twitter");
require('dotenv').config();


router.post('/', (req, res) => {

    const client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: req.user.twitterAccessToken,
        access_token_secret: req.user.twitterRefreshToken
    })

    client.post("statuses/update", { status: "Oops, I tweeted." }, function (error, tweet, response) {
        if (error) {
            console.log(error)
        } else {
            console.log(tweet)
        }
        return res.json(tweet)

    })
})


module.exports = router;