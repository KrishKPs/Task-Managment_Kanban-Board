

import dbconnect from "../../../Lib/mongo";
import User from "../../../Model/User";    
import bcrypt from "bcryptjs";   
import jwt from "jsonwebtoken"; 


const login = async (req,res) => {

    if(req.method === 'POST') {
        await dbconnect();
    }   

    const {username , password} = req.body;  

    const Exists = await User.findOne ( {username}); 
     if (!Exists) {
         res.status(404).json({msg: "User not found"});
         return;
     } 


     const checkpassword = await bcrypt.compare(password, Exists.password);      
        if (!checkpassword) {
            res.status(401).json({msg: "Invalid credentials"});
            return;
        }    

        const token = jwt.sign({ username : Exists.username}, process.env.JWT_SECRET);   

        res.status(200).json({
            msg : "User logged in",
            token : token
        });      


}

export default login;        