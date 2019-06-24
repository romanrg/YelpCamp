let express       =    require('express'),
    app           =    express(),
    bodyParser    =    require('body-parser'),
    Campground    =    require('./models/campground'),
    Comment       =    require('./models/comment'),
    mongoose      =    require('mongoose'),
    seedDB        =    require('./seeds'),
    passport      =    require('passport'),
    User          =    require("./models/user"),
    LocalStrategy = require("passport-local")

/*APP CONFIGURATION */
mongoose.connect("mongodb://localhost/yelp_camp",
                 {useNewUrlParser: true}
);
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
seedDB();
/*PASSPORT CONFIGURATION */
app.use(require("express-session")({
    secret: "When I was young and fell in love I ask my sweetheart",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    next();
})
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



/*ROUTES*/ 

app.get('/', (req, res) => {
    res.redirect('index');
});



//INDEX - show all camps
app.get('/index', (req, res) => {
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
app.post('/index', (req, res) => {
    let name        =            req.body.name,
        image       =           req.body.image,
        description =     req.body.description
        newCamp  = {name:name, image:image, description:description};
    Campground.create(newCamp, (err, createdCamp) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect("./index");
            }
    });    
});

//NEW - show form to create new camp
app.get('/index/new', (req, res) => {
    res.render("campgrounds/new");
});

//SHOW - shows more info about one camp 
app.get('/index/:id', (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCamp) => {
        if (err) {
            console.log(err);
        } else {            
            res.render('campgrounds/show', {camp: foundCamp});
        }
    });   
});

//==============================
//Comments ROUTES
//==============================

app.get("/index/:id/comments/new", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, camp) => {
        if(err){
            console.log(err)
        } else {
            res.render("comments/new", {camp:camp});
        }
    });    
});

app.post("/index/:id/comments", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCamp) => {
        if(err) {
            console.log(err);
            res.redirect("/index");
        } else {
            Comment.create(req.body.comment, (err, comment)=>{
                if(err) {
                    console.log(err);
                } else {
                    foundCamp.comments.push(comment);
                    foundCamp.save();
                    res.redirect(`/index/${foundCamp._id}`);
                }
            });
        }
    })
});





/*================================================== */
//AUTH ROUTES
/*================================================== */
function isLoggedIn (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
};



app.get("/register",(req, res) => {
    res.render("register");
});
app.post("/register", (req, res) => {
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
app.get("/login", (req, res)=>{
    res.render("login");
});
app.post("/login", passport.authenticate("local", {
    successRedirect: "/index",
    failureRedirect: "/login"
}) ,(req, res) => {    
});

//Logout 
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
})


/*================================================== */
app.listen(3000, ()=>{
    console.log("Server started");
});