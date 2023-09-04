const authService = require("./auth.service");

async function signIn(req, res) {
  const { email, password } = req.body;
  try {
    const { token, resBody } = await authService.authenticateUser(
      email,
      password
    );
    res.setHeader("x-next-auth", token);
    return res.json(resBody);
  } catch (error) {
    return res.status(401).send({ status_code: 401, message: error.message });
  }
}

async function me(req, res) {
  const { next_token, user } = req;
  res.setHeader("x-next-auth", next_token);
  return res.json(user);
}

module.exports = { signIn, me };
