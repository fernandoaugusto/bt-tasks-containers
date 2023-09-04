const accountsService = require('./accounts.service');

async function signUp(req, res) {
  const { email, full_name, password } = req.body;
  try {
    const { token, user } = await accountsService.createUser(email, full_name, password);
    res.setHeader('x-next-auth', token);
    return res.json({ email: user.email, full_name: user.full_name });
  } catch(error) {
    return res.status(400).json({ status_code: 400, message: error.message });
  }
}

module.exports = { signUp }