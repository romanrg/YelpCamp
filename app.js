let express        =    require('express'),
    app            =    express(),
    bodyParser     =    require('body-parser'),
    Campground     =    require('./models/campground'),
    Comment        =    require('./models/comment'),
    mongoose       =    require('mongoose'),
    seedDB         =    require('./seeds'),
    passport       =    require('passport'),
    User           =    require("./models/user"),
    methodOverride = require("method-override"),
    LocalStrategy  = require("passport-local");

let commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");

/*APP CONFIGURATION */
mongoose.connect("mongodb://localhost/yelp_camp",
                 {useNewUrlParser: true}
);
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//seedDB();
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
});

//requiring ROUTES
app.use("/", indexRoutes);
app.use("/index", campgroundRoutes);
app.use("/index/:id/comments", commentRoutes);


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.listen(3000, ()=>{
    console.log("Server started");
});