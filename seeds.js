let mongoose     =    require("mongoose");
let Campground   =    require('./models/campground');
let Comment      =    require('./models/comment');
let data         =    [
    {
        name: "Oak's Heart",
        image: "https://images.unsplash.com/photo-1482376292551-03dfcb8c0c74?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80",
        description: "Here we see Yeti!"
    },
    {
        name: "Dragon Nest",
        image: "https://images.unsplash.com/photo-1478810810369-07072c5ef88b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
        description: "Here we see a Red Diamond Dragon!"
    },
    {
        name: "Vanilla Sky Black Camp",
        image: "https://images.unsplash.com/photo-1528492203317-873be2c040dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60",
        description: "Milkshake sky was seen there!"
    },

];


function seedDB() {
    //remove all Campgrounds
    Campground.remove({}, (e) => {
        if(e) {
            console.log(e);
        }
        console.log("removed camps");    
    });

    //add a few camp 
    data.forEach(seed => {
        Campground.create(seed, (e, camp) => {
            if (e) {
                console.log(e);
            }
            console.log("added a camp");
            //create a comments
            Comment.create(
                {
                    text: "This place is great, but I wish there was internet",
                    author: "Hamlet"
                }, (e, comment) => {
                    if(e){
                        console.log(e);
                    }
                    camp.comments.push(comment);
                    camp.save();
                    console.log("Create new comment");
                });
        });
    });
    
    // add a few comments
}

module.exports = seedDB;