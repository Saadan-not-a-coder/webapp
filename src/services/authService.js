const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// Access the secret key from your .env file
const JWT_SECRET = process.env.JWT_SECRET;

// 1. Register a new user
const register = async (userData) => {
    // Check if a user with this email already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
    });
    if (existingUser) {
        throw new Error('Email is already in use');
    }

    // Hash the password (10 is the standard "salt round" cost)
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Save the user to the database
    const user = await prisma.user.create({
        data: {
            email: userData.email,
            password: hashedPassword,
            role: userData.role || 'STUDENT' // Defaults to STUDENT if not provided
        }
    });

    // Remove the password from the object before returning it to the controller
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

// 2. Log in an existing user
const login = async (email, password) => {
    // Find the user by email
    const user = await prisma.user.findUnique({
        where: { email }
    });
    if (!user) {
        throw new Error('Invalid email or password');
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    // Generate a JSON Web Token containing the user's ID and Role
    const token = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' } // Token expires in 24 hours
    );

    // Return the token and the user data (excluding the password)
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
};

module.exports = {
    register,
    login
};