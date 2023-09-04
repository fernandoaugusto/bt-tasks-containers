const yup = require("yup");

const accountSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email!")
    .max(50, "Email must to have max 50 characters.")
    .required("Email is mandatory."),
  full_name: yup
    .string()
    .min(1, "Full Name must to have min 1 character.")
    .max(50, "Full Name must to have max 50 characters.")
    .required("Full Name is mandatory."),
  password: yup
    .string()
    .max(20, "Password must to have max 20 characters.")
    .required("Password is mandatory."),
});

const validateSignUp = async (req, res, next) => {
  try {
    await accountSchema.validate(req.body);
    next();
  } catch (error) {
    return res.status(400).send({ status_code: 400, message: error.message });
  }
};

module.exports = { validateSignUp }