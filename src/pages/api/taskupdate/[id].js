import dbconnect from "../../../Lib/mongo";
import authenticate from "../../../Middleware/authenticate";
import Task from "../../../Model/Task"; 

const taskupdate = async (req, res) => { 
    await dbconnect();

    // Run authenticate middleware and proceed if valid
    authenticate(req, res, async () => {
        const { method } = req;  
        const { id } = req.query;   // Use req.query to get the dynamic route ID

        console.log("Method: ", method);  // Log method
        console.log("ID received:", id);  // Log the ID
        console.log("Authenticated user:", req.user);  // Log the authenticated user        

        if (method === 'PUT') {
            const taskData = req.body;

            try {
                // Find the task first and check if it belongs to the authenticated user (based on username)
                const task = await Task.findById(id);

                if (!task) {
                    return res.status(404).json({ msg: 'Task not found' });
                }

                // Ensure that the task belongs to the authenticated user
                if (task.username !== req.user.username) {
                    return res.status(403).json({ msg: "Unauthorized to update this task" });
                }

                // Update task
                const updatedTask = await Task.findByIdAndUpdate(
                    id,
                    {
                        title: taskData.title,
                        description: taskData.description,
                        status: taskData.status,
                        priority: taskData.priority,
                        dueDate: taskData.dueDate,
                        username: req.user.username,  // Make sure to save the username
                    },
                    { new: true } // Return the updated document
                );

                res.status(200).json({ msg: "Task updated", updatedTask });
            } catch (error) {
                console.log("Error in updating task:", error);
                res.status(500).json({ msg: "Error in updating task", error });
            }
        }

        if (method === 'DELETE') {
            try {
                // Find the task first and check if it belongs to the authenticated user (based on username)
                const task = await Task.findById(id);

                if (!task) {
                    return res.status(404).json({ msg: 'Task not found' });
                }

                // Ensure that the task belongs to the authenticated user
                if (task.username !== req.user.username) {
                    return res.status(403).json({ msg: "Unauthorized to delete this task" });
                }

                // Delete task
                const deletedTask = await Task.findByIdAndDelete(id);
                res.status(200).json({ msg: "Task deleted", deletedTask });
            } catch (error) {
                console.log("Error in deleting task:", error);
                res.status(500).json({ msg: "Error in deleting task", error });
            }
        }
    });
}

export default taskupdate;
