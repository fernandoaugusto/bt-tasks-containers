const yup = require("yup");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const UUIDv4Regex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[4][0-9a-fA-F]{3}\b-[89abAB][0-9a-fA-F]{3}\b-[0-9a-fA-F]{12}$/;

const taskAndProjectUUIDSchema = yup.object().shape({
  project_id: yup
    .string()
    .matches(UUIDv4Regex, "Project ID has invalid UUID v4 format.")
    .required("Project ID is mandatory."),
  task_id: yup
    .string()
    .matches(UUIDv4Regex, "Task ID has invalid UUID v4 format.")
    .required("Task ID is mandatory.")
});

const validateProjectAndTaskUUID = async (req, res, next) => {
  const { project_id, task_id } = req.params;
  try {
    await taskAndProjectUUIDSchema.validate(req.params);
    const projectExists = await prisma.project.findUnique({ where: { id: project_id, user_id: req.user.id } });
    if (!projectExists) {
      throw new Error("Project with given ID does not exist.");
    }
    const taskExists = await prisma.task.findUnique({ where: { id: task_id, project_id, user_id: req.user.id } });
    if (!taskExists) {
      throw new Error("Task with given ID does not exist.");
    }
    next();
  } catch (error) {
    return res.status(400).send({ status_code: 400, message: error.message });
  }
};

module.exports = { validateProjectAndTaskUUID };