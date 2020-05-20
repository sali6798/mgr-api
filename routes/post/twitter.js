const router = require("express").Router();
const Twitter = require("twitter");
require('dotenv').config();
const fs = require("fs");
const path = require('path')



router.post('/tweet', (req, res) => {

    const client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: req.user.twitterAccessToken,
        access_token_secret: req.user.twitterRefreshToken
    })

    client.post("statuses/update", { status: "Yet Blah" }, function (error, tweet, response) {
        if (error) {
            console.log(error)
        } else {
            console.log(tweet)
        }
        return res.json(tweet)

    })
})

router.post('/image', (req, res) => {
    const client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: req.user.twitterAccessToken,
        access_token_secret: req.user.twitterRefreshToken
    })

    const imageData = fs.readFileSync(path.join(__dirname, "quizPanda.png"))//replace with the path to your image

    client.post("media/upload", imageData, function (error, media, response) {
        if (error) {
            console.log(error)
        } else {
            const status = {
                status: "Random tweet with photo!",
                media_ids: media.media_id_string,

            }

            // const status = {status:"This is a tweet"}

            client.post("statuses/update", status, function (error, tweet, response) {
                if (error) {
                    console.log(error)
                } else {
                    console.log("Successfully tweeted an image!")
                }
                return res.json(response)
            })
        }
    })
})


module.exports = router;