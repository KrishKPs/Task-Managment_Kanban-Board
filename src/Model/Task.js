

import mongoose from "mongoose"; 


const TaskSchema = new mongoose.Schema({ 

        title : { type: String,required: true}, 
        description : { type: String, required: true},      
        status: { type: String, enum: ["To Do", "In Progress", "Completed"], default: "To Do" },
        priority: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
        dueDate: Date,
        username: { type: String , ref: 'User' },
}); 

module.exports = mongoose.models.Task || mongoose.model('Task', TaskSchema);        