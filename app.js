require('dotenv').config() //doteve environment

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const  mongoose  = require("mongoose");
const encrypt = require("mongoose-encryption"); // data encryption

const app = express();

console.log(process.env.API_KEY); // eve file key

app.set('view engine', 'ejs'); // same this no space 


app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));


mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new  mongoose.Schema ({ // create data for the wikiDB

    email: String,
    password:String
});

//const secret = (process.env.API_KEY); // make the data  in encypted form

userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields: ['password'] }); // encrypt the password feild

const User = mongoose.model("User" , userSchema);




app.get("/", function(req, res){
    res.render("home"); // its access  home page
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});



app.post("/register", function(req, res){  // HTML form (email and password ) NAME pass

    const newUser = new User({

        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err){ // save the email and password
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        }
    });

});


app.post("/login", function(req,res){ // match the data from the register page for user login 

    const username = req.body.username;
    const password = req.body.password;


User.findOne({email: username}, function(err, foundUser){

if(err){
    console.log(err);

}else{
    if(foundUser){
        if(foundUser.password === password){
         res.render("secrets");
        }
    }
}

});

});


app.listen(3000, function(){
    console.log("Sucessfully server port 3000");
});