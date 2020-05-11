const router = require("express").Router();
const postsController = require("../../controllers/postsController");

//Post routes: /api/post/
router.route("/")
    .get(postsController.findAll)
    .post(postsController.create);

    //Post routes by ID: /api/post/:id
router.route("/:id")
    .get(postsController.findById)
    .put(postsController.update)
    .delete(postsController.remove);

module.exports = router;
