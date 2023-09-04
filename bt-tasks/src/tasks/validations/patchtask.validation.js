const yup = require('yup');

const taskValidationSchema = yup.object().shape({
    title: yup
        .string()
        .max(50, 'Title must be at most 50 characters long')
        .required('Title is required'),
    checked: yup
        .boolean()
        .required('Checked status is required')
});

async function validatePatchTask(req, res, next) {
    try {
        await taskValidationSchema.validate(req.body);
        next();
    } catch (error) {
        return res.status(400).json({ status_code: 400, message: error.message });
    }
}

module.exports = { validatePatchTask };
