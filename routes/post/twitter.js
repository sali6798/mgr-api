const router = require("express").Router();
const Twitter = require("twitter");
require('dotenv').config();
const fs = require("fs");
const path = require('path');
const base64Img = require('base64-img');


router.post('/tweet', (req, res) => {

    const client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: req.user.twitterAccessToken,
        access_token_secret: req.user.twitterRefreshToken
    })

    client.post("statuses/update", { status: "This is getting old..." }, function (error, tweet, response) {
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

    const imageData = fs.readFileSync(path.join(__dirname, "/Brett.jpg"))//replace with the path to your image
    console.log(imageData);


    client.post("media/upload", imageData, function (error, media, response) {
        console.log(error);
        console.log(response);
        if (error) {
            console.log('1st error', error)
        } else {
            const status = {
                status: "Random tweet with photo!",
                media_ids: media.media_id_string,

            }

            // const status = {status:"This is a tweet"}

            client.post("statuses/update", status, function (error, tweet, response) {
                if (error) {
                    console.log('2nd error', error)
                } else {
                    console.log("Successfully tweeted an image!")
                }
                return res.json(response)
            })
        }
    })
})

router.post('/media', (req, res) => {

    var url = 'http://res.cloudinary.com/mgr/image/upload/v1589655643/kwsv5tngyysrkcosi8su.png';
    base64Img.requestBase64(url, await function (err, res, body) {
        console.log('_________err', err);
        console.log('_________res', res.size);
        // console.log('_________body.data:   ', body);

        var src = body;
        var mediaData = src.substr(22);
        // console.log("mediaData", mediaData);

        let n = mediaData.length
        console.log("FileSize: " + mediaData.length);

        // where n is the length of base64 encoded string
        var mediaSize = 4 * Math.ceil(2 * n / 3);
        console.log('bytes', mediaSize);

    });
    
    const client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: req.user.twitterAccessToken,
        access_token_secret: req.user.twitterRefreshToken
    })

    // const pathToFile = "http://res.cloudinary.com/mgr/image/upload/v1589655643/kwsv5tngyysrkcosi8su.png"
    const mediaType = "image/png"

    // const mediaData = fs.readFileSync(path.join(__dirname, "/Brett.jpg"))
    // console.log(mediaData);

    // const mediaSize = fs.statSync(path.join(__dirname, "/Brett.jpg")).size
    // console.log(mediaSize);


    initializeMediaUpload()
        .then(appendFileChunk)
        .then(finalizeUpload)
        .then(publishStatusUpdate)

    function initializeMediaUpload() {
        console.log('init');

        return new Promise(function (resolve, reject) {
            client.post("media/upload", {
                command: "INIT",
                total_bytes: mediaSize,
                media_type: mediaType
            }, function (error, data, response) {
                if (error) {
                    console.log('init', error)
                    reject(error)
                } else {
                    resolve(data.media_id_string)
                }
            })
        })
    }

    function appendFileChunk(mediaId) {
        console.log('append');

        return new Promise(function (resolve, reject) {
            client.post("media/upload", {
                command: "APPEND",
                media_id: mediaId,
                media: mediaData,
                segment_index: 0
            }, function (error, data, response) {
                if (error) {
                    console.log('append', error)
                    reject(error)
                } else {
                    resolve(mediaId)
                }
            })
        })
    }

    function finalizeUpload(mediaId) {
        console.log('finalize');

        return new Promise(function (resolve, reject) {
            client.post("media/upload", {
                command: "FINALIZE",
                media_id: mediaId
            }, function (error, data, response) {
                if (error) {
                    console.log('finalize', error)
                    reject(error)
                } else {
                    resolve(mediaId)
                }
            })
        })
    }

    function publishStatusUpdate(mediaId) {
        console.log('publish');

        return new Promise(function (resolve, reject) {
            client.post("statuses/update", {
                status: "I tweeted from Node.js!",
                media_ids: mediaId
            }, function (error, data, response) {
                if (error) {
                    console.log('publish', error)
                    reject(error)
                } else {
                    console.log("Successfully uploaded media and tweeted!")
                    resolve(data)

                }
                res.json(response);
            })
        })
    }
})

module.exports = router;