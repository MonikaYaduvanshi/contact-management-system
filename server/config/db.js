const mongoose = require('mongoose');

const connectDB = async () =>{
    return mongoose
    .connect("mongodb+srv://monikarao000:Monika%40123@contact-management-syst.k2gn3ab.mongodb.net/")
    .then(() => console.log("connected to database at port"))
    .catch((err) => console.log("error---" , err))
}

module.exports = connectDB;