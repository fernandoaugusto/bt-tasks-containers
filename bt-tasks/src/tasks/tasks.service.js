const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTask(user_id, project_id, title) {
    try {
        return await prisma.task.create({
            data: { title, checked: false, project_id, user_id }
        });
    } catch (error) {
        throw new Error("Error creating the task.");
    }
}

async function updateTaskByID(task_id, user_id, project_id, title, checked) {
    try {
        return await prisma.task.update({
            where: { id: task_id, user_id, project_id },
            data: { title, checked }
        });
    } catch (error) {
        throw new Error("Error updating the task.");
    }
}

async function deleteTaskByID(user_id, project_id, task_id) {
    try {
        return await prisma.task.delete({
            where: { id: task_id, user_id, project_id }
        });
    } catch (error) {
        throw new Error("Error deleting the task.");
    }
}

module.exports = { createTask, updateTaskByID, deleteTaskByID }
