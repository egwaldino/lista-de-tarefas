"use server";

import { prisma } from "@/lib/prisma-db";

export const deleteTask = async (idTask: string) => {
  try {
    if (!idTask) return;

    const deletedTask = await prisma.tasks.delete({
      where: {
        id: idTask,
      },
    });
    if (!deletedTask) return;

    return deletedTask;
  } catch (error) {
    throw error;
  }
};
