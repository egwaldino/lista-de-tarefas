import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SquarePen } from "lucide-react";
import { Tasks } from "@/generated/prisma/client";
import { useState } from "react";
import { toast } from "sonner";
import { editTask } from "@/actions/edit-tasks";

type EditTaskProps = {
  task: Tasks;
  handleGetTasks: () => Promise<void>;
};

const EditTask = ({ task, handleGetTasks }: EditTaskProps) => {
  const [editedTask, setEditedTask] = useState<string>(task.task);

  const handleEditTask = async () => {
    try {
      if (editedTask !== task.task) {
        toast.success("Tarefa editada com sucesso!");
      } else {
        toast.error("Nenhuma alteração feita na tarefa.");
        return;
      }

      await editTask({
        taskId: task.id,
        newTask: editedTask,
      });

        handleGetTasks();
        
    } catch (error) {
      throw error;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <SquarePen size={16} className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2">
          <Input
            value={editedTask}
            placeholder="Editar tarefa"
            onChange={(e) => setEditedTask(e.target.value)}
          />
          <DialogClose asChild>
            <Button className="cursor-pointer" onClick={handleEditTask}>
              Editar
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTask;
