const jwt = require('jsonwebtoken');

// 1. Verify the user is logged in
const verifyToken = (req, res, next) => {
    // Look for the token in the headers (Format: "Bearer <token>")
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    try {
        // Decode the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attaches { userId, role } to the request object
        next(); // Pass control to the next function (the controller)
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid token.' });
    }
};

// 2. Verify the user is a Teacher
const isTeacher = (req, res, next) => {
    if (req.user.role !== 'TEACHER') {
        return res.status(403).json({ success: false, message: 'Access denied. Teachers only.' });
    }
    next();
};

// 3. Verify the user is a Student
const isStudent = (req, res, next) => {
    if (req.user.role !== 'STUDENT') {
        return res.status(403).json({ success: false, message: 'Access denied. Students only.' });
    }
    next();
};

module.exports = {
    verifyToken,
    isTeacher,
    isStudent
};