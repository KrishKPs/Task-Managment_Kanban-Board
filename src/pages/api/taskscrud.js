import dbconnect from "../../Lib/mongo";
import authenticate from "../../Middleware/authenticate";
import Task from "../../Model/Task";
import cors, { runMiddleware } from "../../Middleware/cors";

const TaskCRUD = async (req, res) => {
    // Run the CORS middleware
    await runMiddleware(req, res, cors);

    if (req.method === 'OPTIONS') {
        return res.status(204).end();  // Respond with 204 No Content for preflight requests
    }

    await dbconnect();

    // Run the authenticate middleware first, then proceed
    authenticate(req, res, async () => {
        const { method } = req;
        const username = req.user.username;

        switch (method) {
            case 'GET':
                try {
                    const tasks = await Task.find({ username });
                    res.status(200).json({ allTasks: tasks });
                } catch (error) {
                    res.status(500).json({ msg: "Error fetching tasks", error });
                }
                break;

            case 'POST':
                try {
                    const taskData = req.body;
                    const newTask = await Task.create({
                        title: taskData.title,
                        description: taskData.description,
                        status: taskData.status,
                        priority: taskData.priority,
                        dueDate: taskData.dueDate,
                        username: username,
                    });
                    res.status(201).json({ msg: "Task created", newTask });
                } catch (error) {
                    res.status(500).json({ msg: "Error creating task", error });
                }
                break;

            default:
                res.status(405).json({ msg: `Method ${method} not allowed` });
                break;
        }
    });
};

export default TaskCRUD;
