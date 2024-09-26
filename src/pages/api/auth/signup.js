import dbconnect from "../../../Lib/mongo";
import User from "../../../Model/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors, { runMiddleware } from "../../../Middleware/cors";

const signup = async (req, res) => {
    // Run the CORS middleware
    await runMiddleware(req, res, cors);


    await dbconnect();

    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ msg: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword });

        const token = jwt.sign({ username: newUser.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ msg: "User created", token });
        
    } catch (error) {
        res.status(500).json({ msg: "Server error", error });
    }
};

export default signup;
