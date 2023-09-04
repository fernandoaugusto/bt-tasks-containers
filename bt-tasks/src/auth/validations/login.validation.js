const yup = require("yup");

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email!")
    .max(50, "Email must to have max 50 characters.")
    .required("Email is mandatory."),
  password: yup
    .string()
    .max(20, "Password must to have max 20 characters.")
    .required("Password is mandatory."),
});

const validateLogin = async (req, res, next) => {
  try {
    await loginSchema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).send({ status_code: 400, message: [ error.message ] });
  }
};

module.exports = { validateLogin }