const express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware")

//goto show all the campground page (index page)
router.get("/", (req, res) =>{
    Campground.find({}, (err, allCampground)=>{
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/home", {allCampground: allCampground, currentUser: req.user});
        }
    });
});

//add a new campground in database
router.post("/", middleware.islogin, (req, res) =>{
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.img;
    var dec = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newOne = {name: name, price: price, img: image, description: dec, author: author};
    Campground.create(newOne, (err) =>{
        if(err){
            console.log(err);
        }else{
            res.redirect("/home");
        }
    });
});

//goto campground add new page
router.get("/new", middleware.islogin, (req, res) =>{
    res.render("campgrounds/new");
});

//goto show page with comment
router.get("/:id", (req,res) =>{
    Campground.findById(req.params.id).populate("comments").exec( (err, foundCamp) =>{
        if (err){
            console.log(err);
        }else{
            res.render("campgrounds/show", {foundCamp: foundCamp});
        }
    });
});

//goto edit page
router.get("/:id/edit",middleware.checkCampgroundRight, (req, res) =>{
    Campground.findById(req.params.id, (err, foundedCamp) =>{
        if (err){
            console.log(err);
        }
       res.render("campgrounds/edit", {foundedCamp: foundedCamp});
    });
});

//edit the campground in the database
router.put("/:id",middleware.checkCampgroundRight, (req, res) =>{
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err) =>{
       if (err){
           console.log(err);
       }
       res.redirect("/home/" + req.params.id);
   });
});

//delete the campground
router.delete("/:id",middleware.checkCampgroundRight, (req, res) =>{
   Campground.findByIdAndRemove(req.params.id, (err) =>{
      if (err){
          console.log(err);
      }else{
          res.redirect("/home");
      }
   });
});

module.exports = router;
