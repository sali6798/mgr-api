const router = require("express").Router();
const Twitter = require("twitter");
require('dotenv').config();
const fs = require("fs")


router.post('/tweet', (req, res) => {

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

router.post('/image', (req, res) => {
    const client = new Twitter({
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token_key: req.user.twitterAccessToken,
        access_token_secret: req.user.twitterRefreshToken
    })

    const imageData = fs.readFileSync("../../images/MV5BODIxMzU2NjY1Ml5BMl5BanBnXkFtZTcwMjcyMDEzMg@@._V1_SX300.jpg") //replace with the path to your image

    client.post("media/upload", { media: imageData }, function (error, media, response) {
        if (error) {
            console.log(error)
        } else {
            const status = {
                status: "I tweeted from Node.js!",
                media_ids: media.media_id_string
            }

            client.post("statuses/update", { status: "Oops, I tweeted again." }, function (error, tweet, response) {
                if (error) {
                    console.log(error)
                } else {
                    console.log("Successfully tweeted an image!")
                }
            })
        }
    })
})


module.exports = router;