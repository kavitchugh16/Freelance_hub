// In server/src/middlewares/authenticate.js

const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    // 1. Get the token from the cookies
    const token = req.cookies.accessToken;

    // 2. If no token exists, deny access
    if (!token) {
        return res.status(401).send("Access Denied: No token provided.");
    }

    // 3. If a token exists, verify it
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // 4. If verification is successful, add user info to the request object
        req.userId = payload.id;
        req.userRole = payload.role;

        // 5. Pass control to the next function (the controller)
        next();
    } catch (err) {
        // If verification fails (e.g., token is invalid or expired)
        return res.status(403).send("Access Denied: Invalid token.");
    }
};

module.exports = authenticate;