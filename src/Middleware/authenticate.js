import jwt from 'jsonwebtoken';  

const authenticate = (req, res, next) => { 

    const token = req.headers.authorization;         

    if (!token) {
        return res.status(401).json({ msg: "No token provided" });
    }    

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);    
        console.log("Decoded token:", decoded);  // Log the decoded token        
        req.user = decoded;  // Set the entire decoded token payload
            
        console.log("User decoded from token:", req.user);  // Log the decoded token

        next();  // Continue to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ msg: "Invalid token" , error: error.message});      
    }   
}

export default authenticate;
