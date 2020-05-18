const router = require("express").Router();
const usersController = require("../../controllers/usersController");

//User routes: /api/user/
router.route("/")
    .get(usersController.findAll)
    .post(usersController.create);

//User routes by ID: /api/user/:id
router.route("/:id")
    .get(usersController.findById)
    .put(usersController.update)
    .delete(usersController.remove);

//User routes: /api/user/add/group
router.route("/add/group")
    .put(usersController.addGroup);

router.route("/find/group/:id")
    .get(usersController.findGroupArtists);

router.route("/delete/group")
    .put(usersController.deleteGroup);

module.exports = router;
