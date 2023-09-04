const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY || null;

async function authenticateUser(email, password) {
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user && (await bcrypt.compare(password, user.password))) {
            if (!SECRET_KEY) res.status(401).send({ error: "Unknown Error" });
            const token = createToken(user.id);
            const resBody = { email: user.email, full_name: user.full_name };
            return { token, resBody };
        }
    } catch(error) {
        throw new Error("Invalid credentials");
    }
}

async function getUserByToken(token) {
    try {
        const user_id = getUserIDFromToken(token);
        const user = await prisma.user.findUnique({ where: { id: user_id } });
        if (user) {
            const resUser = { id: user.id, email: user.email, full_name: user.full_name };
            return resUser;
        } else {
            throw new Error("Token is invalid or expired.");
        }
    } catch(error) {
        throw new Error(error.message);
    }
}

function createToken(user_id) {
    const token = jwt.sign({ user_id }, SECRET_KEY, { expiresIn: '1200s' }); // 1200s = 20 minutes
    return token;
}

function getUserIDFromToken(token) {
    try {
        const payload = jwt.verify(token, SECRET_KEY);
        return payload.user_id;
    } catch(error) {
        throw new Error("Token is invalid or expired.");
    }    
}

module.exports = { authenticateUser, createToken, getUserByToken }