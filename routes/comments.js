let express = require("express");
let router = express.Router({mergeParams: true});
let Campground = require("../models/campground");
let Comment = require("../models/comment");

router.get("/new", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, camp) => {
        if(err){
            console.log(err)
        } else {
            res.render("comments/new", {camp:camp});
        }
    });    
});

router.post("/", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCamp) => {
        if(err) {
            console.log(err);
            res.redirect("/index");
        } else {
            Comment.create(req.body.comment, (err, comment)=>{
                if(err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundCamp.comments.push(comment);
                    foundCamp.save();
                    res.redirect(`/index/${foundCamp._id}`);
                }
            });
        }
    })
});

function isLoggedIn (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
};


module.exports = router;

