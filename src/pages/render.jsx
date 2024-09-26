import KanbanBoard from "../Components/Kanbanboard";
import TaskList from "../Components/Tasklist";
import TaskModal from "../Components/Taskmodal";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import axios from "axios";
import { PlusIcon, ListIcon } from "lucide-react";
import { useState, useEffect } from "react";

export default function Render() {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState("kanban");
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("https://task-managment-kanban-board-95ckcpflt.vercel.app/api/taskscrud", {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      setTasks(response.data.allTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    try {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, status: newStatus } : task
        )
      );

      await axios.put(
        `https://task-managment-kanban-board-95ckcpflt.vercel.app/api/taskupdate/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const openModal = (task = null) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  const refreshTasks = () => {
    fetchTasks();
    closeModal();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-full bg-gray-900 text-gray-100 p-6">
      <Card className="w-full  mx-auto bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-100">
              Task Management
            </h1>
            <Button
              onClick={() => openModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <PlusIcon className="mr-2 h-4 w-4" /> New Task
            </Button>
          </div>

          <Tabs value={view} onValueChange={setView} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-700">
              <TabsTrigger
                value="kanban"
                className="data-[state=active]:bg-gray-600 text-white"
              >
                Kanban Board
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className="data-[state=active]:bg-gray-600 text-gray-300"
              >
                <ListIcon className="mr-2 h-4 w-4" /> Task List
              </TabsTrigger>
            </TabsList>
            <TabsContent value="kanban" className="mt-4 flex-grow min-h-0">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <KanbanBoard
                  tasks={tasks}
                  updateTaskStatus={updateTaskStatus}
                />
              )}
            </TabsContent>
            <TabsContent value="list" className="mt-4 flex-grow min-h-0">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <TaskList tasks={tasks} setTasks={setTasks} />
              )}
            </TabsContent>
          </Tabs>

          {showModal && (
            <TaskModal
              task={selectedTask}
              onClose={closeModal}
              onSave={refreshTasks}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
