

import mongoose from "mongoose";
const dbconnect = async () => {

    try {

        await mongoose.connect(process.env.MONGODB_URL) 
        console.log("Connected to database");       
    } 
    
    
    catch (error) {
        console.log("Error in connecting to database");
        console.log(error);
    }    
}


export default dbconnect;    


