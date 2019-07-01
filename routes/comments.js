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

//COMMENTS EDIT ROUTE
router.get('/:comment_id/edit', (req, res)=>{
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {camp_id: req.params.id, comment: foundComment});
        }
    });    
});
//COMMENT UPDATE
router.put('/:comment_id', (req, res)=> {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=>{
        if(err) {
            res.redirect('back');
        } else {
            res.redirect(`/index/${req.params.id}`);
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

