const tasksService = require('./tasks.service');

async function postTask(req, res) {
  const { title } = req.body;
  const { project_id } = req.params;
  try {
    const task = await tasksService.createTask(req.user.id, project_id, title);
    return res.json({ id: task.id, title: task.title });
  } catch(error) {
    return res.status(400).json({ status_code: 400, message: error.message });
  }  
}

async function patchTaskByID(req, res) {
  const { title, checked } = req.body;
  const { user, task_id, project_id } = req.params;
  try {
      const updatedTask = await tasksService.updateTaskByID(task_id, req.user.id, project_id, title, checked);
      return res.json(updatedTask);
  } catch (error) {
      return res.status(400).json({ status_code: 400, message: error.message });
  }
}

async function deleteTaskByID(req, res) {
  const { user, task_id, project_id } = req.params;
  try {
      await tasksService.deleteTaskByID(req.user.id, project_id, task_id);
      return res.status(204).send();
  } catch (error) {
      return res.status(400).json({ status_code: 400, message: error.message });
  }
}

module.exports = { postTask, patchTaskByID, deleteTaskByID };
