const router = require("express").Router();
const Twitter = require("twitter");
require('dotenv').config();


//text-based post
//  '/post/facebook
router.post('/', (req, res) => {

})


//single image post
//  '/post/facebook/image/single
router.post("/image/single", (req, res) => {
  
})


//multi-image post
//  '/post/facebook/image/multiple
router.post("/image/multiple", (req, res) => {

})


module.exports = router;