const db = require("../models");
const nodemailer = require("nodemailer");
const moment = require("moment")
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
        db.Post
            .find(req.query)
            .sort({ date: -1 })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    findById: function (req, res) {
        db.Post
            .findById(req.params.id)
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    create: async function (req, res) {
        try {
            const post = await db.Post.create(req.body);
            const group = await db.Group.findOneAndUpdate({ _id: req.body.groupId }, { $push: { posts: post._id } }, { new: true });

            if (post.status === "ready") {
                const users = await db.User.find({ groups: req.body.groupId });
                users.forEach(user => {
                    const mailOptions = {
                        from: process.env.EMAIL,
                        to: `${user.email}`,
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
                })
            }

            res.json(group);
            
        } catch (err) {
            res.json(err)
        }
    },
    update: async function (req, res) {

        if (req.body.status === "ready") {
            const post = await db.Post.findOneAndUpdate({ 
                _id: req.params.id 
            }, 
            {
                body: req.body.body,
                eventTitle: req.body.eventTitle,
                imageLinks: req.body.imageLinks,
                release: moment(),
                status: req.body.status
            });

            req.body.artists.forEach(artist => {
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: `${artist}`,
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
            })
        }
        else {
            db.Post
                .findOneAndUpdate({ _id: req.params.id }, req.body)
                .then(dbModel => res.json(dbModel))
                .catch(err => res.status(422).json(err));
        }
        


    },
    remove: function (req, res) {
        db.Post
            .findById({ _id: req.params.id })
            .then(dbModel => dbModel.remove())
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    }
};