import dbconnect from "../../../Lib/mongo";
import authenticate from "../../../Middleware/authenticate";
import Task from "../../../Model/Task";
import cors, { runMiddleware } from "../../../Middleware/cors";

const taskupdate = async (req, res) => {
    // Run the CORS middleware
    await runMiddleware(req, res, cors);

    if (req.method === 'OPTIONS') {
        return res.status(204).end();  // Respond with 204 No Content for preflight requests
    }

    await dbconnect();

    // Run authenticate middleware and proceed if valid
    authenticate(req, res, async () => {
        const { method } = req;
        const { id } = req.query;  // Use req.query to get the dynamic route ID

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
