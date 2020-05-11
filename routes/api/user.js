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

module.exports = router;
