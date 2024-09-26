import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { ScrollArea } from "@/Components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function TaskList({ tasks, setTasks }) {
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

  const filteredTasks = tasks.filter((task) => {
    return (
      (filterStatus === "All" || task.status === filterStatus) &&
      (filterPriority === "All" || task.priority === filterPriority)
    );
  });

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://task-managment-kanban-r43gz0lmr-krish-patels-projects-3e6b9326.vercel.app/api/taskupdate/${id}`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low":
        return "text-green-400";
      case "Medium":
        return "text-yellow-400";
      case "High":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "To Do":
        return "bg-blue-600";
      case "In Progress":
        return "bg-yellow-600";
      case "Completed":
        return "bg-green-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <Card className="bg-[#2f3437] border-[#4a4a4a] shadow-lg m-6">
      <CardHeader className="bg-[#3f4447] rounded-t-lg">
        <CardTitle className="text-2xl font-bold text-[#e6e6e6]">
          Task List
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex space-x-4 mb-6">
          <Select onValueChange={setFilterStatus} defaultValue={filterStatus}>
            <SelectTrigger className="w-[180px] bg-[#3f4447] text-[#e6e6e6]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#3f4447] text-[#e6e6e6]">
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="To Do">To Do</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={setFilterPriority}
            defaultValue={filterPriority}
          >
            <SelectTrigger className="w-[180px] bg-[#3f4447] text-[#e6e6e6]">
              <SelectValue placeholder="Filter by Priority" />
            </SelectTrigger>
            <SelectContent className="bg-[#3f4447] text-[#e6e6e6]">
              <SelectItem value="All">All Priority</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="h-[calc(100vh-300px)]">
          <ul className="space-y-4">
            {filteredTasks.map((task) => (
              <li
                key={task._id}
                className="bg-[#3f4447] p-4 rounded-lg shadow-md"
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-semibold text-[#e6e6e6]">
                    {task.title}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(task._id)}
                    className="text-red-400 hover:text-red-600 hover:bg-[#2f3437]"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-[#a3a3a3] mb-2">{task.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${getStatusColor(
                        task.status
                      )}`}
                    ></div>
                    <span className="text-[#e6e6e6] text-sm">
                      {task.status}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-medium ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
