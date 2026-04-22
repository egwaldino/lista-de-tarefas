"use server"

import { prisma } from "@/lib/prisma-db";

export const deleteCompletedTasks = async () => { 
    try {
        await prisma.tasks.deleteMany({
            where: {
                done: true,
            },
        });


        const allTasks = await prisma.tasks.findMany();
        if (!allTasks) return;
        
        return allTasks;


    } catch (error) {
        throw error;
    }
}