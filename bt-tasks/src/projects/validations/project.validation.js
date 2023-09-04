const yup = require("yup");

const projectSchema = yup.object().shape({
  name: yup
    .string()
    .min(1, "Project Name must to have min 1 character.")
    .max(50, "Project Name must to have max 50 characters.")
    .required("Project Name is mandatory.")
});

const validateProject = async (req, res, next) => {
  try {
    await projectSchema.validate(req.body);
    next();
  } catch (error) {
    return res.status(400).send({ status_code: 400, message: error.message });
  }
};

module.exports = { validateProject }