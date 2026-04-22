"use server"

import { prisma } from "@/lib/prisma-db";

type EditTaskProps = {
    taskId: string;
    newTask: string;
}

export const editTask = async ({ taskId, newTask }: EditTaskProps) => { 
    try { 
        if (!taskId || !newTask) return
        
        const editedTask = await prisma.tasks.update({
            where: {
                id: taskId,
            },
            data: {
                task: newTask,
            },
        });

        if (!editedTask) return;

    } catch (error) {
        throw error;
    }
}