"use server";

import { prisma } from "@/lib/prisma-db";

export const addTask = async (tarefa: string) => {
  try {
    if (!tarefa) return;

    const addedTask = await prisma.tasks.create({
      data: {
        task: tarefa,
        done: false,
      },
    });

    if (!addedTask) return;

    return addedTask;
  } catch (error) {
    throw error;
  }
};
