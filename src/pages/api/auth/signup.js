import dbconnect from "../../../Lib/mongo";
import User from "../../../Model/User";  // Correct path for User model
 // Use bcryptjs for better compatibility in Node.js
import bcrypt from "bcryptjs";   
import jwt from "jsonwebtoken";  

const signup = async (req, res) => {
    if (req.method === 'POST') {
        try {
            await dbconnect(); 

            const { username, email, password } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ msg: "User already exists" });
            }

            // Hash the password
            const hashed = await bcrypt.hash(password, 10);

            // Create new user
            const user = new User({ username, email, password: hashed });
            await user.save();

            // Generate JWT token
            const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.status(200).json({
                msg: "User created",
                token: token
            });
        } catch (error) {
            res.status(500).json({ msg: "Server error", error });
        }
    } else {
        res.status(405).json({ msg: "Only POST requests are allowed" });
    }
};

export default signup;
