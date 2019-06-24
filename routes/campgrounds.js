let express = require("express");
let router = express.Router();
let Campground = require("../models/campground");

//INDEX - show all camps
router.get('/', (req, res) => {
    Campground.find({}, (err, camps) => {
        if(err) {
            console.log(err);
        } else {
            res.render('campgrounds/index',
             {
                campgrounds : camps                
            });
        }
    });  
});
//CREATE - add camp to db
router.post('/', isLoggedIn, (req, res) => {
    let name        =            req.body.name,
        image       =           req.body.image,
        description =     req.body.description,
        author   = {
            id: req.user._id,
            username: req.user.username
        },
        newCamp  = {name:name, image:image, description:description, author: author};
    Campground.create(newCamp, (err, createdCamp) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect("./index");
            }
    });    
});
//NEW - show form to create new camp
router.get('/new', isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});
//SHOW - shows more info about one camp 
router.get('/:id', (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCamp) => {
        if (err) {
            console.log(err);
        } else {            
            res.render('campgrounds/show', {camp: foundCamp});
        }
    });   
});

//Edit Route
router.get("/:id/edit", checkCampOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCamp) => {
        res.render("campgrounds/edit", {camp:foundCamp})
    });         
});




//Update Route
router.put("/:id", checkCampOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, (err, updatedCamp) => {
        if(err){
            console.log(err);
            res.redirect("/index");
        } else {
            res.redirect(`/index/${req.params.id}`);
        }
    })
});


//DESTROY
router.delete("/:id", checkCampOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if(err) {
            res.redirect("/index");
        } else {
            res.redirect("/index");
        }
    })
});

//MiddleWare
function isLoggedIn (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
};


function checkCampOwnership (req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundCamp) => {
            if(err) {
                res.redirect("back");
            } else {
                if(foundCamp.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }                
            }
        }); 
    } else {
        res.redirect("back");
    };
};

module.exports = router;

