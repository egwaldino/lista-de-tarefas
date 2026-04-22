"use server";
import { prisma } from "@/lib/prisma-db";

export const getTasks = async () => {
  try {
    const tasks = await prisma.tasks.findMany();

    if (!tasks) return;

      console.log("Tasks retrieved from database:", tasks);
      
    return tasks;
  } catch (error) {
    throw error;
  }
};
