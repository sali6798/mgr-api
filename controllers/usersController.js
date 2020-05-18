const db = require("../models");

module.exports = {
    findAll: function (req, res) {
        db.User
            .find(req.query)
            .sort({ date: -1 })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    findById: function (req, res) {
        db.User
            .findById(req.params.id)
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    create: function (req, res) {
        db.User
            .create(req.body)
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    update: function (req, res) {
        db.User
            .findOneAndUpdate({ _id: req.params.id }, req.body)
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    remove: function (req, res) {
        db.User
            .findById({ _id: req.params.id })
            .then(dbModel => dbModel.remove())
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    addGroup: async function (req, res) {
        let updatedUsers = [];

        for await (const artist of req.body.artists) {
            db.User
                .findOneAndUpdate({ email: artist.email }, { $push: { groups: req.body.groupId } }, { new: true })
                .then(dbModel => updatedUsers.push(dbModel))
                .catch(err => res.status(422).json(err));
        }

        res.json(updatedUsers);
    },
    findGroupArtists: function (req, res) {
        db.User.find({ groups: req.params.id })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    deleteGroup: function (req, res) {
        db.User
            .findOneAndUpdate({ _id: req.body.id }, { $pull: { groups: req.body.groupId } }, { new: true })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.json(err));
    },
    getGroupInfo: function (req, res) {
        db.User
            .findById(req.params.id)
            .populate({
                path: "groups",
                model: "Group",
                populate: {
                    path: "posts",
                    model: "Post"
                }
            })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.json(err));
    }
};