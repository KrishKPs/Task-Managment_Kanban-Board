import dbconnect from "../../Lib/mongo";
import authenticate from "../../Middleware/authenticate";
import Task from "../../Model/Task";
import cors, { runMiddleware } from "../../Middleware/cors";

const TaskCRUD = async (req, res) => {
    // Run the CORS middleware
    await runMiddleware(req, res, cors);

    // Handle preflight `OPTIONS` request
    if (req.method === 'OPTIONS') {
        res.status(200).end();  // Respond with 200 for preflight requests
        return;
      }
      

    // Connect to the database
    await dbconnect();

    // Authenticate user and proceed
    authenticate(req, res, async () => {
        const { method } = req;
        const username = req.user.username;  // Get authenticated user's username

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
                        username: username,  // Assign task to authenticated user
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
