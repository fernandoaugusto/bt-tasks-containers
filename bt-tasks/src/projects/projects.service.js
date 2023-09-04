const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createProject(user_id, name) {
    try {
        const project = await prisma.project.create({
            data: { name, user_id },
        });
        return project;
    } catch(error) {s
        throw new Error("The project was not created.");
    }
}

async function getProjectByID(user_id, project_id) {
    let project;
    try {
        project = await prisma.project.findUnique({
            where: { id: project_id, user_id },
            select: {
                id: true,
                name: true,
                created_at: true,
                tasks: {
                    select: {
                        id: true,
                        title: true,
                        created_at: true
                    },
                    orderBy: {
                        created_at: 'desc'
                    }
                }
            }
        });
    } catch (error) {
        throw new Error("Error retrieving the project.");
    }
    if (!project) {
        throw new Error("Project not found.");
    }
    return project;

}

async function getProjectsByUserID(user_id) {
    try {
        return await prisma.project.findMany({
            where: { user_id },
            select: {
                id: true,
                name: true,
                created_at: true,
                tasks: {
                    select: {
                        id: true,
                        title: true,
                        created_at: true
                    },
                    orderBy: {
                        created_at: 'desc'
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });
    } catch (error) {
        throw new Error("Error retrieving projects for the user.");
    }
}

async function updateProjectByID(user_id, project_id, new_name) {
    try {
        const updatedProject = await prisma.project.update({
            where: { id: project_id, user_id },
            data: { name: new_name },
        });
        return updatedProject;
    } catch (error) {
        throw new Error("Error updating the project.");
    }
}

async function deleteProjectByID(user_id, project_id) {
    try {
        const deleteTasks = prisma.task.deleteMany({
            where: { project_id, user_id }
        });
        const deleteProject = prisma.project.delete({
            where: { id: project_id, user_id }
        });
        const [_, deletedProject] = await prisma.$transaction([deleteTasks, deleteProject]);
        return deletedProject;
    } catch (error) {
        throw new Error("Error deleting the project and its tasks.");
    }
}

module.exports = { createProject, getProjectByID, getProjectsByUserID, updateProjectByID, deleteProjectByID }