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
import DatePicker from "react-datepicker";
import { Multiselect } from 'multiselect-react-dropdown';

const Schedule = props => {
    const [loggedin, setLoggedin] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dp, setDp] = useState(new Date());
    const [options, setOptions] = useState([
        { name: '12AM - 1AM', id: 0 },
        { name: '1AM - 2AM', id: 1 },
        { name: '2AM - 3AM', id: 2 },
        { name: '3AM - 4AM', id: 3 },
        { name: '4AM - 5AM', id: 4 },
        { name: '5AM - 6AM', id: 5 },
        { name: '6AM - 7AM', id: 6 },
        { name: '7AM - 8AM', id: 7 },
        { name: '8AM - 9AM', id: 8 },
        { name: '9AM - 10AM', id: 9 },
        { name: '10AM - 11AM', id: 10 },
        { name: '11AM - 12PM', id: 11 },
        { name: '12PM - 1PM', id: 12 },
        { name: '1PM - 2PM', id: 13 },
        { name: '2PM - 3PM', id: 14 },
        { name: '3PM - 4PM', id: 15 },
        { name: '4PM - 5PM', id: 16 },
        { name: '5PM - 6PM', id: 17 },
        { name: '6PM - 7PM', id: 18 },
        { name: '7PM - 8PM', id: 19 },
        { name: '8PM - 9PM', id: 20 },
        { name: '9PM - 10PM', id: 21 },
        { name: '10PM - 11PM', id: 22 },
        { name: '11PM - 12AM', id: 23 },
    ])
    const [selected, setSelected] = useState();
    const [alert, setAlert] = useState('');
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        async function tokenchecker() {
            const token = Cookie.getCookie("token");
            if (token) {
                setLoggedin(true);
            } else {
                setLoggedin(false);
            }
        }
        setLoading(true);
        tokenchecker();
        setLoading(false);
    }, []);
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
    async function saveslots() {
        setLoading(true);
        setAlert('')
        if (selected) {
            if (selected[0] === undefined) {
                setAlert("Select Slot")
                setVisible(true)
            } else {
                let date = toISOLocal(dp).split('T')[0];
                let slots = {};
                for (let i = 0; i < selected.length; i++) {
                    slots = Object.assign(slots, {
                        [selected[i].id]: {
                            "available": true,
                            "booked": false
                        }
                    });
                }
                const tk = Cookie.getCookie("token");
                const config = {
                    headers: { Authorization: `Bearer ${tk}` }
                };
                const bodyparameters = {
                    date,
                    slots: slots
                }
                let res = await axios.post(EP.SCHEDULE, bodyparameters, config);
                if (res.data.message === 'You must be logged in') {
                    Cookie.deleteCookie("token")
                } else {
                    setSelected()
                    setAlert(res.data.message)
                    setVisible(true)
                }
                setLoading(false);
            }
        } else {
            setAlert("Select Slot")
        }
    }
    if (loggedin === null || loading === true) {
        return (<Spinner loading="true" />);
    }

    if (loggedin === false) {
        return (<Redirect to={'/login'} />);
    }
    if (loggedin === true) {
        return (
            <React.Fragment>
                <Container className="dr-example-container">
                    <Top loggedin={loggedin} />
                    <br />
                    {alert &&
                        <div style={{ textAlign: 'center', paddingLeft: '25%', paddingRight: '25%' }}><Alert dismissible={() => setVisible(false)} open={visible} theme="warning">{alert}</Alert></div>}
                    <h2> Schedule Slots</h2>
                    <br />
                    <div>
                        <h4>Choose Date</h4>
                        <DatePicker
                            selected={dp}
                            onChange={(e) => { setDp(e) }}
                        />
                    </div>
                    <div>
                        <h4>Choose time</h4>
                        <Multiselect
                            options={options}
                            selectedValues={selected}
                            onSelect={(e) => { setSelected(e) }}
                            onRemove={(e) => { setSelected(e) }}
                            displayValue="name"
                            closeOnSelect={false}
                        />
                    </div>
                    <br />
                    <Button theme="success" pill onClick={saveslots}>Save Slots</Button>
                </Container>
            </React.Fragment>
        )
    }

}

export default Schedule;