import React, { useState, useEffect } from 'react';
import { Redirect, Link } from "react-router-dom";
import axios from 'axios';
import * as EP from '../helpers/endpoints';
import * as Cookie from '../helpers/cookie';
import Top from './Top';

import {
    Container, Button, Alert
} from "shards-react";

import Spinner from './Spinner';

const Bookings = props => {
    const [loggedin, setLoggedin] = useState(null);
    const [loading, setLoading] = useState(false);
    const [bookings, setBookings] = useState(null);

    useEffect(() => {
        async function tokenchecker() {
            const token = Cookie.getCookie("token");
            if (token) {
                setLoggedin(true);
            } else {
                setLoggedin(false);
            }
        }
        async function getBookings() {
            let res = await axios.get(EP.BOOKINGS);
            setBookings(res.data.results);
        }
        setLoading(true);
        tokenchecker();
        getBookings()
        setLoading(false);
    }, []);
    if (loading === true || bookings === null) {
        return (<Spinner loading="true" />);
    } else {
        return (
            <React.Fragment>
                <Container className="dr-example-container">
                    <Top loggedin={loggedin} />
                    <br />
                    <h3 style={{ textAlign: 'center', color: '#312eff' }}>Bookings</h3>
                    {bookings &&
                        bookings.map((el, i) => {
                            return (
                                <div>
                                    <div><b>Date : </b>{el.bookEventDate}</div>
                                    <div><b>Booked By: </b>{el.name}</div>
                                    <div><b>Email: </b>{el.email}</div>
                                    <div><b>Mobile:</b> {el.mobile}</div>
                                    <div><b>Booked Slot :</b> {el.bookedSlot}</div>
                                    <hr />
                                </div>
                            )
                        })
                    }
                </Container>
            </React.Fragment >
        )

    }
}

export default Bookings;