const express      = require("express"),
      app          = express(),
      bodyParser   = require("body-parser"),
      mongoose     = require("mongoose"),
      passport     = require("passport"),
      localStrategy= require("passport-local"),
      User         = require("./models/user"),
      methodOverride = require("method-override"),
      flash        = require("connect-flash"),

      CampgroundRoutes = require("./routes/campground"),
      CommentsRoutes = require("./routes/comments"),
      IndexRoutes = require("./routes/index"),
      ProfileRoutes = require("./routes/profile")

mongoose.connect("mongodb://localhost:27017/yelpCamp", {useNewUrlParser:true, useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());


//passport configuration
app.use(require("express-session")({
    secret: "Find a job is my goal",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/home", CampgroundRoutes);
app.use("/home/:id/comment", CommentsRoutes);
app.use(IndexRoutes);
app.use("/home",ProfileRoutes);

//listen to the port
var port = process.env.PORT || 3000;
app.listen(port, () =>{
   console.log("Server Has Been Started!")
});
