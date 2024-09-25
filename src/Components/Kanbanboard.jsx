import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Calendar, MoreHorizontal } from "lucide-react";
import React from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemTypes = {
  TASK: "task",
};

export default function KanbanBoard({ tasks, updateTaskStatus }) {
  const columns = ["To Do", "In Progress", "Completed"];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-[#191919] rounded-lg">
        {columns.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasks}
            updateTaskStatus={updateTaskStatus}
          />
        ))}
      </div>
    </DndProvider>
  );
}

function KanbanColumn({ status, tasks, updateTaskStatus }) {
  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item) => {
      if (item && item.id) {
        updateTaskStatus(item.id, status);
      } else {
        console.error("Dropped item does not have an ID:", item);
      }
    },
  });

  const filteredTasks = tasks.filter((task) => task.status === status);

  const getColumnColor = (status) => {
    switch (status) {
      case "To Do":
        return "border-l-blue-500";
      case "In Progress":
        return "border-l-yellow-500";
      case "Completed":
        return "border-l-green-500";
      default:
        return "border-l-gray-500";
    }
  };

  return (
    <Card
      ref={drop}
      className={`bg-[#2f3437] border-[#4a4a4a] shadow-lg ${getColumnColor(
        status
      )} border-l-4`}
    >
      <CardHeader className="bg-[#3f4447] rounded-t-lg border-b border-[#4a4a4a]">
        <CardTitle className="text-xl font-semibold text-[#e6e6e6] flex items-center justify-between">
          {status}
          <Badge
            variant="secondary"
            className="bg-[#ffff] text-black text-xs font-normal"
          >
            {filteredTasks.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function TaskCard({ task }) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { id: task._id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low":
        return "bg-green-900/30 text-green-300";
      case "Medium":
        return "bg-yellow-900/30 text-yellow-300";
      case "High":
        return "bg-red-900/30 text-red-300";
      default:
        return "bg-gray-900/30 text-gray-300";
    }
  };

  return (
    <div
      ref={drag}
      className={`bg-[#3f4447] p-4 rounded-lg shadow-md border border-[#4a4a4a] transition-all duration-300 ${
        isDragging
          ? "opacity-50"
          : "opacity-100 hover:shadow-lg hover:border-[#5c7cfa]"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-[#e6e6e6]">{task.title}</h3>
        <MoreHorizontal className="text-[#a3a3a3] h-5 w-5 cursor-pointer hover:text-[#e6e6e6] transition-colors" />
      </div>
      <p className="text-[#a3a3a3] text-sm mb-3">{task.description}</p>
      <div className="flex justify-between items-center">
        <Badge
          className={`${getPriorityColor(task.priority)} px-2 py-1 text-xs`}
        >
          {task.priority}
        </Badge>
        <div className="flex items-center space-x-2 text-[#a3a3a3] text-xs">
          <Calendar className="h-3 w-3" />
          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
