const router = require("express").Router();
const Twitter = require("twitter");
require('dotenv').config();
const fs = require("fs");
const path = require('path');
const base64Img = require('base64-img');
const https = require('https');
const http = require('http');



let mediaIdArr = [];


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

function download(url, dest) {
    console.log("download");
    console.log(url)
    console.log(dest)

    return new Promise((resolve, reject) => {

        const file = fs.createWriteStream(dest, { flags: "wx" });

        const request = http.get(url, response => {
            if (response.statusCode === 200) {
                console.log("hi")
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
            console.log("hellp")
            resolve(dest);
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

function initializeMediaUpload(dest, client) {
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

function appendFileChunk(mediaId, dest, client) {
    console.log('append');
    console.log(mediaId);
    mediaIdArr.push(mediaId)
    console.log('mediaIdArr', mediaIdArr);

    const mediaData = fs.readFileSync(path.join(dest))

    return new Promise(function (resolve, reject) {

        client.post("media/upload", {
            command: "APPEND",
            media_id: mediaIdArr,
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

function finalizeUpload(mediaId, client) {
    console.log('finalize');
    console.log(mediaId);

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

function deleteTempFile(dest) {
    console.log("delete");

    return new Promise(function (resolve, reject) {

        fs.unlink(dest, (error) => {

            if (error) {
                console.log("failed to delete local image:" + error);
                reject(error)
            } else {
                console.log('successfully deleted local image');
                resolve(dest)
            }
        })
    })
}

function publishStatusUpdate(client, text) {
    console.log('publish');
    console.log(mediaIdArr[0]);

    return new Promise(function (resolve, reject) {

        client.post("statuses/update", {
            status: text,
            media_ids: mediaIdArr.toString()
        }, function (error, data, response) {

            if (error) {
                console.log('publish', error)
                reject(error)
            } else {
                console.log("Successfully uploaded media and tweeted!")
                resolve(response)
            }
        })
    })
}

router.post('/media', async function (req, res) {
    try {
        console.log('req.body', req.body.urls);

        const client = new Twitter({
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            access_token_key: req.user.twitterAccessToken,
            access_token_secret: req.user.twitterRefreshToken
        })


        let i = 0;
        for await (let url of req.body.urls) {
            const dest = await download(url, `./${i}.jpg`);
            const mediaId = await initializeMediaUpload(dest, client);
            const result = await appendFileChunk(mediaId, dest, client);
            await finalizeUpload(result, client);
            await deleteTempFile(dest);
            i++;
        }

        const response = publishStatusUpdate(client, req.body.text);
        res.json(response);
    } catch (err) {
        console.log(err)
    }

})

module.exports = router;