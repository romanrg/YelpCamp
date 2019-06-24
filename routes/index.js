let express       = require("express");
let router        = express.Router();
let passport      =    require('passport');
let User          =    require("../models/user");



function isLoggedIn (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
};


router.get('/', (req, res) => {
    res.redirect('index');
});


router.get("/register",(req, res) => {
    res.render("register");
});
router.post("/register", (req, res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            console.log(err);
            return res.render("/register");
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/index");
        });
    })
});



///login 
router.get("/login", (req, res)=>{
    res.render("login");
});
router.post("/login", passport.authenticate("local", {
    successRedirect: "/index",
    failureRedirect: "/login"
}) ,(req, res) => {    
});

//Logout 
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
})

module.exports = router;