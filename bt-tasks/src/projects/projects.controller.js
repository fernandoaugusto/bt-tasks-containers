const projectsService = require('./projects.service');

async function postProject(req, res) {
  const { name } = req.body;
  const { user, next_token } = req;
  try {
    const project = await projectsService.createProject(req.user.id, name);
    res.setHeader("x-next-auth", next_token);
    return res.json({ id: project.id, name: project.name });
  } catch(error) {
    return res.status(400).json({ status_code: 400, message: error.message });
  }  
}

async function getProjectByID(req, res) {
  try {
      const project = await projectsService.getProjectByID(req.user.id, req.params.project_id);
      return res.json(project);
  } catch (error) {
      return res.status(404).json({ status_code: 404, message: error.message });
  }
}

async function getAllUserProjects(req, res) {
  try {
      const projects = await projectsService.getProjectsByUserID(req.user.id);
      return res.json(projects);
  } catch (error) {
      return res.status(400).json({ status_code: 400, message: error.message });
  }
}

async function updateProjectByID(req, res) {
  try {
      const updatedProject = await projectsService.updateProjectByID(req.user.id, req.params.project_id, req.body.name);
      return res.json(updatedProject);
  } catch (error) {
      return res.status(400).json({ status_code: 400, message: error.message });
  }
}

async function deleteProjectByID(req, res) {
  try {
      await projectsService.deleteProjectByID(req.user.id, req.params.project_id);
      return res.status(204).send(); // delete http status
  } catch (error) {
      return res.status(400).json({ status_code: 400, message: error.message });
  }
}

module.exports = { postProject, getProjectByID, getAllUserProjects, updateProjectByID, deleteProjectByID };

