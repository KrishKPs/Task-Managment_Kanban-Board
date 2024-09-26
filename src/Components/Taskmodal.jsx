import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import axios from "axios";
import { useState } from "react";

export default function TaskModal({ task, onClose, onSave }) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState(task?.priority || "Medium");
  const [status, setStatus] = useState(task?.status || "To Do");
  const [dueDate, setDueDate] = useState(task?.dueDate || "");

  const handleSave = async () => {
    const taskData = { title, description, priority, status, dueDate };

    try {
      if (task) {
        await axios.put(
          `https://task-managment-kanban-board-95ckcpflt.vercel.app/api/taskupdate/${task._id}`,
          taskData,
          {
            headers: { Authorization: `${localStorage.getItem("token")}` },
          }
        );
      } else {
        await axios.post("https://task-managment-kanban-board-95ckcpflt.vercel.app/api/taskscrud", taskData, {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        });
      }
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
      // You might want to add error handling here, e.g., showing an error message to the user
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#2f3437] text-[#e6e6e6] border-[#4a4a4a]">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create Task"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3 bg-[#3f4447] border-[#4a4a4a] text-[#e6e6e6]"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3 bg-[#3f4447] border-[#4a4a4a] text-[#e6e6e6]"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="col-span-3 bg-[#3f4447] border-[#4a4a4a] text-[#e6e6e6]">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="bg-[#3f4447] text-[#e6e6e6]">
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="col-span-3 bg-[#3f4447] border-[#4a4a4a] text-[#e6e6e6]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-[#3f4447] text-[#e6e6e6]">
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right">
              Due Date
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="col-span-3 bg-[#3f4447] border-[#4a4a4a] text-[#e6e6e6]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-[#3f4447] text-[#e6e6e6] hover:bg-[#4a4a4a]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[#5c7cfa] hover:bg-[#4c6ef5] text-white"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
