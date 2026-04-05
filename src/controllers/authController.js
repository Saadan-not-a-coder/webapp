const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        const newUser = await authService.register(req.body);
        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        // We use a 400 Bad Request status for things like duplicate emails
        res.status(400).json({ success: false, message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const result = await authService.login(email, password);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        // We use a 401 Unauthorized status for bad credentials
        res.status(401).json({ success: false, message: error.message });
    }
};

module.exports = {
    register,
    login
};