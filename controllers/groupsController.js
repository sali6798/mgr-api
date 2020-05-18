const db = require("../models");

module.exports = {
    findAll: function (req, res) {
        db.Group
            .find(req.query)
            .sort({ date: -1 })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    findById: function (req, res) {
        db.Group
            .findOne({ _id: req.params.id })
            .populate("posts")
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    create: function (req, res) {
        const group = {
            manager: req.user._id,
            // manager: "5ec02a2b80cc2d11a83da03c",
            name: req.body.name
        }
        console.log(group)

        db.Group
            .create(group)
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    update: function (req, res) {
        db.Group
            .findOneAndUpdate({ _id: req.params.id }, req.body)
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    remove: async function (req, res) {
        await db.User.updateMany({}, { $pull: { groups: req.params.id }}, { multi: true })
        
        db.Group
            .deleteOne({ _id: req.params.id })
            .then(dbModel => req.json(dbModel))
            .catch(err => res.json(err))
    },
    findByManager: function (req, res) {
        console.log(req.session.id)
        db.Group
            .find({ manager: req.user._id })
            // .find({manager: "5ec02a2b80cc2d11a83da03c"})
            .populate("posts")
            .then(dbModel => {
                console.log(dbModel)
                res.json(dbModel)})
            .catch(err => res.status(422).json(err));
    }
};