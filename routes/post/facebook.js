const router = require("express").Router();
const axios = require("axios")

require('dotenv').config();

//text-based post
//  '/post/facebook
router.post("/", async (req, res) => {

    const pageId = req.body.pageId
    const pageToken = req.body.pageToken;
    const text = req.body.text;
    const completeURL = `https://graph.facebook.com/${pageId}/feed?message=${text}&access_token=${pageToken}`

    try {
        const status = await axios.post(completeURL)
        return res.json(status.data)
    } catch (err) {
        console.log(err);
    }
})

//get every pages information that belong to user
router.get('/pagesinfo', async (req, res) => {
console.log("req.user.facebookAccessToken",req.user.facebookAccessToken);

    const userId = req.user.facebookId;
    const userToken = req.user.facebookAccessToken;
    const completeURL = `https://graph.facebook.com/${userId}/accounts?access_token=${userToken}`

    try {
        let { data } = await axios.get(completeURL)
        return res.json(data.data)
    } catch (err) {
        console.log(err)
        res.json(err)
    }
})


//single image post
//  '/post/facebook/image/single
router.post("/image/single", async (req, res) => {

    const pageId = req.body.pageId;
    const pageToken = req.body.pageToken;
    const text = req.body.text;
    const imgURL = req.body.img;
    const completeURL = `https://graph.facebook.com/${pageId}/photos?url=${imgURL}&caption=${text}&access_token=${pageToken}`

    try {
        let status = await axios.post(completeURL)
        return res.json(status.data)
    } catch (err) {
        console.log(err)
        res.json(err)
    }

})


//multi-image post
//  '/post/facebook/image/multiple
router.post("/image/multiple", (req, res) => {

})


module.exports = router;