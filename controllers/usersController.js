const db = require("../models");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const moment = require("moment");
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

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
            .findOneAndUpdate({ _id: req.user._id }, { $set: { myEvents: req.body.events } }, { new: true })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.json(err));
    }
};

cron.schedule("0 0 * * *", async function () {
    // const today = moment().startOf("day");
    // const todaysP6sts = await db.Post.find({
    //     release: {
    //         $gte: today.toDate(),
    //         $lte: moment(today).endOf("day").toDate()
    //     }
    // })

    // const todaysPosts = await db.User.find({
    //     release: {
    //         $gte: today.toDate(),
    //         $lte: moment(today).endOf("day").toDate()
    //     }
    // })

    try {
        const today = moment().startOf("day");
        await db.Post
            .updateMany({
                release: {
                    $lt: today.toDate()
                },
                status: { $in: ["ready", "later"] }
            }, {
                $set: {
                    status: "past"
                }
            })

        const users = await db.User
            .find({ isManager: false })
            .populate({
                path: "groups",
                model: "Group",
                populate: {
                    path: "posts",
                    model: "Post"
                }
            })

        for (let i = 0; i < users.length; i++) {
            // console.log(`========== ${i} ============`);
            // console.log(users[i]);
            // console.log(users[i].groups)
            for (let j = 0; j < users[i].groups.length; j++) {
                // console.log(`--------- ${j} ----------`);
                for (let k = 0; k < users[i].groups[j].posts.length; k++) {
                    // console.log(`~~~~~~~~~ ${k} ~~~~~~~~~~`);
                    // console.log(users[i].groups[j].posts[k])
                    const post = users[i].groups[j].posts[k];
                    if (moment().isSame(post.release, 'day') && post.status !== "draft") {

                        if (post.status === "later") {
                            const updatedPost = await db.Post.findOneAndUpdate({ _id: post._id }, { $set: { status: "ready" } }, { new: true });
                            console.log(updatedPost)
                        }

                        const mailOptions = {
                            from: process.env.EMAIL,
                            to: `${users[i].email}`,
                            subject: `MGR - ATTN: ${post.eventTitle} Due Today`,
                            text: `Visit your Dashboard https://mgr-talent.herokuapp.com/dashboard to see event details`
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                                res.json(error)
                            } else {
                                console.log('Email sent: ' + info.response);
                                res.json('Email sent: ' + info.response);
                            }
                        });

                    }
                }
            }
        }
    } catch (error) {
        console.log(error)
    }


})