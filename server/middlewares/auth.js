const jwt = require("jsonwebtoken");
const user = require("../models/user");

module.exports = (req, res, next) => {
    const authHeaders = req.headers.authorization;

    if(authHeaders){
        const token = authHeaders && authHeaders.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, async(err, payload) => {
            try{
                if(err){
                    return res.status(401).json({error: "Unauthorized"});
                }else{
                    const loggedUser = await user.findOne({_id : payload._id}).select("-password");
                    req.user = loggedUser;
                    next();
                }
            }catch(err){
                console.log("error in token validation");
            }
            
        })
    }else{
        return res.status(403).json({"error:  " : "No authorization."}); 
    }
}