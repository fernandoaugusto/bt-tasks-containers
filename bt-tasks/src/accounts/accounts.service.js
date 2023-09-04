const bcrypt = require("bcrypt");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createToken } = require('../auth/auth.service');

async function createUser(email, full_name, password) {
  const hashed_password = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
        data: { email, full_name, password: hashed_password },
    });
    const token = createToken(user.id);
    return { token, user };
  } catch(error) {
    throw new Error('The user was not created!');
  }
}

module.exports = { createUser }