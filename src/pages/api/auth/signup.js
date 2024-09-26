import dbconnect from "../../../Lib/mongo";
import User from "../../../Model/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors, { runMiddleware } from "../../../Middleware/cors";

const signup = async (req, res) => {
    // Run the CORS middleware
    await runMiddleware(req, res, cors);

    // Handle preflight `OPTIONS` request
    if (req.method === 'OPTIONS') {
        res.status(200).end();  // Respond with 200 for preflight requests
        return;
      }
      
    if (req.method !== 'POST') {
        return res.status(405).json({ msg: "Only POST requests are allowed" });
    }

    await dbconnect();

    const { username, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: "User already exists" });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({ username, email, password: hashedPassword });

        // Generate JWT token
        const token = jwt.sign({ username: newUser.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ msg: "User created", token });
    } catch (error) {
        res.status(500).json({ msg: "Server error", error });
    }
};

export default signup;
