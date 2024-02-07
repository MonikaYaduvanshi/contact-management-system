require("dotenv").config({path : "./config/config.env"});
const express = require('express');
const morgan = require('morgan');
const connectDB = require("./config/db.js");
const auth = require("./middlewares/auth.js");

const app = express();
app.use(express.json());
app.use(morgan("tiny"));

app.get("/",  (req, res) => {
    res.send("Hello World");
});
app.use("/api", require("./routes/auth"));
app.get("/protected" , auth, (req, res) => {
    return res.status(200).json({user : req.user});
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, async() => {
    try{
        console.log("db connection started ");
        await connectDB();
        console.log("app is listening at PORT: " , PORT);
    }catch(err){
        console.log(err);
    }
})