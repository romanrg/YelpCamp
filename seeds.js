let mongoose     =    require("mongoose");
let Campground   =    require('./models/campground');
let Comment      =    require('./models/comment');
let User         =    require('./models/user');
let data         =    [
    {
        name: "Oak's Heart",
        image: "https://images.unsplash.com/photo-1482376292551-03dfcb8c0c74?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: "Dragon Nest",
        image: "https://images.unsplash.com/photo-1478810810369-07072c5ef88b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: "Vanilla Sky Black Camp",
        image: "https://images.unsplash.com/photo-1528492203317-873be2c040dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },

];


function seedDB() {
    //remove all Campgrounds
    Campground.remove({}, (e) => {
        if(e) {
            console.log(e);
        }            
    });
    Comment.remove({}, (e) => {
        if(e) {
            console.log(e);
        }            
    });
    User.remove({}, (e) => {
        if(e) {
            console.log(e);
        }            
    });

    //add a few camp 
    data.forEach(seed => {
        Campground.create(seed, (e, camp) => {
            if (e) {
                console.log(e);
            }
            
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
                });
        });
    });
    
    // add a few comments
}

module.exports = seedDB;