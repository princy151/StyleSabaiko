const jwt = require('jsonwebtoken');

const authGuard = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(400).json({
            success: false,
            message: 'Authorization header not found!'
        });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(400).json({
            success: false,
            message: 'Token is missing!'
        });
    }

    try {
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

        // Normalize req.user with id and isAdmin
        req.user = {
            id: decodedUser.userId,
            isAdmin: decodedUser.isAdmin || false
        };

        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "Not Authenticated!"
        });
    }
};


// Admin Guard
const adminGuard = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(400).json({
            success: false,
            message: 'Authorization header not found!'
        });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(400).json({
            success: false,
            message: 'Token is missing!'
        });
    }

    try {
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: decodedUser.userId,
            isAdmin: decodedUser.isAdmin || false
        };

        if (!req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Permission Denied!"
            });
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "Not Authenticated!"
        });
    }
};

module.exports = {
    authGuard,
    adminGuard
};
