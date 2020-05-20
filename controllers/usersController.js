const db = require("../models");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
require('dotenv').config();

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
    },
    addEvent: function (req, res) {
        db.User
            // .findById(req.user._id)
            .findOneAndUpdate({ _id: req.user._id }, { $set: { myEvents: req.body.events }}, { new: true })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.json(err));
    }
};

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});


cron.schedule("5 * * * *", function() {

    const mailOptions = {
        from: process.env.EMAIL,
        to: `shaidee.alingcastre@gmail.com`,
        subject: ` sent you a quiz to play on Quiz Panda!`,
        text: `Login on https://quizpanda.herokuapp.com and enter the access code `
    };
    // const mailOptions = {
    //     from: process.env.EMAIL,
    //     to: `${email}`,
    //     subject: `${req.body.firstName} ${req.body.lastName} sent you a quiz to play on Quiz Panda!`,
    //     text: `Login on https://quizpanda.herokuapp.com and enter the access code ${req.body.accessCode}`
    // };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.json(error)
        } else {
            console.log('Email sent: ' + info.response);
            res.json('Email sent: ' + info.response);
        }
    });
})