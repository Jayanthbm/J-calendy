const express = require("express");
const router = express.Router();
const db = require("../models/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const constants = require('../helpers/constants');

router.get("/", async (req, res) => {
    res.send({
        message: "Hello world"
    })
})
async function create_token(id, expiresIn) {
    const token = jwt.sign({
        userId: id
    }, constants.SECRET_KEY, {
        expiresIn
    });
    return token;
}
function ConvertDate(date) {
    return date.toISOString().split('T')[0] + ' '
        + date.toTimeString().split(' ')[0];
}

//Signup Route
router.post("/signup", async (req, res) => {
    try {
        let name = req.body.name.trim();
        let emailId = req.body.emailId.trim();
        let password = req.body.password.trim();
        if (emailId && name && password) {
            //Query to check emailId exists or not
            const EmailCheck = `SELECT * from users where emailId='${emailId}'`;
            let EmailCheckResults = await db.query(EmailCheck);
            if (EmailCheckResults.results.length < 1) {
                //hashing the passsword using bcrypt
                bcrypt.hash(password, 12, async (err, hash) => {
                    if (hash) {
                        let hashpass = hash;
                        //Insert to Users table
                        const UserInsert = `INSERT INTO users (name,emailId,password,dateCreated) VALUES('${name}','${emailId}','${hashpass}','${ConvertDate(new Date())}')`;
                        try {
                            let UserInsertResults = await db.query(UserInsert);
                            let userId = UserInsertResults.results.insertId
                            let token = await create_token(userId, '3h');
                            res.send({
                                token
                            })
                        } catch (error) {
                            res.send({
                                message: "Error During Signup.Try Again"
                            })
                        }
                    } else {
                        res.send({
                            message: "Error During Signup.Try Again"
                        })
                    }
                })
            } else {
                res.send({
                    message: "User with this Email Address Already Exist"
                })
            }
        } else {
            res.send({
                message: "Error During Signup Fill All Fields"
            })
        }
    } catch (error) {
        res.send({
            message: "Error During Signup Fill All Fields"
        })
    }

})

module.exports = router;