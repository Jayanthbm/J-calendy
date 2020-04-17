const jwt = require("jsonwebtoken");
const constants = require("../helpers/constants");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.send({
            message: "You must be logged in"
        });
    }
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, constants.SECRET_KEY, async (err, payload) => {
        if (err) {
            return res.send({
                message: "You must be logged in"
            });
        }
        req.userId = payload.userId;
        next();
    });
};