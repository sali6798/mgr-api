const router = require("express").Router();
const Twitter = require("twitter");
require('dotenv').config();
const fs = require("fs");
const path = require('path');
const base64Img = require('base64-img');
const https = require('https');


router.post('/tweet', (req, res) => {

    const client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: req.user.twitterAccessToken,
        access_token_secret: req.user.twitterRefreshToken
    })

    const text = req.body.text


    client.post("statuses/update", { status: text }, function (error, tweet, response) {
        if (error) {
            console.log(error)
        } else {
            console.log(tweet)
        }
        return res.json(tweet)

    })
})

// router.post('/image', (req, res) => {
//     const client = new Twitter({
//         consumer_key: process.env.TWITTER_CONSUMER_KEY,
//         consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
//         access_token_key: req.user.twitterAccessToken,
//         access_token_secret: req.user.twitterRefreshToken
//     })

//     const imageData = fs.readFileSync(path.join(__dirname, "/Brett.jpg"))//replace with the path to your image
//     console.log(imageData);


//     client.post("media/upload", imageData, function (error, media, response) {
//         console.log(error);
//         console.log(response);

//         if (error) {
//             console.log('1st error', error)
//         } else {
//             const status = {
//                 status: "Random tweet with photo!",
//                 media_ids: media.media_id_string,
//             }

//             client.post("statuses/update", status, function (error, tweet, response) {
//                 if (error) {
//                     console.log('2nd error', error)
//                 } else {
//                     console.log("Successfully tweeted an image!")
//                 }
//                 return res.json(response)
//             })
//         }
//     })
// })

router.post('/media', function async(req, res) {
    const dest = "./temp.jpg"
    function download() {
        console.log("download");

        return new Promise((resolve, reject) => {

            const file = fs.createWriteStream(dest, { flags: "wx" });

            const request = https.get(req.body.url, response => {
                if (response.statusCode === 200) {
                    response.pipe(file);
                } else {
                    file.close();
                    fs.unlink(dest, () => { }); // Delete temp file
                    reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
                }
            });

            request.on("error", err => {
                file.close();
                fs.unlink(dest, () => { }); // Delete temp file
                reject("Bad file request", err.message);
            });

            file.on("finish", () => {
                resolve();
            });

            file.on("error", err => {
                file.close();

                if (err.code === "EEXIST") {
                    reject("File already exists");
                } else {
                    fs.unlink(dest, () => { }); // Delete temp file
                    reject("File has errors", err.message);
                }
            });
        });
    }

    const client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: req.user.twitterAccessToken,
        access_token_secret: req.user.twitterRefreshToken
    })

    // const pathToFile = "http://res.cloudinary.com/mgr/image/upload/v1589655643/kwsv5tngyysrkcosi8su.png"
    // const mediaType = "image/jpg"

    // const mediaData = fs.readFileSync(path.join(__dirname, dest))
    // console.log(mediaData);

    // const mediaSize = fs.statSync(path.join(__dirname, dest)).size
    // console.log(mediaSize);

    download()
        .then(initializeMediaUpload)
        .then(appendFileChunk)
        .then(finalizeUpload)
        .then(deleteTempFile)
        .then(publishStatusUpdate)


    function initializeMediaUpload() {
        console.log('init');
        const mediaType = "image/jpg"
        const mediaSize = fs.statSync(path.join(dest)).size

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

        const mediaData = fs.readFileSync(path.join(dest))

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
                status: req.body.text,
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

    function deleteTempFile(path) {
        console.log("delete");

        fs.unlink(dest, (err) => {
            if (err) {
                console.log("failed to delete local image:" + err);
            } else {
                console.log('successfully deleted local image');
            }
        })
    };
})

module.exports = router;