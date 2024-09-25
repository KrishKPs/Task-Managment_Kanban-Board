import dbconnect from "../../Lib/mongo";
import authenticate from "../../Middleware/authenticate";
import Task from "../../Model/Task";  

const TaskCRUD = async (req, res) => {
    await dbconnect(); 

    // Run the authenticate middleware first, then proceed
    authenticate(req, res, async () => {
        const { method } = req;

        const username = req.user.username;  // Get the authenticated user's ID  
        console.log("Authenticated user:", username);  // Log the authenticated user     

        if (method === 'GET') {
            try {
                // Fetch tasks related to the authenticated user
                const tasks = await Task.find({ username  : username }); 
                res.status(200).json({ allTasks: tasks });
            } catch (error) {
                res.status(500).json({ msg: "Error in fetching tasks", error });
            }
        }

        if (method === 'POST') {
            try {
                const taskData = req.body;  

                const newTask = await Task.create({
                    title: taskData.title,
                    description: taskData.description,
                    status: taskData.status,
                    priority: taskData.priority,
                    dueDate: taskData.dueDate,
                    username: username,  // Use the authenticated user's ID
                });

                res.status(201).json({ msg: "Task created", newTask , requser: req.user.id});    
            } catch (error) {
                res.status(500).json({ msg: "Error in creating task", error });
            }
        }
    });
}

export default TaskCRUD;
