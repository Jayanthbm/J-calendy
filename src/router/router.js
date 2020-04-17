const express = require("express");
const router = express.Router();
const db = require("../models/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const constants = require('../helpers/constants');
const auth = require('../middlewares/auth');

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

//Login Route

router.post("/login", async (req, res) => {
    try {
        let emailId = req.body.emailId.trim();
        let password = req.body.password.trim();
        if (emailId && password) {
            //Query to check user exists
            const UserQuery = `SELECT userId,emailId,password from users where emailId='${emailId}'`;
            let UserQueryResults = await db.query(UserQuery);
            if (UserQueryResults.results.length > 0) {
                let userId = UserQueryResults.results[0].userId;
                let hashpass = UserQueryResults.results[0].password;
                bcrypt.compare(password, hashpass, async (err, result) => {
                    if (result === true) {
                        let token = await create_token(userId, '3h');
                        res.send({
                            token
                        })
                    } else {
                        res.send({
                            message: "Invalid Credentials"
                        })
                    }
                })
            } else {

            }
        } else {
            res.send({
                message: "Invalid Credentials"
            })
        }
    } catch (error) {
        res.send({
            message: "Invalid Credentials"
        })
    }
})

//Schedule Event Route

router.post("/schedule", auth, async (req, res) => {
    let DefaultSlots = {
        "0": {
            "available": false,
            "booked": false,
        },
        "1": {
            "available": false,
            "booked": false,
        },
        "2": {
            "available": false,
            "booked": false,
        },
        "3": {
            "available": false,
            "booked": false,
        },
        "4": {
            "available": false,
            "booked": false,
        },
        "5": {
            "available": false,
            "booked": false,
        },
        "6": {
            "available": false,
            "booked": false,
        },
        "7": {
            "available": false,
            "booked": false,
        },
        "8": {
            "available": false,
            "booked": false,
        },
        "9": {
            "available": false,
            "booked": false,
        },
        "10": {
            "available": false,
            "booked": false,
        },
        "11": {
            "available": false,
            "booked": false,
        },
        "12": {
            "available": false,
            "booked": false,
        },
        "13": {
            "available": false,
            "booked": false,
        },
        "14": {
            "available": false,
            "booked": false,
        },
        "15": {
            "available": false,
            "booked": false,
        },
        "16": {
            "available": false,
            "booked": false,
        },
        "17": {
            "available": false,
            "booked": false,
        },
        "18": {
            "available": false,
            "booked": false,
        },
        "19": {
            "available": false,
            "booked": false,
        },
        "20": {
            "available": false,
            "booked": false,
        },
        "21": {
            "available": false,
            "booked": false,
        },
        "22": {
            "available": false,
            "booked": false,
        },
        "23": {
            "available": false,
            "booked": false,
        }
    }
    let userId = req.userId;
    // let eventDate = new Date().toISOString().split('T')[0];
    let eventDate = req.body.date;
    //Check date wheather its smaller than todays date
    if (new Date(eventDate).getTime() <= new Date().getTime()) {
        res.send({
            message: "You cannot schedule Events for previous Dates"
        })
    } else {
        let slots = req.body.slots;
        for (let [key, value] of Object.entries(slots)) {
            DefaultSlots[`${key}`] = value;
        }
        //Duplicate Check
        try {
            const DC = `SELECT userId,eventDate from events WHERE userId= ${userId} AND eventDate='${eventDate}'`;
            let DCResults = await db.query(DC);
            if (DCResults.results.length < 1) {
                const EventSql = `INSERT INTO events (userId,eventDate,availableSlots) VALUES(${userId},'${eventDate}','${JSON.stringify(DefaultSlots)}')`;
                try {
                    let EventSqlResults = await db.query(EventSql);
                    if (EventSqlResults.results.insertId > 0) {
                        res.send({
                            message: "Slots Booked"
                        })
                    }
                } catch (error) {
                    res.send({
                        message: error
                    })
                }

            } else {
                try {
                    const UpdateEvent = `UPDATE events set availableSlots='${JSON.stringify(DefaultSlots)}' WHERE userId= ${userId} AND eventDate='${eventDate}'`;
                    let UpdateEventResults = await db.query(UpdateEvent);
                    if (UpdateEventResults.results.insertId === 0 && UpdateEventResults.results.affectedRows === 1) {
                        res.send({
                            message: "Slots Updated "
                        })
                    }
                } catch (error) {
                    res.send({
                        message: error
                    })
                }
            }
        } catch (error) {

        }
    }
})

//Get Scheduled Events

router.get("/events", async (req, res) => {
    const EventsQuery = ` SELECT events.userId,users.name 
                FROM events,users
                WHERE events.eventDate >= '${new Date().toISOString().split('T')[0]}' AND events.userId = users.userId
                GROUP BY events.userId`
    let EventsQueryR = await db.query(EventsQuery);
    res.send({
        users: EventsQueryR.results
    })
})

router.get("/events/:id", async (req, res) => {
    let userId = req.params.id;
    let eventDate = req.body.date || new Date().toISOString().split('T')[0];
    const eventQuery = `SELECT availableSlots
                        FROM events
                        WHERE userId =${userId} AND  eventDate ='${eventDate}'`;
    let EventsQueryR = await db.query(eventQuery);
    let Slots = JSON.parse(EventsQueryR.results[0].availableSlots)
    var availableSlots = {};
    for (let [key, value] of Object.entries(Slots)) {
        if (value.available === true) {
            availableSlots[key] = value;
        }
    }

    res.send({
        availableSlots
    })
})

router.get("/book/:id", async (req, res) => {
    let userId = req.params.id;
    let eventDate = req.body.eventDate;
    let selectedSlots = req.body.selectedSlots;
    console.log(`${userId}-${eventDate}-${selectedSlots}`)
    if (userId && eventDate && selectedSlots) {
        if (new Date(eventDate).getTime() <= new Date().getTime()) {
            res.send({
                message: "You cannot Book Events for previous Dates"
            })
        } else {
            //TODO Create Booking Table and Update Events Table
            res.send({
                message: "OK"
            })
        }

    } else {
        res.send({
            message: "Error While Booking"
        })
    }

})
module.exports = router;