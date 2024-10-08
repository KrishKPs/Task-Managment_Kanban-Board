import dbconnect from "../../../Lib/mongo";
import User from "../../../Model/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors, { runMiddleware } from "../../../Middleware/cors";

const login = async (req, res) => {
    // Run the CORS middleware
    await runMiddleware(req, res, cors);

    if (req.method === 'OPTIONS') {
        return res.status(204).end();  // Respond with 204 No Content for preflight requests
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ msg: "Only POST requests are allowed" });
    }

    await dbconnect();

    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) return res.status(404).json({ msg: "User not found" });

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) return res.status(401).json({ msg: "Invalid credentials" });

        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ msg: "User logged in", token });
    } catch (error) {
        res.status(500).json({ msg: "Server error", error });
    }
};

export default login;
