import dbconnect from "../../../Lib/mongo";
import authenticate from "../../../Middleware/authenticate";
import Task from "../../../Model/Task";
import cors, { runMiddleware } from "../../../Middleware/cors";

const taskupdate = async (req, res) => {
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
        const { id } = req.query;  // Get task ID from query

        switch (method) {
            case 'PUT':
                try {
                    const taskData = req.body;
                    const task = await Task.findById(id);

                    if (!task) return res.status(404).json({ msg: 'Task not found' });
                    if (task.username !== req.user.username)
                        return res.status(403).json({ msg: "Unauthorized to update this task" });

                    const updatedTask = await Task.findByIdAndUpdate(id, taskData, { new: true });
                    res.status(200).json({ msg: "Task updated", updatedTask });
                } catch (error) {
                    res.status(500).json({ msg: "Error updating task", error });
                }
                break;

            case 'DELETE':
                try {
                    const task = await Task.findById(id);

                    if (!task) return res.status(404).json({ msg: 'Task not found' });
                    if (task.username !== req.user.username)
                        return res.status(403).json({ msg: "Unauthorized to delete this task" });

                    await Task.findByIdAndDelete(id);
                    res.status(200).json({ msg: "Task deleted" });
                } catch (error) {
                    res.status(500).json({ msg: "Error deleting task", error });
                }
                break;

            default:
                res.status(405).json({ msg: `Method ${method} not allowed` });
                break;
        }
    });
};

export default taskupdate;
