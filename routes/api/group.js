const router = require("express").Router();
const groupsController = require("../../controllers/groupsController");

//group routes: /api/group/
router.route("/")
    .get(groupsController.findAll)
    .post(groupsController.create);

//group routes by ID: /api/group/:id   
router.route("/:id")
    .get(groupsController.findById)
    .put(groupsController.update)
    .delete(groupsController.remove);

router.route("/find/manager")
    .get(groupsController.findByManager)

module.exports = router;
