"use client";

import { getTasks } from "@/actions/get-tasks-from-db";
import { Tasks } from "@/generated/prisma/client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, Sigma, Trash, ListCheck, LoaderCircle } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import EditTask from "@/components/edit-task";
import { addTask } from "@/actions/add-task";
import { deleteTask } from "@/actions/delete-task";
import { toast } from "sonner";
import { updateTaskStatus } from "@/actions/toggle-done";
import { Filter } from "@/components/filter";
import { FilterType } from "@/components/filter";
import { deleteCompletedTasks } from "@/actions/clear-completed-tasks";

const Home = () => {
  const [task, setTask] = useState<string>("");
  const [taskList, setTaskList] = useState<Tasks[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<FilterType>("all");
  const [filteredTasks, setFilteredTasks] = useState<Tasks[]>([]);

  const handleGetTasks = async () => {
    try {
      const tasks = await getTasks();

      if (!tasks) return;

      setTaskList(tasks);
    } catch (error) {
      throw error;
    }
  };

  const handleAddTask = async () => {
    setLoading(true);

    try {
      if (task.length === 0 || !task) {
        toast.error("Por favor, insira uma tarefa válida.");
        setLoading(false);
        return;
      }

      const newTask = await addTask(task);

      if (!newTask) return;
      setTask("");

      await handleGetTasks();

      toast.success("Tarefa adicionada com sucesso!");
    } catch (error) {
      throw error;
    }

    setLoading(false);
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const deletedTask = await deleteTask(id);
      if (!deletedTask) return;
      await handleGetTasks();
      toast.success("Tarefa excluída com sucesso!");
    } catch (error) {
      throw error;
    }
  };

  const handleToggleTask = async (taskId: string) => {
    const previousTasks = [...taskList];
    try {
      setTaskList((prevTasks) => {
        const updatedTaskList = prevTasks.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              done: !task.done,
            };
          } else {
            return task;
          }
        });

        return updatedTaskList;
      });
      await updateTaskStatus(taskId);
    } catch (error) {
      setTaskList(previousTasks);
      throw error;
    }
  };

  const handleClearCompleted = async () => { 
    const deletedTasks = await deleteCompletedTasks();
    console.log(deletedTasks);
    if (!deletedTasks) return;

    setTaskList(deletedTasks);
    toast.success("Tarefas concluídas excluídas com sucesso!");
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleGetTasks();
  }, []);

  useEffect(() => {
    switch (currentFilter) {
      case "all":
        const allTasks = taskList.filter((task) => task);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFilteredTasks(allTasks);
        break;
      case "pending":
        const pendingTasks = taskList.filter((task) => !task.done);
        setFilteredTasks(pendingTasks);
        break;
      case "completed":
        const completedTasks = taskList.filter((task) => task.done);
        setFilteredTasks(completedTasks);
        break;
      default:
        setFilteredTasks(taskList);
    }
  }, [currentFilter, taskList]);

  return (
    <main className="p-4 w-full bg-gray-100 h-screen flex justify-center items-center">
      <Card className="w-lg">
        <CardHeader className="flex p-2 gap-2">
          <Input
            value={task}
            placeholder="Adicionar tarefa"
            onChange={(e) => setTask(e.target.value)}
          />
          <Button
            className="cursor-pointer"
            variant="default"
            onClick={handleAddTask}
          >
            {loading ? <LoaderCircle className="animate-spin" /> : <Plus />}
            Cadastrar
          </Button>
        </CardHeader>

        <CardContent>
          <Separator className="mb-4" />

          <Filter
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
          />

          <div className="mt-4 border-b-[1]">
            {taskList.length === 0 && (
              <p className="text-sm border-t[1] py-4 text-center text-gray-500">
                Você não tem tarefas cadastradas.
              </p>
            )}

            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="h-12 flex justify-between items-center border-t-[1]"
              >
                <div
                  className={`${task.done ? "w-1 h-full bg-green-300" : "w-1 h-full bg-red-400"}`}
                ></div>
                <p
                  onClick={() => handleToggleTask(task.id)}
                  className="cursor-pointer hover:text-gray-700 flex-1 px-2 text-sm"
                >
                  {task.task}
                </p>
                <div className="flex items-center gap-2">
                  <EditTask task={task} handleGetTasks={handleGetTasks} />
                  <Trash
                    size={16}
                    className="cursor-pointer"
                    onClick={() => handleDeleteTask(task.id)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-4">
            <div className="flex gap-2 items-center">
              <ListCheck size={16} />
              <p className="text-xs">
                Tarefas concluídas: ({taskList.filter((t) => t.done).length}/
                {taskList.length})
              </p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="cursor-pointer text-xs h-7"
                  variant="outline"
                >
                  <Trash />
                  Limpar tarefas concluídas
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Tem certeza que deseja excluir{" "}
                    {taskList.filter((t) => t.done).length} itens?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. A tarefa será eliminada
                    permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer">
                    Não
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="cursor-pointer"
                    onClick={handleClearCompleted}
                  >
                    Sim
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="h-2 w-full bg-gray-200 mt-4 rounded-md">
            <div
              className="h-full bg-blue-500 rounded-md"
              style={{
                width: `${(taskList.filter((t) => t.done).length / taskList.length) * 100}%`,
              }}
            ></div>
          </div>

          <div className="flex justify-end items-center mt-2 gap-2">
            <Sigma size={18} />
            <p className="text-xs">{taskList.length} tarefas no total</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default Home;
