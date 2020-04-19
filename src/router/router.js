const express = require("express");
const router = express.Router();
const db = require("../models/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const constants = require('../helpers/constants');
const auth = require('../middlewares/auth');

async function create_token(id, expiresIn) {
    const token = jwt.sign({
        userId: id
    }, constants.SECRET_KEY, {
        expiresIn
    });
    return token;
}
function toISOLocal(d) {
    var z = n => ('0' + n).slice(-2);
    var zz = n => ('00' + n).slice(-3);
    var off = d.getTimezoneOffset();
    var sign = off < 0 ? '+' : '-';
    off = Math.abs(off);

    return d.getFullYear() + '-'
        + z(d.getMonth() + 1) + '-' +
        z(d.getDate()) + 'T' +
        z(d.getHours()) + ':' +
        z(d.getMinutes()) + ':' +
        z(d.getSeconds()) + '.' +
        zz(d.getMilliseconds()) +
        sign + z(off / 60 | 0) + ':' + z(off % 60);
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
                        const UserInsert = `INSERT INTO users (name,emailId,password,dateCreated) VALUES('${name}','${emailId}','${hashpass}','${toISOLocal(new Date()).split('T')[0]}')`;
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
    let eventDate = req.body.date;
    let curDate = toISOLocal(new Date()).split('T')[0]
    var x = new Date(eventDate);
    var y = new Date(curDate);
    if (x < y) {
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
                WHERE events.eventDate >= '${toISOLocal(new Date()).split('T')[0]}' AND events.userId = users.userId
                GROUP BY events.userId`
    let EventsQueryR = await db.query(EventsQuery);
    res.send({
        users: EventsQueryR.results
    })
})

router.post("/events/:id", async (req, res) => {
    let userId = req.params.id;
    let eventDate = req.body.date || toISOLocal(new Date()).split('T')[0];
    let curDate = new Date().toISOString().split('T')[0];
    var x = new Date(eventDate);
    var y = new Date(curDate);
    if (x < y) {
        res.send({
            message: "Date Should be Greater or Equal to todays Date"
        })
    } else {
        try {
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
                eventDate,
                availableSlots
            })
        } catch (error) {
            res.send({
                message: "No Slots Found",
            })
        }
    }
})

router.post("/book/:id", async (req, res) => {
    let userId = req.params.id;
    let eventDate = req.body.eventDate;
    let selectedSlots = req.body.selectedSlots;
    let curDate = toISOLocal(new Date()).split('T')[0]
    let name = req.body.name;
    let email = req.body.email;
    let mobile = req.body.mobile;
    if (userId && eventDate && selectedSlots) {
        var x = new Date(eventDate);
        var y = new Date(curDate);
        if (x < y) {
            res.send({
                message: "You cannot Book Slots for previous Dates"
            })
        } else {
            try {
                const getSlots = `SELECT availableSlots from events WHERE userId = ${userId} AND eventDate ='${eventDate}'`;
                let getSlotsR = await db.query(getSlots);
                if (getSlotsR.results.length > 0) {
                    let availableSlots = JSON.parse(getSlotsR.results[0].availableSlots);
                    for (let [key, value] of Object.entries(selectedSlots)) {
                        if (availableSlots[key].available === true && availableSlots[key].booked === false) {
                            const AddBooking = `INSERT INTO  bookings (userId,bookEventDate,name,email,mobile,bookedSlot,bookedOn)VALUES(${userId},'${eventDate}','${name}','${email}','${mobile}',${key},'${new Date(curDate)}')`;
                            let AddBookingR = await db.query(AddBooking);
                            if (AddBookingR.results.insertId > 0) {
                                let updatedSlots = { ...availableSlots };
                                updatedSlots[key] = value;
                                const UpdateEvent = `UPDATE events set availableSlots='${JSON.stringify(updatedSlots)}' WHERE userId= ${userId} AND eventDate='${eventDate}'`;
                                let UpdateEventResults = await db.query(UpdateEvent);
                                if (UpdateEventResults.results.insertId === 0 && UpdateEventResults.results.affectedRows === 1) {
                                    res.send({
                                        message: "Slots Booked "
                                    })
                                } else {
                                    res.send({
                                        message: "Error During Booking"
                                    })
                                }

                            } else {
                                res.send({
                                    message: "Error During Booking"
                                })
                            }

                        } else {
                            res.send({
                                message: "No Slots Available for Booking",
                            })
                        }
                    }

                } else {
                    res.send({
                        message: "No Slots Available for Booking"
                    })
                }
            } catch (e) {
                console.log(e)
                res.send({
                    message: "Error During Booking",
                })
            }

        }
    } else {
        res.send({
            message: "Error During Booking"
        })
    }

})

router.get("/bookings", async (req, res) => {
    try {
        const bookings = "SELECT * from bookings";
        let bookingsR = await db.query(bookings);
        res.send({
            results: bookingsR.results
        })
    } catch (error) {
        res.send({
            results: "Error Fetching Bookings"
        })
    }

})
module.exports = router;