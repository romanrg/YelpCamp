let express      =    require('express'),
    app          =    express(),
    bodyParser   =    require('body-parser'),
    Campground   =    require('./models/campground'),
    mongoose     =    require('mongoose'),
    seedDB       =    require('./seeds');


mongoose.connect("mongodb://localhost/yelp_camp",
                 {useNewUrlParser: true}
);
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
seedDB();

app.get('/', (req, res) => {
    res.render('landing');
});



//INDEX - show all camps
app.get('/index', (req, res) => {
    Campground.find({}, (err, camps) => {
        if(err) {
            console.log(err);
        } else {
            res.render('index', {campgrounds : camps});
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
    res.render("new");
});

//SHOW - shows more info about one camp 
app.get('/index/:id', (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCamp) => {
        if (err) {
            console.log(err);
        } else {            
            res.render('show', {camp: foundCamp});
        }
    });   
});




app.listen(3000, ()=>{
    console.log("server start");
});