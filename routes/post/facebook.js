const router = require("express").Router();
const axios = require("axios")
require('dotenv').config();
let ImgArr = [];


//get every pages information that belong to user
router.get('/pagesinfo', async (req, res) => {
    console.log("req.user.facebookAccessToken", req.user.facebookAccessToken);

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


//multi-image post
//  '/post/facebook/image/multiple
router.post("/image", async (req, res) => {

    try {
        const pageId = req.body.pageId;
        const pageToken = req.body.pageToken;
        const text = req.body.text;
        const imgURLS = req.body.urls;

        for await (let url of imgURLS) {
            const completeURL = `https://graph.facebook.com/${pageId}/photos?url=${url}&access_token=${pageToken}&published=false`
            const imgId = await axios.post(completeURL)
            ImgArr.push(imgId.data.id)
        }
        
        let i = 0;
        let endpointArr = [];
        
        for await (let img of ImgArr) {
            const endpoint = `&attached_media[${i}]={"media_fbid":"${img}"}`
            endpointArr.push(endpoint)
            i++
        }
        
        let fullEndpoint = endpointArr.join("");

        let completeURL = `https://graph.facebook.com/${pageId}/feed?access_token=${pageToken}&message=${text}${fullEndpoint}`;

        const response = await axios.post(completeURL);
        ImgArr = [];
        return res.json(response.data);

    } catch (err) {

        console.log(err)
        ImgArr = [];
        res.json(err)
    }
})


module.exports = router;