"use server";
import { prisma } from "@/lib/prisma-db";

export const updateTaskStatus = async (taskId: string) => {
  try {
    const currentTask = await prisma.tasks.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!currentTask) return;

    const updatedStatus = await prisma.tasks.update({
      where: {
        id: taskId,
      },
      data: {
        done: !currentTask.done,
      },
    });

    if (!updatedStatus) return;

    return updatedStatus;
  } catch (error) {
    throw error;
  }
};
