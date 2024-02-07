const router = require('express').Router();
const bcrypt = require('bcrypt');
const user =  require("../models/user");
const jwt = require("jsonwebtoken");


router.post("/register", async(req, res) =>{

    const {username, email, password} = req.body;

     
    if(!username || !email || !password){
        return res.status(400).json({error : "Required field is missing"});
    }
    // name validation 
    if(username.length >25 ){
        return res.status(400).json({error:'Username should be less than 25 characters'});
    }
    // check email validation
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({error: 'Invalid Email'});
    }
    // password validation
    if(password.length <= 7){
        return res.status(400).json({error:'Password should be at least 8 characters long'});
    }

    // creating user schema
    try {

        const userAlreadyExist  = await user.findOne({email});
        if (userAlreadyExist) {
            return res.status(400).json({error : "User already exist!"});
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        let newUser = new user({username, email, password : hashedPassword}); 
        // save user

        const result = await newUser.save();
        result._doc.password = undefined;

        return res.status(201).json({...result._doc});

    }
    catch(err){
        console.log(err);
        return res.status(500).json({"error" : err.message});
    }
})

router.post("/login", async(req, res) => {
    const {email , password} = req.body ;
    // field validations
    if(!email || !password) {
        return res.status(400).json({error : "Required fields are missing"});
    }

    try{
        const userData = await user.findOne({email});
        // email and password security check
        if(!userData){
            return res.status(400).json({error : "Enter correct Email or password"});
        }
        const isValidPassord = await bcrypt.compare(password, userData.password);
        if(!isValidPassord){
            return res.status(400).json({error : "Enter correct Email or password"});
        }
        console.log("validation successfull-----");
        const payload = {_id : userData._id};
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn : "1h"});
        return res.status(200).json({token});
    
    }catch(err){
        return res.status(500).json({error : err.message});
    }
});


module.exports = router;